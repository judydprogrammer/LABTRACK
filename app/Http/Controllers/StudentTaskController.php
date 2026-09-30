<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Task;
use App\Models\TaskCompletion;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudentTaskController extends Controller
{
    /**
     * =====================================================
     * GET STUDENT TASKS
     * =====================================================
     */
    public function index(): JsonResponse
    {
        if (!session('student_id')) {

            return response()->json([
                'success' => false,
                'message' => 'Student is not logged in.'
            ], 401);
        }


        $student = Student::find(
            session('student_id')
        );


        if (!$student) {

            return response()->json([
                'success' => false,
                'message' => 'Student record not found.'
            ], 404);
        }


        /*
         * Get tasks assigned to this student's:
         *
         * Course
         * Year Level
         * Section
         */
        $tasks = Task::where(function ($query) use ($student) {

            $query->whereNull('course')
                ->orWhere('course', $student->course);

        })
        ->where(function ($query) use ($student) {

            $query->whereNull('year_level')
                ->orWhere(
                    'year_level',
                    $student->year_level
                );

        })
        ->where(function ($query) use ($student) {

            $query->whereNull('section')
                ->orWhere(
                    'section',
                    $student->section
                );

        })
        ->orderByRaw(
            'due_date IS NULL, due_date ASC'
        )
        ->get();


        /*
         * Get this student's completed tasks.
         */
        $completedTaskIds =
            TaskCompletion::where(
                'student_id',
                $student->id
            )
            ->whereNotNull('completed_at')
            ->pluck('task_id')
            ->toArray();


        /*
         * Format tasks for JavaScript.
         */
        $formattedTasks =
            $tasks->map(function ($task) use (
                $completedTaskIds
            ) {

                $completed =
                    in_array(
                        $task->id,
                        $completedTaskIds
                    );


                return [

                    'id' =>
                        $task->id,

                    'title' =>
                        $task->title,

                    'description' =>
                        $task->description,

                    'subject_code' =>
                        $task->subject_code,

                    'course' =>
                        $task->course,

                    'year_level' =>
                        $task->year_level,

                    'section' =>
                        $task->section,

                    'due_date' =>
                        $task->due_date
                            ? $task->due_date
                                ->format('Y-m-d H:i:s')
                            : null,

                    'completed' =>
                        $completed,

                ];
            });


        return response()->json([

            'success' => true,

            'student' => [
                'id' => $student->id,
                'student_id' => $student->student_id,
                'fullname' => $student->fullname,
            ],

            'tasks' => $formattedTasks,

            'summary' => [
                'total' =>
                    $formattedTasks->count(),

                'completed' =>
                    $formattedTasks
                        ->where('completed', true)
                        ->count(),

                'pending' =>
                    $formattedTasks
                        ->where('completed', false)
                        ->count(),
            ],

        ]);
    }


    /**
     * =====================================================
     * MARK TASK AS COMPLETED / PENDING
     * =====================================================
     */
    public function toggle(
        Request $request,
        Task $task
    ): JsonResponse {

        if (!session('student_id')) {

            return response()->json([
                'success' => false,
                'message' => 'Student is not logged in.'
            ], 401);
        }


        $student = Student::find(
            session('student_id')
        );


        if (!$student) {

            return response()->json([
                'success' => false,
                'message' => 'Student record not found.'
            ], 404);
        }


        /*
         * Make sure the task belongs
         * to this student's group.
         */
        if (
            $task->course !== null &&
            $task->course !== $student->course
        ) {

            return response()->json([
                'success' => false,
                'message' => 'This task is not assigned to you.'
            ], 403);
        }


        if (
            $task->year_level !== null &&
            $task->year_level !== $student->year_level
        ) {

            return response()->json([
                'success' => false,
                'message' => 'This task is not assigned to you.'
            ], 403);
        }


        if (
            $task->section !== null &&
            $task->section !== $student->section
        ) {

            return response()->json([
                'success' => false,
                'message' => 'This task is not assigned to you.'
            ], 403);
        }


        $completion =
            TaskCompletion::firstOrNew([
                'task_id' =>
                    $task->id,

                'student_id' =>
                    $student->id,
            ]);


        /*
         * Toggle completed state.
         */
        if ($completion->exists &&
            $completion->completed_at !== null) {

            $completion->completed_at = null;

            $message =
                'Task marked as pending.';

        } else {

            $completion->completed_at =
                now();

            $message =
                'Task marked as completed.';
        }


        $completion->save();


        return response()->json([

            'success' => true,

            'message' => $message,

            'completed' =>
                $completion->completed_at !== null,

            'task_id' =>
                $task->id,

        ]);
    }
}