<?php

namespace App\Http\Controllers;

use App\Models\ApplicationActivity;
use Illuminate\Http\Request;

class ApplicationActivityController extends Controller
{
    public function index()
    {
        $activities = ApplicationActivity::orderByDesc('created_at')
            ->get();

        return response()->json([
            'success' => true,
            'activities' => $activities
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'time' => 'required|string|max:30',
            'pc_name' => 'required|string|max:50',
            'student_name' => 'required|string|max:100',
            'lab' => 'required|string|max:50',
            'application_name' => 'required|string|max:100',
            'action' => 'required|string|max:50',
            'status' => 'required|string|max:50',
            'reason' => 'nullable|string',
        ]);

        $activity = ApplicationActivity::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Application activity recorded.',
            'activity' => $activity
        ], 201);
    }
}