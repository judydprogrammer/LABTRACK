<?php

namespace App\Http\Controllers;

use App\Models\Violation;
use Illuminate\Http\Request;

class ViolationController extends Controller
{
    public function page()
    {
        return view('admin-violation');
    }

    public function index(Request $request)
    {
        $violations = Violation::orderByDesc('violation_time')->get();

        return response()->json([
            'success' => true,
            'violations' => $violations->map(function ($violation) {
                return [
                    'id' => $violation->id,
                    'studentId' => $violation->student_id,
                    'student' => $violation->student_name,
                    'pc' => $violation->computer_name . ' · ' . $violation->lab,
                    'type' => $violation->violation,
                    'severity' => $violation->severity,
                    'time' => $violation->violation_time
                        ? $violation->violation_time->format('g:i A')
                        : '',
                    'status' => $violation->status,
                    'resolved' => $violation->status === 'Resolved',
                    'description' => $violation->description,
                ];
            })->values(),
        ]);
    }

    public function toggleStatus($id)
    {
        $violation = Violation::findOrFail($id);

        if ($violation->status === 'Resolved') {
            $violation->status = 'Unresolved';
            $violation->resolved_at = null;
        } else {
            $violation->status = 'Resolved';
            $violation->resolved_at = now();
        }

        $violation->save();

        return response()->json([
            'success' => true,
            'message' => $violation->status === 'Resolved'
                ? 'Violation marked as resolved.'
                : 'Violation reopened.',
        ]);
    }

    public function destroy($id)
    {
        $violation = Violation::findOrFail($id);

        $violation->delete();

        return response()->json([
            'success' => true,
            'message' => 'Violation deleted successfully.'
        ]);
    }
}