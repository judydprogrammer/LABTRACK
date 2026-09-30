<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\StudentAuthController;
use App\Models\Schedule;
use App\Http\Controllers\AdminScheduleController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\ComputerController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\ApplicationActivityController;
use App\Http\Controllers\AttendanceRecordController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\ViolationController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\StudentDashboardController;
use App\Http\Controllers\StudentTaskController;
use App\Http\Controllers\GlobalSearchController;

// =====================================================
// HOME PAGE
// =====================================================

Route::get('/', function () {
    return view('home');
})->name('home');


// =====================================================
// ADMIN
// =====================================================

// ADMIN LOGIN PAGE
Route::get('/admin', function () {
    return view('admin');
})->name('admin');


// ADMIN LOGIN PROCESS
Route::post('/admin/login', [AdminAuthController::class, 'login'])
    ->name('admin.login');


// ADMIN FORGOT PASSWORD PAGE
Route::get('/admin/forgot-password', function () {
    return view('admin-forgot-password');
})->name('admin.forgot-password');


// ADMIN RESET PASSWORD
Route::post('/admin/reset-password', function () {
    return back()->with('success', 'Password reset request submitted.');
})->name('admin.reset-password');

// =====================================================
// ADMIN CRUD & STUDENT CRUD
// =====================================================


// ADMIN CRUD
Route::resource('admins', AdminController::class);


// STUDENT CRUD
Route::resource('students', StudentController::class);

Route::get('/students/data', [StudentController::class, 'data'])
    ->name('students.data');



// =====================================================
// LINKING ROUTES
// =====================================================
Route::get('/student/schedule/data', [ScheduleController::class, 'studentSchedule'])
    ->middleware('auth:student')
    ->name('student.schedule.data');

Route::get('/student/subjects/data', [SubjectController::class, 'studentSubjects'])
    ->middleware('auth:student')
    ->name('student.subjects.data');



// =====================================================
// STUDENT
// =====================================================

// STUDENT LOGIN PAGE
Route::get('/student-login', function () {
    return view('studentLogin');
})->name('student.login');


// STUDENT LOGIN PROCESS
Route::post('/student-login', [StudentAuthController::class, 'login'])
    ->name('student.login.submit');


// STUDENT FORGOT PASSWORD PAGE
Route::get('/student/forgot-password', function () {
    return view('student-forgot-password');
})->name('student.forgot-password');


// STUDENT RESET PASSWORD
Route::post('/student/reset-password', function () {
    return back()->with('success', 'Password reset submitted.');
})->name('student.reset-password');


// =========================
// STUDENT SIGN UP PAGE
// =========================

Route::get('/student-signup', function () {
    return view('signup');
})->name('student.signup');




// =========================
// STUDENT REGISTRATION
// =========================

Route::post('/student-signup', [StudentController::class, 'store'])
    ->name('student.register');



// =========================
// STUDENT QR CODE PAGE
// =========================
Route::get('/student/qr-code', function () {
    return view('student-qr');
})->name('student.qr');


Route::post('/student/qr-login', [StudentAuthController::class, 'qrLogin'])
    ->name('student.qr.login');


// STUDENT DASHBOARD
Route::get('/dashboard', function () {

    // Prevent access if student is not logged in
    if (!session('student_id')) {
        return redirect()->route('student.login');
    }

    // Get the logged-in student's record
    $student = \App\Models\Student::find(session('student_id'));

    // If student record doesn't exist
    if (!$student) {
        session()->forget(['student_id', 'student_name']);
        return redirect()->route('student.login');
    }

    return view('dashboard', compact('student'));

})->name('student.dashboard');


Route::put('/student/profile', [StudentController::class, 'updateProfile'])
    ->name('student.profile.update');



Route::get('/admin/subjects', function () {
    return view('admin-subject-management');
})->name('admin.subjects');

Route::post('/student/logout', [StudentAuthController::class, 'logout'])
    ->name('student.logout');


Route::post('/student/profile-picture', [StudentController::class, 'updateProfilePicture'])
    ->name('student.profile.picture');


Route::put('/student/password', [StudentController::class, 'updatePassword'])
    ->name('student.password.update');

// =========================
// SUBJECT MANAGEMENT ROUTES
// =========================

// SUBJECT MANAGEMENT PAGE
Route::get('/admin/subjects', function () {
    return view('admin-subject-management');
})->name('admin.subjects.page');


// SUBJECT MANAGEMENT API
Route::get('/admin/subjects/data', [SubjectController::class, 'index'])
    ->name('admin.subjects.index');

Route::post('/admin/subjects', [SubjectController::class, 'store'])
    ->name('admin.subjects.store');

Route::put('/admin/subjects/{id}', [SubjectController::class, 'update'])
    ->name('admin.subjects.update');

