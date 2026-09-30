<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
    // GET /admin/subjects
    public function index()
    {
        $subjects = Subject::orderBy('semester')
            ->orderBy('course')
            ->orderBy('year_level')
            ->orderBy('code')
            ->get();

        return response()->json([
            'success' => true,
            'subjects' => $subjects
        ]);
    }


    

    // POST /admin/subjects
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50',
            'name' => 'required|string|max:255',
            'teacher' => 'nullable|string|max:255',
            'course' => 'required|string|max:100',
            'year_level' => 'required|string|max:50',
            'semester' => 'required|string|max:50',
        ]);

        $subject = Subject::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Subject added successfully.',
            'subject' => $subject
        ], 201);
    }

    // PUT /admin/subjects/{id}
    public function update(Request $request, $id)
    {
        $subject = Subject::find($id);

        if (!$subject) {
            return response()->json([
                'success' => false,
                'message' => 'Subject not found.'
            ], 404);
        }

        $validated = $request->validate([
            'code' => 'required|string|max:50',
            'name' => 'required|string|max:255',
            'teacher' => 'nullable|string|max:255',
            'course' => 'required|string|max:100',
            'year_level' => 'required|string|max:50',
            'semester' => 'required|string|max:50',
        ]);

        $subject->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Subject updated successfully.',
            'subject' => $subject
        ]);
    }

    // DELETE /admin/subjects/{id}
    public function destroy($id)
    {
        $subject = Subject::find($id);

        if (!$subject) {
            return response()->json([
                'success' => false,
                'message' => 'Subject not found.'
            ], 404);
        }

        $subject->delete();

        return response()->json([
            'success' => true,
            'message' => 'Subject deleted successfully.'
        ]);
    }
public function studentSubjects(Request $request)
{
    $student = auth('student')->user();

    if (!$student) {
        return response()->json([
            'success' => false,
            'message' => 'Unauthenticated.'
        ], 401);
    }

    $semester = trim($request->input('semester', '1st Semester'));

    $course = trim((string) $student->course);
    $yearLevel = trim((string) $student->year_level);
    $section = trim((string) $student->section);

    $subjects = Subject::query()
        ->whereRaw('TRIM(year_level) = ?', [$yearLevel])
        ->whereRaw('TRIM(semester) = ?', [$semester])
        ->where(function ($query) use ($course) {

            // Exact course
            $query->whereRaw('TRIM(course) = ?', [$course])

                // Example:
                // Student = BSIT
                // Database = BSIT / BSCS
                ->orWhereRaw(
                    "FIND_IN_SET(?, REPLACE(REPLACE(TRIM(course), ' ', ''), '/', ',')) > 0",
                    [$course]
                );
        })
        ->orderBy('code')
        ->get();

    return response()->json([
        'success' => true,

        'student' => [
            'student_id' => $student->student_id,
            'fullname' => $student->fullname,
            'course' => $student->course,
            'year_level' => $student->year_level,
            'section' => $student->section,
        ],

        'semester' => $semester,

        'filters' => [
            'course' => $course,
            'year_level' => $yearLevel,
            'semester' => $semester,
        ],

        'subjects' => $subjects
    ]);
}
}