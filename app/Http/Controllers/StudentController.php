<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class StudentController extends Controller
{
    // DISPLAY ALL STUDENTS
    public function index()
    {
        $students = Student::latest()->get();

        return view('Student.index', compact('students'));
    }


    // REALTIME STUDENT DATA
    public function data()
    {
        $students = Student::latest()->get();

        return response()->json([
            'success' => true,
            'students' => $students
        ]);
    }


    // SHOW ADD STUDENT FORM
    public function create()
    {
        return view('Student.create');
    }


    // SAVE NEW STUDENT
    public function store(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string|max:255',
            'student_id' => 'required|unique:students,student_id',
            'password' => 'required|min:6|confirmed',

            // Profile Picture
            'profile_picture' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $student = new Student();

        $student->student_id = $request->student_id;

        // full_name from signup → fullname column
        $student->fullname = $request->full_name;

        // Hash password
        $student->password = Hash::make($request->password);

        // Save profile picture
        if ($request->hasFile('profile_picture')) {

            $path = $request->file('profile_picture')
                ->store('profile_pictures', 'public');

            $student->profile_picture = $path;
        }

        $student->save();

        return redirect()
            ->route('student.login')
            ->with(
                'success',
                'Account created successfully. You can now login.'
            );
    }


    // VIEW ONE STUDENT
    public function show(Student $student)
    {
        return view('Student.show', compact('student'));
    }


    // SHOW EDIT FORM
    public function edit(Student $student)
    {
        return view('Student.edit', compact('student'));
    }


    // ADMIN UPDATE STUDENT
    public function update(Request $request, Student $student)
    {
        $request->validate([
            'student_id' => 'required|unique:students,student_id,' . $student->id,
            'fullname' => 'required|string|max:255',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|string',
            'contact' => 'nullable|string|max:20',
            'email' => 'required|email|unique:students,email,' . $student->id,
            'address' => 'nullable|string',
            'course' => 'nullable|string',
            'year_level' => 'nullable|string',
            'section' => 'nullable|string',
            'password' => 'nullable|min:6|confirmed',
        ]);

        $student->student_id = $request->student_id;
        $student->fullname = $request->fullname;
        $student->date_of_birth = $request->date_of_birth;
        $student->gender = $request->gender;
        $student->contact = $request->contact;
        $student->email = $request->email;
        $student->address = $request->address;
        $student->course = $request->course;
        $student->year_level = $request->year_level;
        $student->section = $request->section;

        if ($request->filled('password')) {
            $student->password = Hash::make($request->password);
        }

        $student->save();

        return redirect()
            ->route('students.index')
            ->with('success', 'Student updated successfully.');
    }


    // DELETE STUDENT
    public function destroy(Student $student)
    {
        $student->delete();

        return redirect()
            ->route('students.index')
            ->with('success', 'Student deleted successfully.');
    }


    // UPDATE PROFILE PICTURE
    // UPDATE PROFILE PICTURE
public function updateProfilePicture(Request $request)
{
    $request->validate([
        'profile_picture' =>
            'required|image|mimes:jpg,jpeg,png,webp|max:2048',
    ]);

    $student = Student::find(session('student_id'));

    if (!$student) {
        return redirect()
            ->route('student.login')
            ->with('error', 'Student account not found.');
    }

    // Delete old picture
    if ($student->profile_picture) {

        $oldPath = storage_path(
            'app/public/' . $student->profile_picture
        );

        if (file_exists($oldPath)) {
            unlink($oldPath);
        }
    }

    // Save new picture
    $path = $request->file('profile_picture')
        ->store('profile_pictures', 'public');

    $student->profile_picture = $path;

    $student->save();

    // STAY ON MY PROFILE
    return redirect()
        ->route('student.dashboard', [
            'page' => 'profile',
            'saved' => 'profile'
        ]);
}


    // UPDATE STUDENT OWN PROFILE
    // UPDATE STUDENT OWN PROFILE
public function updateProfile(Request $request)
{
    $student = Student::find(session('student_id'));

    if (!$student) {
        return redirect()
            ->route('student.login')
            ->with('error', 'Student account not found.');
    }

    $request->validate([
        'fullname' => 'required|string|max:255',
        'student_id' => 'required|string|max:255|unique:students,student_id,' . $student->id,
        'date_of_birth' => 'nullable|date',
        'gender' => 'nullable|string|max:20',
        'email' => 'nullable|email|unique:students,email,' . $student->id,
        'contact' => 'nullable|string|max:20',
        'address' => 'nullable|string|max:255',
        'course' => 'nullable|string|max:100',
        'year_level' => 'nullable|string|max:50',
        'section' => 'nullable|string|max:50',
    ]);

    // UPDATE DATA
    $student->fullname = $request->fullname;
    $student->student_id = $request->student_id;
    $student->date_of_birth = $request->date_of_birth;
    $student->gender = $request->gender;
    $student->email = $request->email;
    $student->contact = $request->contact;
    $student->address = $request->address;
    $student->course = $request->course;
    $student->year_level = $request->year_level;
    $student->section = $request->section;

    // SAVE TO DATABASE
    $student->save();

    // UPDATE SESSION NAME
    session([
        'student_name' => $student->fullname
    ]);

    // STAY ON MY PROFILE
    return redirect()
    ->route('student.dashboard', [
        'page' => 'profile',
        'saved' => 'profile'
    ]);
}

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:8|confirmed',
        ], [
            'current_password.required' => 'Please enter your current password.',
            'new_password.required' => 'Please enter your new password.',
            'new_password.min' => 'New password must be at least 8 characters.',
            'new_password.confirmed' => 'New password and confirmation do not match.',
        ]);

        // Get the currently logged-in student
        $student = auth()->user();

        if (!$student) {
            return redirect('/dashboard?page=settings')
                ->withErrors([
                    'password' => 'Your session has expired. Please log in again.'
                ]);
        }

        // Check current password
        if (!Hash::check($request->current_password, $student->password)) {
            return redirect('/dashboard?page=settings')
                ->withErrors([
                    'password' => 'Current password is incorrect.'
                ]);
        }

        // Update password
        $student->password = Hash::make($request->new_password);
        $student->save();

        return redirect('/dashboard?page=settings')
            ->with('password_success', 'Password updated successfully.');
    }
}