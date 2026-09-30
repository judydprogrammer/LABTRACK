<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class SettingsController extends Controller
{
    // ==============================
    // SETTINGS PAGE
    // ==============================
    public function index()
    {
        // Check if admin is logged in
        if (!session('admin_logged_in')) {
            return redirect()->route('admin');
        }

        // Get currently logged-in admin
        $admin = Admin::find(session('admin_id'));

        // If admin account does not exist
        if (!$admin) {

            session()->forget([
                'admin_logged_in',
                'admin_id',
                'admin_name'
            ]);

            return redirect()->route('admin');
        }

        return view('admin-setting', compact('admin'));
    }


    // ==============================
    // UPDATE ADMIN PROFILE
    // ==============================
    public function updateProfile(Request $request)
{
    if (!session('admin_logged_in')) {
        return response()->json([
            'success' => false,
            'message' => 'You are not logged in.'
        ], 401);
    }

    $admin = Admin::find(session('admin_id'));

    if (!$admin) {
        return response()->json([
            'success' => false,
            'message' => 'Administrator account not found.'
        ], 404);
    }

    $validated = $request->validate([
        'name' => 'required|string|max:255',

        'email' => [
            'required',
            'email',
            'max:255',
            'unique:admins,email,' . $admin->id
        ],

        'role' => [
            'required',
            'string',
            'max:255'
        ],

        'assigned_laboratories' => [
            'required',
            'string',
            'max:500'
        ],
    ]);


    $admin->name =
        $validated['name'];

    $admin->email =
        $validated['email'];

    $admin->role =
        $validated['role'];

    $admin->assigned_laboratories =
        $validated['assigned_laboratories'];

    $admin->save();


    // Update session name
    session([
    'admin_name' => $admin->name,
    'admin_code' => $admin->admin_id,
    ]);


    return response()->json([

        'success' => true,

        'message' =>
            'Administrator profile updated successfully.',

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
}

    // ==============================
    // UPDATE PASSWORD
    // ==============================
    public function updatePassword(Request $request)
    {
        // Check login
        if (!session('admin_logged_in')) {
            return response()->json([
                'success' => false,
                'message' => 'You are not logged in.'
            ], 401);
        }

        // Get logged-in admin
        $admin = Admin::find(session('admin_id'));

        if (!$admin) {
            return response()->json([
                'success' => false,
                'message' => 'Administrator account not found.'
            ], 404);
        }

        // Validate password
        $validated = $request->validate([
            'current_password' => 'required',

            'new_password' => [
                'required',
                'string',
                'min:8',
                'confirmed'
            ],
        ]);

        // Check current password
        if (!Hash::check(
            $validated['current_password'],
            $admin->password
        )) {
            return response()->json([
                'success' => false,
                'message' => 'Current password is incorrect.'
            ], 422);
        }

        // Make sure new password is different
        if (Hash::check(
            $validated['new_password'],
            $admin->password
        )) {
            return response()->json([
                'success' => false,
                'message' =>
                    'Your new password must be different from your current password.'
            ], 422);
        }

        // Update password
        $admin->update([
            'password' => Hash::make(
                $validated['new_password']
            ),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Password updated successfully.'
        ]);
    }

public function updateNotifications(Request $request)
{
    if (!session('admin_logged_in')) {
        return response()->json([
            'success' => false,
            'message' => 'You are not logged in.'
        ], 401);
    }

    $admin = Admin::find(session('admin_id'));

    if (!$admin) {
        return response()->json([
            'success' => false,
            'message' => 'Administrator account not found.'
        ], 404);
    }

    $request->validate([
        'violation_alerts' => 'required|boolean',
        'pc_offline_alerts' => 'required|boolean',
        'daily_attendance_summary' => 'required|boolean',
        'email_notifications' => 'required|boolean',
    ]);

    $preferences = [
        'violation_alerts' =>
            (bool) $request->violation_alerts,

        'pc_offline_alerts' =>
            (bool) $request->pc_offline_alerts,

        'daily_attendance_summary' =>
            (bool) $request->daily_attendance_summary,

        'email_notifications' =>
            (bool) $request->email_notifications,
    ];

    $admin->notification_preferences = $preferences;
    $admin->save();

    return response()->json([
        'success' => true,
        'message' => 'Notification preferences updated successfully.',
        'preferences' => $preferences
    ]);
}


public function notifications()
{
    if (!session('admin_logged_in')) {
        return response()->json([
            'success' => false,
            'message' => 'You are not logged in.'
        ], 401);
    }

    $admin = Admin::find(session('admin_id'));

    if (!$admin) {
        return response()->json([
            'success' => false,
            'message' => 'Administrator account not found.'
        ], 404);
    }

    $notifications = $admin->notifications()
        ->latest()
        ->take(20)
        ->get();

    return response()->json([
        'success' => true,

        'notifications' => $notifications->map(function ($notification) {

            return [
                'id' => $notification->id,

                'title' =>
                    $notification->data['title'] ?? 'Notification',

                'message' =>
                    $notification->data['message'] ?? '',

                'type' =>
                    $notification->data['type'] ?? 'general',

                'read' =>
                    $notification->read_at !== null,

                'created_at' =>
                    $notification->created_at
                        ? $notification->created_at->diffForHumans()
                        : '',
            ];

        })->values(),
    ]);
}


public function markNotificationsRead()
{
    if (!session('admin_logged_in')) {
        return response()->json([
            'success' => false,
            'message' => 'You are not logged in.'
        ], 401);
    }

    $admin = Admin::find(session('admin_id'));

    if (!$admin) {
        return response()->json([
            'success' => false,
            'message' => 'Administrator account not found.'
        ], 404);
    }

    $admin->unreadNotifications->markAsRead();

    return response()->json([
        'success' => true,
        'message' => 'Notifications marked as read.'
    ]);
}
}