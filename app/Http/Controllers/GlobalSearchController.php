<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Computer;
use App\Models\Violation;
use App\Models\Subject;
use Illuminate\Http\Request;

class GlobalSearchController extends Controller
{
    public function search(Request $request)
    {
        $query = trim($request->input('q', ''));

        if ($query === '') {
            return response()->json([
                'success' => true,
                'results' => []
            ]);
        }

        $results = collect();

        /*
        |--------------------------------------------------------------------------
        | SEARCH STUDENTS
        |--------------------------------------------------------------------------
        */

        $students = Student::query()
            ->where(function ($q) use ($query) {

                $q->where('student_id', 'like', "%{$query}%")
                  ->orWhere('fullname', 'like', "%{$query}%")
                  ->orWhere('course', 'like', "%{$query}%")
                  ->orWhere('year_level', 'like', "%{$query}%")
                  ->orWhere('section', 'like', "%{$query}%");

            })
            ->orderBy('fullname')
            ->limit(5)
            ->get();

        foreach ($students as $student) {

            $results->push([
                'type' => 'student',
                'icon' => 'fa-user-graduate',

                'title' =>
                    $student->fullname,

                'subtitle' =>
                    $student->student_id .
                    ' • ' .
                    ($student->course ?? 'No course') .
                    ' ' .
                    ($student->year_level ?? '') .
                    '-' .
                    ($student->section ?? ''),

                'url' =>
                    '/admin/students'
            ]);
        }


        /*
        |--------------------------------------------------------------------------
        | SEARCH COMPUTERS
        |--------------------------------------------------------------------------
        */

        $computers = Computer::query()
            ->where(function ($q) use ($query) {

                $q->where('computer_name', 'like', "%{$query}%")
                  ->orWhere('lab', 'like', "%{$query}%")
                  ->orWhere('ip_address', 'like', "%{$query}%")
                  ->orWhere('mac_address', 'like', "%{$query}%")
                  ->orWhere('status', 'like', "%{$query}%");

            })
            ->orderBy('computer_name')
            ->limit(5)
            ->get();

        foreach ($computers as $computer) {

            $status =
                ucfirst(
                    strtolower(
                        str_replace(
                            'inuse',
                            'In Use',
                            $computer->status ?? 'offline'
                        )
                    )
                );

            $results->push([
                'type' => 'computer',
                'icon' => 'fa-computer',

                'title' =>
                    $computer->computer_name,

                'subtitle' =>
                    ($computer->lab ?? 'No laboratory') .
                    ' • ' .
                    $status,

                'url' =>
                    '/admin/computers'
            ]);
        }


        /*
|--------------------------------------------------------------------------
| SEARCH SUBJECTS
|--------------------------------------------------------------------------
*/

$subjects = Subject::query()
    ->where(function ($q) use ($query) {

        $q->where('code', 'like', "%{$query}%")
          ->orWhere('name', 'like', "%{$query}%")
          ->orWhere('teacher', 'like', "%{$query}%")
          ->orWhere('course', 'like', "%{$query}%")
          ->orWhere('year_level', 'like', "%{$query}%")
          ->orWhere('semester', 'like', "%{$query}%");

    })
    ->orderBy('code')
    ->limit(5)
    ->get();

foreach ($subjects as $subject) {

    $results->push([
        'type' => 'subject',
        'icon' => 'fa-book',

        'title' =>
            $subject->code . ' — ' . $subject->name,

        'subtitle' =>
            ($subject->course ?? 'No course') .
            ' • ' .
            ($subject->year_level ?? 'No year level') .
            ' • ' .
            ($subject->semester ?? 'No semester'),

        'url' =>
            '/admin/subjects'
    ]);
}


        /*
        |--------------------------------------------------------------------------
        | SEARCH VIOLATION LOGS
        |--------------------------------------------------------------------------
        */

        $violations = Violation::query()
            ->where(function ($q) use ($query) {

                $q->where('student_name', 'like', "%{$query}%")
                  ->orWhere('computer_name', 'like', "%{$query}%")
                  ->orWhere('lab', 'like', "%{$query}%")
                  ->orWhere('violation', 'like', "%{$query}%")
                  ->orWhere('severity', 'like', "%{$query}%")
                  ->orWhere('status', 'like', "%{$query}%");

            })
            ->orderByDesc('violation_time')
            ->limit(5)
            ->get();

        foreach ($violations as $violation) {

            $subtitleParts = [];

            if ($violation->computer_name) {
                $subtitleParts[] =
                    $violation->computer_name;
            }

            if ($violation->lab) {
                $subtitleParts[] =
                    $violation->lab;
            }

            if ($violation->student_name) {
                $subtitleParts[] =
                    $violation->student_name;
            }

            $results->push([
                'type' => 'violation',
                'icon' => 'fa-triangle-exclamation',

                'title' =>
                    $violation->violation ??
                    'Violation',

                'subtitle' =>
                    implode(' • ', $subtitleParts),

                'url' =>
                    '/admin/violations'
            ]);
        }


        /*
        |--------------------------------------------------------------------------
        | RETURN RESULTS
        |--------------------------------------------------------------------------
        */

        return response()->json([
            'success' => true,
            'results' => $results->take(10)->values()
        ]);
    }
}