Route::delete('/admin/subjects/{id}', [SubjectController::class, 'destroy'])
    ->name('admin.subjects.destroy');

    Route::get('/csrf-token', function () {
    return response()->json([
        'token' => csrf_token()
    ]);
});

// =========================
// SCHEDULE MANAGEMENT ROUTES
// =========================

Route::get('/admin/schedules', [ScheduleController::class, 'index'])
    ->name('admin.schedules');

Route::post('/admin/schedules', [ScheduleController::class, 'store'])
    ->name('admin.schedules.store');

Route::put('/admin/schedules/{schedule}', [ScheduleController::class, 'update'])
    ->name('admin.schedules.update');

Route::delete('/admin/schedules/{schedule}', [ScheduleController::class, 'destroy'])
    ->name('admin.schedules.destroy');


// =========================
// COMPUTER MANAGEMENT ROUTES
// =========================

Route::get('/admin/computers', [ComputerController::class, 'page'])
    ->name('admin.computers');

Route::get('/admin/computers/data', [ComputerController::class, 'index'])
    ->name('admin.computers.data');

Route::post('/admin/computers', [ComputerController::class, 'store'])
    ->name('admin.computers.store');

Route::put('/admin/computers/{computer}', [ComputerController::class, 'update'])
    ->name('admin.computers.update');

Route::delete('/admin/computers/{computer}', [ComputerController::class, 'destroy'])
    ->name('admin.computers.destroy');


Route::post('/admin/computers/restart-all', 
    [ComputerController::class, 'restartAll']
)->name('admin.computers.restartAll');

Route::post('/admin/computers/lock-all', 
    [ComputerController::class, 'lockAll']
)->name('admin.computers.lockAll');

Route::post('/admin/computers/scan', [ComputerController::class, 'scanDevices'])
    ->name('admin.computers.scan');


// =========================
// APPLICATION ACTIVITY  ROUTES
// =========================
Route::get(
    '/admin/application-activities/data',
    [ApplicationActivityController::class, 'index']
)->name('admin.application.activities');

Route::post(
    '/admin/application-activities',
    [ApplicationActivityController::class, 'store']
)->name('admin.application.activities.store');


// =========================
// STUDENT QR CODE ROUTES
// =========================

Route::post('/admin/computers/scan', [ComputerController::class, 'scanDevices'])
    ->name('admin.computers.scan');



// =========================
// APPLICATION ROUTES
// =========================

Route::get('/admin/applications/data', [ApplicationController::class, 'index'])
    ->name('admin.applications.index');

Route::post('/admin/applications', [ApplicationController::class, 'store'])
    ->name('admin.applications.store');

Route::put('/admin/applications/{application}', [ApplicationController::class, 'update'])
    ->name('admin.applications.update');

Route::post('/admin/applications/{application}/toggle-status', [ApplicationController::class, 'toggleStatus'])
    ->name('admin.applications.toggle');

Route::delete('/admin/applications/{application}', [ApplicationController::class, 'destroy'])
    ->name('admin.applications.destroy');




    
// =========================
// ATTENDANCE ROUTES
// =========================
Route::get('/admin/attendance', [
    AttendanceRecordController::class,
    'page'
])->name('admin.attendance');

Route::get('/admin/attendance/data', [
    AttendanceRecordController::class,
    'index'
])->name('admin.attendance.index');

Route::post('/admin/attendance', [
    AttendanceRecordController::class,
    'store'
])->name('admin.attendance.store');

Route::put('/admin/attendance/{attendanceRecord}', [
    AttendanceRecordController::class,
    'update'
])->name('admin.attendance.update');

Route::delete('/admin/attendance/{attendanceRecord}', [
    AttendanceRecordController::class,
    'destroy'
])->name('admin.attendance.destroy');


Route::get('/admin/attendance', [AttendanceController::class, 'page'])
    ->name('admin.attendance');

Route::get('/admin/attendance/data', [AttendanceController::class, 'index'])
    ->name('admin.attendance.data');


// =========================
// VIOLATION MANAGEMENT
// =========================

Route::get(
    '/admin/violations',
    [ViolationController::class, 'page']
)->name('admin.violations');

Route::get(
    '/admin/violations/data',
    [ViolationController::class, 'index']
)->name('admin.violations.data');

Route::put(
    '/admin/violations/{id}/toggle',
    [ViolationController::class, 'toggleStatus']
)->name('admin.violations.toggle');

Route::delete(
    '/admin/violations/{id}',
    [ViolationController::class, 'destroy']
)->name('admin.violations.destroy');


// =========================
// REPORT MANAGEMENT
// =========================

Route::get('/admin/reports', [ReportController::class, 'page'])
    ->name('admin.reports');

Route::get('/admin/reports/data', [ReportController::class, 'data'])
    ->name('admin.reports.data');

