<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminAuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'admin_id' => 'required',
            'password' => 'required',
        ]);

        $admin = Admin::where('admin_id', $request->admin_id)->first();

        if (!$admin || !Hash::check($request->password, $admin->password)) {

            return back()
                ->withErrors([
                    'admin_id' => 'Invalid Admin ID or Password.'
                ])
                ->withInput();
        }

        session([
            'admin_logged_in' => true,
            'admin_id' => $admin->id,
            'admin_name' => $admin->name,
            'admin_code' => $admin->admin_id,
        ]);

        return redirect()->route('admin.dashboard');
    }

public function logout(Request $request)
{
    $request->session()->forget([
        'admin_logged_in',
        'admin_id',
        'admin_name',
        'admin_code',
    ]);

    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return redirect('/admin');
}
}