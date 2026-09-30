<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Attendance;
use App\Models\Schedule;
use Illuminate\Http\JsonResponse;

class StudentDashboardController extends Controller
{
    /**
     * =====================================================
     * STUDENT DASHBOARD DATA API
     * =====================================================
     */
    public function data(): JsonResponse
    {
        // -------------------------------------------------
        // CHECK STUDENT LOGIN
        // -------------------------------------------------
        if (!session('student_id')) {
            return response()->json([
                'success' => false,
                'message' => 'Student is not logged in.'
            ], 401);
        }


        // -------------------------------------------------
        // GET LOGGED-IN STUDENT
        // -------------------------------------------------
        $student = Student::find(session('student_id'));

        if (!$student) {

            session()->forget([
                'student_id',
                'student_name'
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Student record not found.'
            ], 404);
        }


        // -------------------------------------------------
        // TODAY
        // -------------------------------------------------
        $today = now();


        // -------------------------------------------------
        // TODAY'S ATTENDANCE
        // -------------------------------------------------
        $todayAttendance = Attendance::where(
            'student_id',
            $student->student_id
        )
        ->whereDate(
            'attendance_date',
            $today->toDateString()
        )
        ->latest('time_in')
        ->first();


        // -------------------------------------------------
        // STUDENT SCHEDULES
        // -------------------------------------------------
        $schedules = Schedule::where(
            'course',
            $student->course
        )
        ->where(
            'year_level',
            $student->year_level
        )
        ->where(
            'block',
            $student->section
        )
        ->orderBy('day')
        ->orderBy('time')
        ->get();


        // -------------------------------------------------
        // TODAY'S SCHEDULE
        // -------------------------------------------------
        $todayName = $today->format('D');

        $todaySchedules = $schedules
            ->filter(function ($schedule) use ($todayName) {

                $day = strtoupper(trim($schedule->day));

                /*
                 * Supported schedule formats:
                 *
                 * MWF
                 * TTh
                 * MON
                 * TUE
                 * WED
                 * THU
                 * FRI
                 * SAT
                 * SUN
                 */

                if ($todayName === 'Mon') {
                    return str_contains($day, 'M');
                }

                if ($todayName === 'Tue') {
                    return str_contains($day, 'T');
                }

                if ($todayName === 'Wed') {
                    return str_contains($day, 'W');
                }

                if ($todayName === 'Thu') {
                    return str_contains($day, 'TH');
                }

                if ($todayName === 'Fri') {
                    return str_contains($day, 'F');
                }

                if ($todayName === 'Sat') {
                    return str_contains($day, 'SAT');
                }

                if ($todayName === 'Sun') {
                    return str_contains($day, 'SUN');
                }

                return false;
            })
            ->values();


        // -------------------------------------------------
        // SUBJECT COUNT
        // -------------------------------------------------
        $subjectCount = $schedules
            ->unique('subject_code')
            ->count();


        // -------------------------------------------------
        // RETURN DATA
        // -------------------------------------------------
        return response()->json([

            'success' => true,

            'student' => [
                'id' => $student->id,
                'student_id' => $student->student_id,
                'fullname' => $student->fullname,
                'course' => $student->course,
                'year_level' => $student->year_level,
                'section' => $student->section,
                'email' => $student->email,
                'contact' => $student->contact,
                'profile_picture' => $student->profile_picture,
            ],


            // ---------------------------------------------
            // ATTENDANCE
            // ---------------------------------------------
            'attendance' => [

                'status' => $todayAttendance
                    ? $todayAttendance->status
                    : 'Not Checked In',

                'time_in' => $todayAttendance && $todayAttendance->time_in
                    ? $todayAttendance->time_in->format('h:i A')
                    : null,

                'time_out' => $todayAttendance && $todayAttendance->time_out
                    ? $todayAttendance->time_out->format('h:i A')
                    : null,

                'date' => $today->toDateString(),
            ],


            // ---------------------------------------------
            // SCHEDULE
            // ---------------------------------------------
            'schedule' => [

                'today' => $todaySchedules
                    ->map(function ($schedule) {

                        return [
                            'id' => $schedule->id,
                            'subject_code' => $schedule->subject_code,
                            'subject_name' => $schedule->subject_name,
                            'room' => $schedule->room,
                            'teacher' => $schedule->teacher,
                            'course' => $schedule->course,
                            'year_level' => $schedule->year_level,
                            'block' => $schedule->block,
                            'semester' => $schedule->semester,
                            'day' => $schedule->day,
                            'time' => $schedule->time,
                        ];

                    })
                    ->values(),

                'all' => $schedules
                    ->map(function ($schedule) {

                        return [
                            'id' => $schedule->id,
                            'subject_code' => $schedule->subject_code,
                            'subject_name' => $schedule->subject_name,
                            'room' => $schedule->room,
                            'teacher' => $schedule->teacher,
                            'course' => $schedule->course,
                            'year_level' => $schedule->year_level,
                            'block' => $schedule->block,
                            'semester' => $schedule->semester,
                            'day' => $schedule->day,
                            'time' => $schedule->time,
                        ];

                    })
                    ->values(),

            ],


            // ---------------------------------------------
            // SUMMARY
            // ---------------------------------------------
            'summary' => [

                'subjects' => $subjectCount,

                'today_classes' => $todaySchedules->count(),

                'total_classes' => $schedules->count(),

            ],


            // ---------------------------------------------
            // SERVER TIME
            // ---------------------------------------------
            'current_time' => $today->format('h:i A'),

            'current_date' => $today->format('Y-m-d'),

            'current_day' => $today->format('l'),

        ]);
    }
}