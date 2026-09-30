<?php

namespace App\Http\Controllers;

use App\Models\Computer;
use Illuminate\Http\Request;
use App\Models\Student;

class ComputerController extends Controller
{
    public function page()
    {
        $computers = Computer::orderBy('lab')
            ->orderBy('computer_name')
            ->get();

        $students = Student::orderBy('student_id')
            ->get();

        return view('admin-computer-management', compact(
            'computers',
            'students'
        ));
    }

    public function index()
    {
        $computers = Computer::orderBy('lab')
            ->orderBy('computer_name')
            ->get();

        return response()->json([
            'success' => true,
            'computers' => $computers
        ]);
    }


    /* ==================== ADD COMPUTER ==================== */

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'nullable|string|max:50',
            'computer_name' => 'required|string|max:50',
            'lab' => 'required|string|max:50',
            'ip_address' => 'nullable|string|max:50',
            'mac_address' => 'nullable|string|max:100',
            'status' => 'required|string|max:30',
            'operating_system' => 'nullable|string|max:100',
        ]);

        $computer = Computer::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Computer added successfully.',
            'computer' => $computer
        ]);
    }


    /* ==================== UPDATE COMPUTER ==================== */

    public function update(Request $request, Computer $computer)
    {
        $validated = $request->validate([
            'student_id' => 'nullable|string|max:50',
            'computer_name' => 'required|string|max:50',
            'lab' => 'required|string|max:50',
            'ip_address' => 'nullable|string|max:50',
            'mac_address' => 'nullable|string|max:100',
            'status' => 'required|string|max:30',
            'operating_system' => 'nullable|string|max:100',
        ]);

        $computer->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Computer updated successfully.',
            'computer' => $computer
        ]);
    }


    /* ==================== DELETE COMPUTER ==================== */

    public function destroy(Computer $computer)
    {
        $computer->delete();

        return response()->json([
            'success' => true,
            'message' => 'Computer deleted successfully.'
        ]);
    }

/* ==================== SCAN DEVICES ==================== */

public function scanDevices()
{
    $devices = [];

    // Windows
    if (PHP_OS_FAMILY === 'Windows') {

        $output = shell_exec('arp -a');

        if ($output) {

            $lines = preg_split('/\r\n|\r|\n/', $output);

            foreach ($lines as $line) {

                // Example:
                // 192.168.1.10    00-11-22-33-44-55    dynamic

                if (preg_match(
                    '/(\d{1,3}(?:\.\d{1,3}){3})\s+([0-9a-fA-F-]{17})\s+(dynamic|static)/',
                    $line,
                    $matches
                )) {

                    $ip = $matches[1];
                    $mac = strtoupper($matches[2]);

                    $hostname = @gethostbyaddr($ip);

                    $devices[] = [
                        'ip_address' => $ip,
                        'mac_address' => $mac,
                        'hostname' => $hostname !== $ip
                            ? $hostname
                            : 'Unknown Device',
                    ];
                }
            }
        }
    }

    return response()->json([
        'success' => true,
        'message' => count($devices) . ' device(s) found.',
        'devices' => $devices
    ]);
}


/* ==================== RESTART ALL ==================== */
public function restartAll(Request $request)
{
    $lab = $request->input('lab');

    $computers = Computer::where('lab', $lab)
        ->whereIn('status', [
            'online',
            'inuse',
            'idle'
        ])
        ->get();

    $count = $computers->count();

    return response()->json([
        'success' => true,
        'message' =>
            "Restart command sent to {$count} computer(s) in {$lab}."
    ]);
}

function restartAllComputers() {
    console.log('RESTART ALL BUTTON CLICKED');

    openActionConfirm(
        'Restart All Computers',
        `Are you sure you want to restart all online computers in ${activeLab}?`,
        'restart'
    );
}


/* ==================== LOCK ALL ==================== */
public function lockAll(Request $request)
{
    $lab = $request->input('lab');

    $computers = Computer::where('lab', $lab)
        ->whereIn('status', [
            'online',
            'inuse',
            'idle'
        ])
        ->get();

    $count = $computers->count();

    foreach ($computers as $computer) {

        $computer->update([
            'status' => 'locked'
        ]);

    }

    return response()->json([
        'success' => true,
        'message' =>
            "{$count} computer(s) in {$lab} have been locked."
    ]);
}
}

function lockAllComputers() {
    console.log('LOCK ALL BUTTON CLICKED');

    openActionConfirm(
        'Lock All Computers',
        `Are you sure you want to lock all computers in ${activeLab}?`,
        'lock'
    );
}