Route::get('/admin/reports/history', [ReportController::class, 'history'])
    ->name('admin.reports.history');

Route::post('/admin/reports', [ReportController::class, 'store'])
    ->name('admin.reports.store');

Route::delete('/admin/reports/{id}', [ReportController::class, 'destroy'])
    ->name('admin.reports.destroy');




// ==========================================
// ANNOUNCEMENT MANAGEMENT
// ==========================================

Route::get('/admin/announcements', [AnnouncementController::class, 'page'])
    ->name('admin.announcements');

Route::get('/admin/announcements/data', [AnnouncementController::class, 'index'])
    ->name('admin.announcements.data');

Route::post('/admin/announcements', [AnnouncementController::class, 'store'])
    ->name('admin.announcements.store');

Route::put('/admin/announcements/{id}', [AnnouncementController::class, 'update'])
    ->name('admin.announcements.update');

Route::delete('/admin/announcements/{id}', [AnnouncementController::class, 'destroy'])
    ->name('admin.announcements.destroy');

// ==========================================
// SETTINGS MANAGEMENT
// ==========================================

Route::get('/admin/settings', [SettingsController::class, 'index'])
    ->name('admin.settings');

Route::put('/admin/settings/profile', [SettingsController::class, 'updateProfile'])
    ->name('admin.settings.profile.update');

Route::put('/admin/settings/password', [SettingsController::class, 'updatePassword'])
    ->name('admin.settings.password.update');


Route::post('/admin/logout', [AdminAuthController::class, 'logout'])
    ->name('admin.logout');



// ==========================================
// TOGGLE ROUTES
// ==========================================
    Route::put(
    '/admin/settings/notifications',
    [SettingsController::class, 'updateNotifications']
)->name('admin.settings.notifications.update');

Route::get(
    '/admin/settings/notifications',
    [SettingsController::class, 'notifications']
)->name('admin.settings.notifications');

Route::put('/admin/settings/notifications/read',
    [SettingsController::class, 'markNotificationsRead']
)->name('admin.settings.notifications.read');



// ==========================================
// ADMIN REAL-TIME ROUTES
// ==========================================
Route::get(
    '/admin/dashboard',
    [AdminDashboardController::class, 'index']
)->name('admin.dashboard');

Route::get(
    '/admin/dashboard/data',
    [AdminDashboardController::class, 'data']
)->name('admin.dashboard.data');


// =====================================================
// STUDENT ATTENDANCE
// =====================================================

Route::get('/student/attendance', [AttendanceController::class, 'studentPage'])
    ->name('student.attendance');

Route::post('/student/attendance/time-in', [AttendanceController::class, 'timeIn'])
    ->name('student.attendance.timeIn');

Route::post('/student/attendance/time-out', [AttendanceController::class, 'timeOut'])
    ->name('student.attendance.timeOut');

Route::get('/student/attendance/records', [AttendanceController::class, 'studentRecords'])
    ->name('student.attendance.records');


// =====================================================
// STUDENT DASHBOARD DATA API
// =====================================================

Route::get('/student/tasks/data', [StudentTaskController::class, 'index'])
    ->name('student.tasks.data');

Route::post('/student/tasks/{task}/toggle', [StudentTaskController::class, 'toggle'])
    ->name('student.tasks.toggle');



    Route::get(
    '/student/announcements/data',
    [AnnouncementController::class, 'index']
)->name('student.announcements.data');


// =====================================================
// STUDENT DASHBOARD REAL-TIME DATA
// =====================================================

Route::get(
    '/student/dashboard/data',
    [StudentDashboardController::class, 'data']
)->name('student.dashboard.data');


// ==========================================
// ADMIN GLOBAL SEARCH
// ==========================================





// ==========================================
// GLOBAL SEARCH
// ==========================================

Route::get(
    '/admin/global-search',
    [GlobalSearchController::class, 'search']
)->name('admin.global.search');


// ==========================================
// ADMIN PROFILE REALTIME DATA
// ==========================================

Route::get('/admin/profile/data', function () {

    if (!session('admin_logged_in')) {

        return response()->json([
            'success' => false,
            'message' => 'You are not logged in.'
        ], 401);

    }


    $admin = \App\Models\Admin::find(
        session('admin_id')
    );


    if (!$admin) {

        return response()->json([
            'success' => false,
            'message' => 'Administrator account not found.'
        ], 404);

    }


    return response()->json([

        'success' => true,

        'admin' => [

            'id' =>
                $admin->id,

            'admin_id' =>
                $admin->admin_id,

            'name' =>
                $admin->name,

            'email' =>
                $admin->email,

            'role' =>
                $admin->role,

            'assigned_laboratories' =>
                $admin->assigned_laboratories,

        ]

    ]);

})->name('admin.profile.data');