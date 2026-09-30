<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Computer;
use App\Models\AttendanceRecord;
use App\Models\Violation;

class AdminDashboardController extends Controller
{
    /**
     * Show Admin Dashboard
     */
    public function index()
    {
        if (!session('admin_logged_in')) {
            return redirect()->route('admin');
        }

        return view('admin-dashboard');
    }


    /**
     * Return real-time dashboard data
     */
    public function data()
    {
        if (!session('admin_logged_in')) {
            return response()->json([
                'success' => false,
                'message' => 'You are not logged in.'
            ], 401);
        }


        // Current date
        $today = now()->toDateString();


        // =====================================================
        // REGISTERED STUDENTS
        // =====================================================

        $registeredStudents = Student::count();


        // =====================================================
        // STUDENTS PRESENT TODAY
        // Present + Late
        // =====================================================

        $studentsPresent = AttendanceRecord::whereDate(
            'attendance_date',
            $today
        )
        ->whereIn('status', [
            'Present',
            'Late'
        ])
        ->count();


        // =====================================================
        // COMPUTERS
        // =====================================================

        $totalComputers = Computer::count();

        $activeComputers = Computer::whereIn(
            'status',
            [
                'online',
                'Online',
                'inuse',
                'In Use'
            ]
        )->count();


        // =====================================================
        // VIOLATIONS TODAY
        // =====================================================

        $todaysViolations = Violation::whereDate(
            'violation_time',
            $today
        )->count();


        // =====================================================
        // UNRESOLVED VIOLATIONS
        // =====================================================

        $unresolvedViolations = Violation::whereDate(
            'violation_time',
            $today
        )
        ->where('status', 'Unresolved')
        ->count();


        // =====================================================
        // ATTENDANCE PERCENTAGE
        // =====================================================

        $attendancePercentage = $registeredStudents > 0
            ? round(
                ($studentsPresent / $registeredStudents) * 100,
                1
            )
            : 0;


        // =====================================================
        // RETURN DATA
        // =====================================================

        return response()->json([

            'success' => true,

            'students' => [
                'registered' => $registeredStudents,
            ],

            'attendance' => [
                'present' => $studentsPresent,
                'percentage' => $attendancePercentage,
            ],

            'computers' => [
                'active' => $activeComputers,
                'total' => $totalComputers,
            ],

            'violations' => [
                'today' => $todaysViolations,
                'unresolved' => $unresolvedViolations,
            ],

        ]);
    }


    public function search(Request $request)
{
    if (!session('admin_logged_in')) {
        return response()->json([
            'success' => false,
            'message' => 'Unauthorized.'
        ], 401);
    }

    $search = trim($request->input('q', ''));

    if ($search === '') {
        return response()->json([
            'success' => true,
            'results' => []
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | STUDENTS
    |--------------------------------------------------------------------------
    */

    $students = \App\Models\Student::query()
        ->where(function ($query) use ($search) {

            $query->where(
                'student_id',
                'like',
                "%{$search}%"
            )

            ->orWhere(
                'fullname',
                'like',
                "%{$search}%"
            )

            ->orWhere(
                'email',
                'like',
                "%{$search}%"
            )

            ->orWhere(
                'contact',
                'like',
                "%{$search}%"
            );
        })
        ->orderBy('fullname')
        ->limit(5)
        ->get();


    /*
    |--------------------------------------------------------------------------
    | COMPUTERS
    |--------------------------------------------------------------------------
    */

    $computers = \App\Models\Computer::query()
        ->where(function ($query) use ($search) {

            $query->where(
                'computer_name',
                'like',
                "%{$search}%"
            )

            ->orWhere(
                'lab',
                'like',
                "%{$search}%"
            )

            ->orWhere(
                'ip_address',
                'like',
                "%{$search}%"
            )

            ->orWhere(
                'mac_address',
                'like',
                "%{$search}%"
            );
        })
        ->orderBy('computer_name')
        ->limit(5)
        ->get();


    /*
    |--------------------------------------------------------------------------
    | VIOLATION LOGS
    |--------------------------------------------------------------------------
    */

    $violations = \App\Models\Violation::query()
        ->where(function ($query) use ($search) {

            $query->where(
                'student_name',
                'like',
                "%{$search}%"
            )

            ->orWhere(
                'computer_name',
                'like',
                "%{$search}%"
            )

            ->orWhere(
                'lab',
                'like',
                "%{$search}%"
            )

            ->orWhere(
                'violation',
                'like',
                "%{$search}%"
            )

            ->orWhere(
                'severity',
                'like',
                "%{$search}%"
            )

            ->orWhere(
                'status',
                'like',
                "%{$search}%"
            );
        })
        ->orderByDesc('violation_time')
        ->limit(5)
        ->get();


    /*
    |--------------------------------------------------------------------------
    | FORMAT RESULTS
    |--------------------------------------------------------------------------
    */

    $results = [];


    foreach ($students as $student) {

        $results[] = [
            'type' => 'student',
            'icon' => 'fa-user-graduate',
            'title' => $student->fullname,
            'subtitle' =>
                'Student ID: ' .
                ($student->student_id ?? 'N/A'),
            'url' => '/students'
        ];
    }


    foreach ($computers as $computer) {

        $results[] = [
            'type' => 'computer',
            'icon' => 'fa-computer',
            'title' => $computer->computer_name,
            'subtitle' =>
                ($computer->lab ?? 'Laboratory') .
                ' • ' .
                ($computer->status ?? 'Unknown'),
            'url' => '/admin/computers'
        ];
    }


    foreach ($violations as $violation) {

        $results[] = [
            'type' => 'violation',
            'icon' => 'fa-triangle-exclamation',
            'title' => $violation->violation,
            'subtitle' =>
                ($violation->student_name ?? 'Unknown Student') .
                ' • ' .
                ($violation->computer_name ?? 'Unknown PC'),
            'url' => '/admin/violations'
        ];
    }


    return response()->json([
        'success' => true,
        'results' => array_slice($results, 0, 10)
    ]);
}
}