<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    // ==============================
    // ANNOUNCEMENT PAGE
    // ==============================
    public function page()
    {
        return view('admin-announcement');
    }


    // ==============================
    // GET ANNOUNCEMENTS
    // ==============================
    public function index()
{
    $announcements = Announcement::where('status', 'Published')
        ->orderByDesc('created_at')
        ->get();

    return response()->json([
        'success' => true,

        'announcements' => $announcements->map(function ($announcement) {

            return [
                'id' => $announcement->id,
                'title' => $announcement->title,
                'audience' => $announcement->audience,
                'body' => $announcement->body,

                'date' => $announcement->created_at
                    ? $announcement->created_at->format('M j, Y')
                    : '',

                'originalDate' => $announcement->created_at
                    ? $announcement->created_at->format('M j, Y')
                    : '',
            ];

        })->values(),
    ]);
}


    // ==============================
    // CREATE ANNOUNCEMENT
    // ==============================
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'audience' => 'required|string|max:100',
            'body' => 'required|string',
        ]);

        $announcement = Announcement::create([
            'title' => $validated['title'],
            'audience' => $validated['audience'],
            'body' => $validated['body'],
            'status' => 'Published',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Announcement posted successfully.',

            'announcement' => [
                'id' => $announcement->id,
                'title' => $announcement->title,
                'audience' => $announcement->audience,
                'body' => $announcement->body,

                'date' => $announcement->created_at
                    ->format('M j, Y'),

                'originalDate' => $announcement->created_at
                    ->format('M j, Y'),
            ],
        ], 201);
    }


    // ==============================
    // UPDATE ANNOUNCEMENT
    // ==============================
    public function update(Request $request, $id)
    {
        $announcement = Announcement::find($id);

        if (!$announcement) {
            return response()->json([
                'success' => false,
                'message' => 'Announcement not found.'
            ], 404);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'audience' => 'required|string|max:100',
            'body' => 'required|string',
        ]);

        $announcement->update([
            'title' => $validated['title'],
            'audience' => $validated['audience'],
            'body' => $validated['body'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Announcement updated successfully.',
        ]);
    }


    // ==============================
    // DELETE ANNOUNCEMENT
    // ==============================
    public function destroy($id)
    {
        $announcement = Announcement::find($id);

        if (!$announcement) {
            return response()->json([
                'success' => false,
                'message' => 'Announcement not found.'
            ], 404);
        }

        $announcement->delete();

        return response()->json([
            'success' => true,
            'message' => 'Announcement deleted successfully.'
        ]);
    }
}