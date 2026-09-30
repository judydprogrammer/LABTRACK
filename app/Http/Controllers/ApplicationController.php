<?php

namespace App\Http\Controllers;

use App\Models\Application;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    /**
     * Get all applications
     */
    public function index()
    {
        $applications = Application::orderBy('application_name')->get();

        return response()->json([
            'success' => true,
            'applications' => $applications
        ]);
    }


    /**
     * Add application
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'application_name' => 'required|string|max:100',
            'scope' => 'required|string|max:100',
            'restriction' => 'required|in:Blocked,Restricted',
            'status' => 'required|in:Active,Inactive',
        ]);

        $application = Application::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Application added successfully.',
            'application' => $application
        ], 201);
    }


    /**
     * Update application
     */
    public function update(Request $request, Application $application)
    {
        $validated = $request->validate([
            'application_name' => 'required|string|max:100',
            'scope' => 'required|string|max:100',
            'restriction' => 'required|in:Blocked,Restricted',
            'status' => 'required|in:Active,Inactive',
        ]);

        $application->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Application updated successfully.',
            'application' => $application
        ]);
    }


    /**
     * Activate / Deactivate
     */
    public function toggleStatus(Application $application)
    {
        $application->status =
            $application->status === 'Active'
                ? 'Inactive'
                : 'Active';

        $application->save();

        return response()->json([
            'success' => true,
            'message' => "Application {$application->status}.",
            'application' => $application
        ]);
    }


    /**
     * Delete application
     */
    public function destroy(Application $application)
    {
        $application->delete();

        return response()->json([
            'success' => true,
            'message' => 'Application deleted successfully.'
        ]);
    }
}