<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    // Display all admins
    public function index()
    {
        $admins = Admin::latest()->get();

        return view('Admin.index', compact('admins'));
    }

    // Show create form
    public function create()
    {
        return view('Admin.create');
    }

    // Store new admin
    public function store(Request $request)
    {
        $validated = $request->validate([
            'admin_id' => 'required|string|max:50|unique:admins,admin_id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:admins,email',
            'password' => 'required|string|min:6|confirmed',
        ]);

        Admin::create([
            'admin_id' => $validated['admin_id'],
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()
            ->route('admins.index')
            ->with('success', 'Admin account created successfully.');
    }

    // Show one admin
    public function show(Admin $admin)
    {
        return view('admins.show', compact('admin'));
    }

    // Show edit form
    public function edit(Admin $admin)
    {
        return view('Admin.edit', compact('admin'));
    }

    // Update admin
    public function update(Request $request, Admin $admin)
    {
        $validated = $request->validate([
            'admin_id' => 'required|string|max:50|unique:admins,admin_id,' . $admin->id,
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:admins,email,' . $admin->id,
            'password' => 'nullable|string|min:6|confirmed',
        ]);

        $admin->admin_id = $validated['admin_id'];
        $admin->name = $validated['name'];
        $admin->email = $validated['email'];

        if (!empty($validated['password'])) {
            $admin->password = Hash::make($validated['password']);
        }

        $admin->save();

        return redirect()
            ->route('admins.index')
            ->with('success', 'Admin account updated successfully.');
    }

    // Delete admin
    public function destroy(Admin $admin)
    {
        $admin->delete();

        return redirect()
            ->route('admins.index')
            ->with('success', 'Admin account deleted successfully.');
    }

public function logout(Request $request)
{
    $request->session()->forget([
        'admin_logged_in',
        'admin_id',
        'admin_name'
    ]);

    $request->session()->regenerate();

    return redirect()
        ->route('admin')
        ->with('success', 'You have been logged out successfully.');
}
}