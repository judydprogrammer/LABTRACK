<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Subject;
use App\Models\Student;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    // =====================================================
    // ADMIN ATTENDANCE PAGE
    // =====================================================

    public function page()
    {
        return view('admin-attendance-records');
    }


    // =====================================================
    // ADMIN ATTENDANCE DATA
    // =====================================================

    public function index(Request $request)
    {
        $query = Attendance::query();

        // DATE FILTER
        if ($request->filled('date')) {
            $query->whereDate(
                'attendance_date',
                $request->date
            );
        }

        // SUBJECT FILTER
        if (
            $request->filled('subject') &&
            $request->subject !== 'all'
        ) {
            $query->where(
                'subject',
                $request->subject
            );
        }

        // BLOCK FILTER
        if (
            $request->filled('block') &&
            $request->block !== 'all'
        ) {
            $query->where(
                'block',
                $request->block
            );
        }

        // STATUS FILTER
        if (
            $request->filled('status') &&
            $request->status !== 'all'
        ) {
            $query->where(
                'status',
                $request->status
            );
        }

        // SEARCH
        if ($request->filled('search')) {

            $search = $request->search;

            $query->where(function ($q) use ($search) {

                $q->where(
                    'student_id',
                    'like',
                    "%{$search}%"
                )

                ->orWhere(
                    'student_name',
                    'like',
                    "%{$search}%"
                )

                ->orWhere(
                    'block',
                    'like',
                    "%{$search}%"
                )

                ->orWhere(
                    'subject',
                    'like',
                    "%{$search}%"
                );
            });
        }

        $records = $query
            ->orderBy('attendance_date', 'desc')
            ->orderBy('block')
            ->orderBy('student_name')
            ->get();

        $subjects = Subject::query()
            ->orderBy('code')
            ->get([
                'code',
                'name'
            ]);

        return response()->json([

            'success' => true,

            'records' => $records->map(function ($record) {

                return [

                    'id' => $record->id,

                    'studentId' =>
                        $record->student_id,

                    'name' =>
                        $record->student_name,

                    'block' =>
                        $record->block,

                    'subject' =>
                        $record->subject,

                    'date' =>
                        $record->attendance_date
                            ? $record->attendance_date
                                ->format('Y-m-d')
                            : null,

                    'timeIn' =>
                        $record->time_in
                            ? $record->time_in
                                ->format('h:i A')
                            : '',

                    'timeOut' =>
                        $record->time_out
                            ? $record->time_out
                                ->format('h:i A')
                            : '',

                    'status' =>
                        $record->status,
                ];
            })->values(),

            'subjects' => $subjects->map(function ($subject) {

                return [

                    'code' =>
                        $subject->code,

                    'name' =>
                        $subject->name,

                    'label' =>
                        trim(
                            $subject->code .
                            ' ' .
                            $subject->name
                        ),
                ];

            })->values(),
        ]);
    }

// =====================================================
// STUDENT ATTENDANCE PAGE
// =====================================================

