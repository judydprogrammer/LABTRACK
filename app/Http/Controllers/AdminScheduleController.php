<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use Illuminate\Http\Request;

class AdminScheduleController extends Controller
{
    public function index()
    {
        $schedules = Schedule::latest()->get();

        return view('admin-sched-management', compact('schedules'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject_code' => 'required|string|max:255',
            'subject_name' => 'required|string|max:255',
            'room'         => 'required|string|max:255',
            'teacher'      => 'required|string|max:255',
            'course'       => 'required|string|max:255',
            'year_level'   => 'required|string|max:255',
            'block'        => 'required|string|max:255',
            'semester'     => 'required|string|max:255',
            'day'          => 'required|string|max:255',
            'time'         => 'required|string|max:255',
        ]);

        Schedule::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Schedule added successfully.'
        ]);
    }

    public function update(Request $request, Schedule $schedule)
    {
        $validated = $request->validate([
            'subject_code' => 'required|string|max:255',
            'subject_name' => 'required|string|max:255',
            'room'         => 'required|string|max:255',
            'teacher'      => 'required|string|max:255',
            'course'       => 'required|string|max:255',
            'year_level'   => 'required|string|max:255',
            'block'        => 'required|string|max:255',
            'semester'     => 'required|string|max:255',
            'day'          => 'required|string|max:255',
            'time'         => 'required|string|max:255',
        ]);

        $schedule->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Schedule updated successfully.'
        ]);
    }

    public function destroy(Schedule $schedule)
    {
        $schedule->delete();

        return response()->json([
            'success' => true,
            'message' => 'Schedule deleted successfully.'
        ]);
    }
}