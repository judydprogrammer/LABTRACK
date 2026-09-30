<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Violation;
use App\Models\Computer;
use App\Models\Subject;
use App\Models\Report;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function page()
    {
        return view('admin-reports');
    }

    public function data(Request $request)
    {
        $type = $request->input('type', 'Attendance Summary');
        $from = $request->input('from');
        $to = $request->input('to');

        switch ($type) {

            case 'Attendance Summary':

                $query = Attendance::query();

                if ($from) {
                    $query->whereDate(
                        'attendance_date',
                        '>=',
                        $from
                    );
                }

                if ($to) {
                    $query->whereDate(
                        'attendance_date',
                        '<=',
                        $to
                    );
                }

                $records = $query
                    ->orderBy('attendance_date')
                    ->orderBy('student_name')
                    ->get();

                return response()->json([
                    'success' => true,
                    'type' => $type,

                    'summary' => [
                        'total' => $records->count(),

                        'present' =>
                            $records
                                ->where('status', 'Present')
                                ->count(),

                        'late' =>
                            $records
                                ->where('status', 'Late')
                                ->count(),

                        'absent' =>
                            $records
                                ->where('status', 'Absent')
                                ->count(),
                    ],

                    'records' =>
                        $records->map(function ($record) {

                            return [
                                'studentId' =>
                                    $record->student_id,

                                'student' =>
                                    $record->student_name,

                                'block' =>
                                    $record->block,

                                'subject' =>
                                    $record->subject,

                                'computer' =>
                                    $record->computer_used,

                                'date' =>
                                    $record->attendance_date
                                        ? $record->attendance_date
                                            ->format('Y-m-d')
                                        : '',

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
                ]);


            case 'Violation Log Summary':

                $query = Violation::query();

                if ($from) {
                    $query->whereDate(
                        'violation_time',
                        '>=',
                        $from
                    );
                }

                if ($to) {
                    $query->whereDate(
                        'violation_time',
                        '<=',
                        $to
                    );
                }

                $records = $query
                    ->orderByDesc('violation_time')
                    ->get();

                return response()->json([
                    'success' => true,
                    'type' => $type,

                    'summary' => [
                        'total' => $records->count(),

                        'unresolved' =>
                            $records
                                ->where('status', 'Unresolved')
                                ->count(),

                        'resolved' =>
                            $records
                                ->where('status', 'Resolved')
                                ->count(),

                        'high' =>
                            $records
                                ->where('severity', 'High')
                                ->count(),

                        'medium' =>
                            $records
                                ->where('severity', 'Medium')
                                ->count(),

                        'low' =>
                            $records
                                ->where('severity', 'Low')
                                ->count(),
                    ],

                    'records' =>
                        $records->map(function ($record) {

                            return [
                                'student' =>
                                    $record->student_name,

                                'pc' =>
                                    $record->computer_name,

                                'lab' =>
                                    $record->lab,

                                'violation' =>
                                    $record->violation,

                                'severity' =>
                                    $record->severity,

                                'time' =>
                                    $record->violation_time
                                        ? $record->violation_time
                                            ->format('Y-m-d h:i A')
                                        : '',

                                'status' =>
                                    $record->status,
                            ];

                        })->values(),
                ]);


            case 'Computer Usage Summary':

                $computers = Computer::query()
                    ->orderBy('lab')
                    ->orderBy('computer_name')
                    ->get();

                return response()->json([
                    'success' => true,
                    'type' => $type,

                    'summary' => [
                        'total' => $computers->count(),

                        'online' =>
                            $computers
                                ->where('status', 'online')
                                ->count(),

                        'offline' =>
                            $computers
                                ->where('status', 'offline')
                                ->count(),

                        'inuse' =>
                            $computers
                                ->where('status', 'inuse')
                                ->count(),

                        'locked' =>
                            $computers
                                ->where('status', 'locked')
                                ->count(),
                    ],

                    'records' =>
                        $computers->map(function ($computer) {

                            return [
                                'computer' =>
                                    $computer->computer_name,

                                'lab' =>
                                    $computer->lab,

                                'ip' =>
                                    $computer->ip_address,

                                'mac' =>
                                    $computer->mac_address,

                                'status' =>
                                    $computer->status,

                                'os' =>
                                    $computer->operating_system,

                                'lastSeen' =>
                                    $computer->last_seen
                                        ? $computer->last_seen
                                            ->format('Y-m-d h:i A')
                                        : '',
                            ];

                        })->values(),
                ]);


            case 'Subject Performance Summary':

                $subjects = Subject::query()
                    ->orderBy('code')
                    ->get();

                return response()->json([
                    'success' => true,
                    'type' => $type,

                    'summary' => [
                        'total' =>
                            $subjects->count()
                    ],

                    'records' =>
                        $subjects->map(function ($subject) {

                            return [
                                'code' =>
                                    $subject->code,

                                'subject' =>
                                    $subject->name,

                                'teacher' =>
                                    $subject->teacher,

                                'course' =>
                                    $subject->course,

                                'yearLevel' =>
                                    $subject->year_level,

                                'semester' =>
                                    $subject->semester,
                            ];

                        })->values(),
                ]);


            default:

                return response()->json([
                    'success' => false,
                    'message' => 'Invalid report type.'
                ], 400);
        }
    }


public function history()
{
    $reports = Report::query()
        ->orderByDesc('generated_at')
        ->limit(10)
        ->get();

    return response()->json([
        'success' => true,

        'reports' => $reports->map(function ($report) {

            $name = $report->name;

            if ($report->date_from && $report->date_to) {

                $from = $report->date_from->format('M j');
                $to = $report->date_to->format('M j, Y');

                $name .= " — {$from}–{$to}";

            } elseif ($report->date_from) {

                $name .= " — From " .
                    $report->date_from->format('M j, Y');

            } elseif ($report->date_to) {

                $name .= " — Until " .
                    $report->date_to->format('M j, Y');
            }

            return [
                'id' => $report->id,

                'name' => $name,

                'type' => $report->type,

                'format' => $report->format,

                'from' => $report->date_from
                    ? $report->date_from->format('Y-m-d')
                    : null,

                'to' => $report->date_to
                    ? $report->date_to->format('Y-m-d')
                    : null,

                'date' => 'Generated ' .
                    $report->generated_at
                        ->format('M j, Y'),

                'generatedAt' =>
                    $report->generated_at
                        ->toISOString(),
            ];
        })->values(),
    ]);
}

public function store(Request $request)
{
    $validated = $request->validate([
        'type' => [
            'required',
            'string',
            'in:Attendance Summary,Violation Log Summary,Computer Usage Summary,Subject Performance Summary'
        ],

        'format' => [
            'required',
            'string',
            'in:pdf,csv,excel'
        ],

        'from' => [
            'nullable',
            'date'
        ],

        'to' => [
            'nullable',
            'date',
            'after_or_equal:from'
        ],
    ]);

    $report = Report::create([
        'name' => $validated['type'],
        'type' => $validated['type'],
        'format' => $validated['format'],
        'date_from' => $validated['from'] ?? null,
        'date_to' => $validated['to'] ?? null,
        'generated_at' => now(),
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Report saved successfully.',
        'report' => [
            'id' => $report->id,
            'name' => $report->name,
            'type' => $report->type,
            'format' => $report->format,
            'from' => $report->date_from
                ? $report->date_from->format('Y-m-d')
                : null,
            'to' => $report->date_to
                ? $report->date_to->format('Y-m-d')
                : null,
            'date' => 'Generated ' .
                $report->generated_at->format('M j, Y'),
        ],
    ], 201);
}


public function destroy($id)
{
    $report = Report::find($id);

    if (!$report) {
        return response()->json([
            'success' => false,
            'message' => 'Report not found.'
        ], 404);
    }

    $report->delete();

    return response()->json([
        'success' => true,
        'message' => 'Report deleted successfully.'
    ]);
}
}