public function studentPage()
{
    if (!session('student_id')) {
        return redirect()->route('student.login');
    }

    $student = Student::find(session('student_id'));

    if (!$student) {
        session()->forget([
            'student_id',
            'student_name'
        ]);

        return redirect()->route('student.login');
    }

    // =====================================================
    // PROFILE IMAGE
    // =====================================================

    $profileImage = $student->profile_picture
        ? asset('storage/' . $student->profile_picture)
        : asset('images/PROFILE.jpg');


    // =====================================================
    // STUDENT SCHEDULE
    // =====================================================

    $schedules = \App\Models\Schedule::query()
        ->where('course', $student->course)
        ->where('year_level', $student->year_level)
        ->where('block', $student->section)
        ->where('semester', '1st Semester')
        ->orderBy('subject_code')
        ->get([
            'subject_code',
            'subject_name',
            'teacher',
            'day',
            'time',
            'room'
        ]);


    // =====================================================
    // RETURN ATTENDANCE PAGE
    // =====================================================

    return view(
        'student-attendance',
        compact(
            'student',
            'schedules',
            'profileImage'
        )
    );
}

    // =====================================================
    // STUDENT ATTENDANCE RECORDS
    // =====================================================

    public function studentRecords()
    {
        // Check login
        if (!session('student_id')) {
            return response()->json([
                'success' => false,
                'message' => 'Student is not logged in.'
            ], 401);
        }

       $student = Student::find(session('student_id'));

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'Student record not found.'
            ], 404);
        }

        $records = Attendance::where(
            'student_id',
            $student->student_id
        )
        ->orderByDesc('attendance_date')
        ->orderByDesc('time_in')
        ->get();

        return response()->json([

            'success' => true,

            'records' => $records->map(function ($record) {

                return [

                    'id' =>
                        $record->id,

                    'subject' =>
                        $record->subject,
                    'instructor' => $record->instructor,
                    
                    'schedule' => $record->schedule,

                    'date' =>
                        $record->attendance_date
                            ? $record->attendance_date
                                ->format('Y-m-d')
                            : null,

                    'timeIn' =>
                        $record->time_in
                            ? $record->time_in
                                ->format('h:i A')
                            : '—',

                    'timeOut' =>
                        $record->time_out
                            ? $record->time_out
                                ->format('h:i A')
                            : '—',

                    'status' =>
                        $record->status,
                ];
            })->values(),
        ]);
    }


    // =====================================================
    // STUDENT TIME IN
    // =====================================================

    public function timeIn(Request $request)
{
    if (!session('student_id')) {
        return response()->json([
            'success' => false,
            'message' => 'Student is not logged in.'
        ], 401);
    }

    $student = Student::find(session('student_id'));

    if (!$student) {
        return response()->json([
            'success' => false,
            'message' => 'Student record not found.'
        ], 404);
    }

    $validated = $request->validate([
        'subject' => 'required|string|max:100',
        'instructor' => 'required|string|max:100',
        'schedule' => 'required|string|max:100',
    ]);

    $today = now()->toDateString();

    $block = $student->course
        . ' ' .
        $student->year_level
        . '-' .
        $student->section;

    $existing = Attendance::where('student_id', $student->student_id)
        ->where('subject', $validated['subject'])
        ->whereDate('attendance_date', $today)
        ->first();

    if ($existing) {
        return response()->json([
            'success' => false,
            'message' => 'You already recorded attendance for this subject today.'
        ], 422);
    }

    $record = Attendance::create([
        'student_id' => $student->student_id,
        'student_name' => $student->fullname,
        'block' => $block,
        'subject' => $validated['subject'],
        'instructor' => $validated['instructor'],
        'schedule' => $validated['schedule'],
        'attendance_date' => $today,
        'time_in' => now()->format('H:i:s'),
        'time_out' => null,
        'status' => 'Present',
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Time in recorded successfully.',
        'record' => [
            'id' => $record->id,
            'subject' => $record->subject,
            'instructor' => $record->instructor,
            'schedule' => $record->schedule,
            'date' => $record->attendance_date->format('Y-m-d'),
            'timeIn' => $record->time_in
                ? $record->time_in->format('h:i A')
                : '—',
            'timeOut' => '—',
            'status' => $record->status,
        ]
    ]);
}

// =====================================================
// STUDENT TIME OUT
// =====================================================

public function timeOut(Request $request)
{
    // CHECK LOGIN
    if (!session('student_id')) {
        return response()->json([
            'success' => false,
            'message' => 'Student is not logged in.'
        ], 401);
    }

    // GET STUDENT
    $student = Student::find(session('student_id'));

    if (!$student) {
        return response()->json([
            'success' => false,
            'message' => 'Student record not found.'
        ], 404);
    }

    // VALIDATE
    $validated = $request->validate([
        'subject' => 'required|string|max:100',
    ]);

    // FIND TODAY'S ACTIVE ATTENDANCE
    $record = Attendance::where(
        'student_id',
        $student->student_id
    )
    ->where(
        'subject',
        $validated['subject']
    )
    ->whereDate(
        'attendance_date',
        now()->toDateString()
    )
    ->whereNotNull('time_in')
    ->whereNull('time_out')
    ->first();

    // NO ACTIVE RECORD
    if (!$record) {
        return response()->json([
            'success' => false,
            'message' => 'No active attendance record was found.'
        ], 404);
    }

    // SAVE TIME OUT
    $record->update([
        'time_out' => now()->format('H:i:s'),
    ]);

    // REFRESH DATABASE RECORD
    $record->refresh();

    return response()->json([
        'success' => true,

        'message' => 'Time out recorded successfully.',

        'record' => [
            'id' => $record->id,

            'subject' => $record->subject,

            'instructor' => $record->instructor,

            'schedule' => $record->schedule,

            'date' => $record->attendance_date
                ? $record->attendance_date->format('Y-m-d')
                : null,

            'timeIn' => $record->time_in
                ? $record->time_in->format('h:i A')
                : '—',

            'timeOut' => $record->time_out
                ? $record->time_out->format('h:i A')
                : '—',

            'status' => $record->status,
        ]
    ]);
}
}