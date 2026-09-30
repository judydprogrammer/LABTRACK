<?php

namespace App\Models;

use App\Models\Admin;
use App\Notifications\ViolationAlertNotification;
use Illuminate\Database\Eloquent\Model;

class Violation extends Model
{
    protected $fillable = [
        'student_id',
        'student_name',
        'computer_name',
        'lab',
        'violation',
        'severity',
        'violation_time',
        'status',
        'description',
        'resolved_at',
    ];

    protected $casts = [
        'violation_time' => 'datetime',
        'resolved_at' => 'datetime',
    ];




     protected static function booted()
    {
        static::created(function ($violation) {

            $admins = Admin::all();

            foreach ($admins as $admin) {

                $preferences =
                    $admin->notification_preferences ?? [];

                $violationAlerts =
                    $preferences['violation_alerts'] ?? true;


                if ($violationAlerts) {

                    $admin->notify(
                        new ViolationAlertNotification(
                            $violation
                        )
                    );

                }
            }
        });
    }
}
