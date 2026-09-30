<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    public function index()
    {
        $schedules = Schedule::orderBy('course')
            ->orderBy('year_level')
            ->orderBy('block')
            ->get();

        return view('admin-sched-management', compact('schedules'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject_code' => 'required|string|max:50',
            'subject_name' => 'required|string|max:255',
            'room' => 'required|string|max:100',
            'teacher' => 'required|string|max:255',
            'course' => 'required|string|max:50',
            'year_level' => 'required|string|max:50',
            'block' => 'required|string|max:10',
            'semester' => 'required|string|max:50',
            'day' => 'required|string|max:50',
            'time' => 'required|string|max:100',
        ]);

        $schedule = Schedule::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Schedule added successfully.',
            'schedule' => $schedule
        ]);
    }

    public function update(Request $request, Schedule $schedule)
    {
        $validated = $request->validate([
            'subject_code' => 'required|string|max:50',
            'subject_name' => 'required|string|max:255',
            'room' => 'required|string|max:100',
            'teacher' => 'required|string|max:255',
            'course' => 'required|string|max:50',
            'year_level' => 'required|string|max:50',
            'block' => 'required|string|max:10',
            'semester' => 'required|string|max:50',
            'day' => 'required|string|max:50',
            'time' => 'required|string|max:100',
        ]);

        $schedule->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Schedule updated successfully.',
            'schedule' => $schedule
        ]);
    }

    public function destroy(Schedule $schedule)
    {
        $schedule->delete();

        return response()->json([
            'success' => true,
            'message' => 'Schedule deleted successfully.'
        ]);
    }

public function studentSchedule(Request $request)
{
    $student = auth('student')->user();

    if (!$student) {
        return response()->json([
            'success' => false,
            'message' => 'Unauthenticated.'
        ], 401);
    }

    $semester = $request->input('semester', '1st Semester');

    /*
    |--------------------------------------------------------------------------
    | STUDENT INFORMATION
    |--------------------------------------------------------------------------
    */

    $course = trim((string) $student->course);
    $yearLevel = trim((string) $student->year_level);
    $section = trim((string) $student->section);

    /*
    |--------------------------------------------------------------------------
    | FIND SCHEDULE
    |
    | Student section = Schedule block
    |--------------------------------------------------------------------------
    */

    $schedules = Schedule::query()
        ->where('semester', $semester)
        ->where('year_level', $yearLevel)

        ->where(function ($query) use ($course) {
            $query->where('course', $course)
                ->orWhere('course', 'LIKE', '%' . $course . '%');
        })

        ->where(function ($query) use ($section) {
            $query->where('block', $section)
                ->orWhere('block', 'LIKE', '%' . $section . '%');
        })

        ->orderByRaw("
            CASE day
                WHEN 'Monday' THEN 1
                WHEN 'Tuesday' THEN 2
                WHEN 'Wednesday' THEN 3
                WHEN 'Thursday' THEN 4
                WHEN 'Friday' THEN 5
                WHEN 'Saturday' THEN 6
                WHEN 'Sunday' THEN 7
                ELSE 8
            END
        ")

        ->orderBy('time')
        ->get();

    return response()->json([
        'success' => true,

        'student' => [
            'id' => $student->id,
            'student_id' => $student->student_id,
            'fullname' => $student->fullname,
            'course' => $student->course,
            'year_level' => $student->year_level,
            'section' => $student->section,
        ],

        'semester' => $semester,

        'schedules' => $schedules
    ]);
}
}