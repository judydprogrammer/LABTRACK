<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class StudentAuthController extends Controller
{
    // =========================
    // STUDENT LOGIN
    // =========================
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        $student = Student::where(
            'student_id',
            $request->username
        )->first();

        // Student ID doesn't exist
        if (!$student) {
            return back()
                ->withInput()
                ->with('error', 'Invalid Student ID or Password.');
        }

        // Password is incorrect
        if (!Hash::check($request->password, $student->password)) {
            return back()
                ->withInput()
                ->with('error', 'Invalid Student ID or Password.');
        }

        // ==========================================
        // IMPORTANT:
        // LOGIN THE STUDENT USING LARAVEL GUARD
        // ==========================================
        Auth::guard('student')->login($student);

        $request->session()->regenerate();

        session([
            'student_id' => $student->id,
            'student_name' => $student->fullname,
        ]);

        return redirect()->route('student.dashboard');
    }


    // =========================
    // STUDENT LOGOUT
    // =========================
    public function logout(Request $request)
    {
        // IMPORTANT:
        // Logout from the student guard
        Auth::guard('student')->logout();

        // Destroy the session
        $request->session()->invalidate();

        // Generate a new CSRF token
        $request->session()->regenerateToken();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully.',
            'redirect' => route('student.login')
        ]);
    }


    // =========================
    // QR CODE LOGIN
    // =========================
    public function qrLogin(Request $request)
    {
        $request->validate([
            'student_id' => 'required|string',
        ]);

        $student = Student::where(
            'student_id',
            $request->student_id
        )->first();

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'Student ID not found.'
            ], 404);
        }

        // ==========================================
        // IMPORTANT:
        // QR LOGIN ALSO NEEDS STUDENT GUARD LOGIN
        // ==========================================
        Auth::guard('student')->login($student);

        $request->session()->regenerate();

        // Keep existing session values
        session([
            'student_id' => $student->id,
            'student_name' => $student->fullname,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Student verified successfully.',
            'redirect' => route('student.dashboard')
        ]);
    }

    public function studentSubjects(Request $request)
{
    $student = auth('student')->user();

    if (!$student) {
        return response()->json([
            'success' => false,
            'message' => 'Student not authenticated.'
        ], 401);
    }

    $yearLevel = $request->year_level;
    $semester = $request->semester;

    $subjects = Subject::where('course', $student->course)
        ->where('year_level', $yearLevel)
        ->where('semester', $semester)
        ->orderBy('code')
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

        'selected' => [
            'year_level' => $yearLevel,
            'semester' => $semester,
        ],

        'subjects' => $subjects
    ]);
}
}