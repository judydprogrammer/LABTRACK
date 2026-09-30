<?php

namespace App\Http\Controllers;

use App\Models\AttendanceRecord;
use Illuminate\Http\Request;

class AttendanceRecordController extends Controller
{
    /**
     * Attendance Records page
     */
    public function page()
    {
        return view('admin-attendance-records');
    }


    /**
     * Get attendance records
     */
    public function index(Request $request)
    {
        $query = AttendanceRecord::query();


        /*
        |--------------------------------------------------------------------------
        | DATE FILTER
        |--------------------------------------------------------------------------
        */

        if ($request->filled('date')) {
            $query->whereDate(
                'attendance_date',
                $request->date
            );
        }


        /*
        |--------------------------------------------------------------------------
        | SUBJECT FILTER
        |--------------------------------------------------------------------------
        */

        if (
            $request->filled('subject') &&
            $request->subject !== 'all'
        ) {
            $query->where(
                'subject',
                $request->subject
            );
        }


        /*
        |--------------------------------------------------------------------------
        | BLOCK FILTER
        |--------------------------------------------------------------------------
        */

        if (
            $request->filled('block') &&
            $request->block !== 'all'
        ) {
            $query->where(
                'block',
                $request->block
            );
        }


        /*
        |--------------------------------------------------------------------------
        | STATUS FILTER
        |--------------------------------------------------------------------------
        */

        if (
            $request->filled('status') &&
            $request->status !== 'all'
        ) {
            $query->where(
                'status',
                $request->status
            );
        }


        /*
        |--------------------------------------------------------------------------
        | SEARCH
        |--------------------------------------------------------------------------
        */

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
                )

                ->orWhere(
                    
                    'like',
                    "%{$search}%"
                );
            });
        }


        /*
        |--------------------------------------------------------------------------
        | GET RECORDS
        |--------------------------------------------------------------------------
        */

        $records = $query
            ->orderBy('block')
            ->orderBy('student_name')
            ->get();


        return response()->json([
            'success' => true,
            'records' => $records,
        ]);
    }


    /**
     * Store attendance record
     */
    public function store(Request $request)
    {
        $validated = $request->validate([

            'student_id' =>
                'required|string|max:50',

            'student_name' =>
                'required|string|max:100',

            'block' =>
                'required|string|max:50',

            'subject' =>
                'required|string|max:100',

            'computer_used' =>
                'nullable|string|max:50',

            'attendance_date' =>
                'required|date',

            'time_in' =>
                'nullable|date_format:H:i',

            'time_out' =>
                'nullable|date_format:H:i',

            'status' =>
                'required|in:Present,Late,Absent',
        ]);


        $record =
            AttendanceRecord::create($validated);


        return response()->json([
            'success' => true,
            'message' =>
                'Attendance record added successfully.',
            'record' => $record,
        ], 201);
    }


    /**
     * Update attendance record
     */
    public function update(
        Request $request,
        AttendanceRecord $attendanceRecord
    ) {

        $validated = $request->validate([

            'student_id' =>
                'required|string|max:50',

            'student_name' =>
                'required|string|max:100',

            'block' =>
                'required|string|max:50',

            'subject' =>
                'required|string|max:100',

            'computer_used' =>
                'nullable|string|max:50',

            'attendance_date' =>
                'required|date',

            'time_in' =>
                'nullable|date_format:H:i',

            'time_out' =>
                'nullable|date_format:H:i',

            'status' =>
                'required|in:Present,Late,Absent',
        ]);


        $attendanceRecord->update(
            $validated
        );


        return response()->json([
            'success' => true,
            'message' =>
                'Attendance record updated successfully.',
            'record' => $attendanceRecord,
        ]);
    }


    /**
     * Delete attendance record
     */
    public function destroy(
        AttendanceRecord $attendanceRecord
    ) {

        $attendanceRecord->delete();


        return response()->json([
            'success' => true,
            'message' =>
                'Attendance record deleted successfully.',
        ]);
    }
}