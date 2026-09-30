<?php

namespace App\Notifications;

use App\Models\Violation;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ViolationAlertNotification extends Notification
{
    use Queueable;

    protected $violation;

    public function __construct(Violation $violation)
    {
        $this->violation = $violation;
    }

    /**
     * Notification delivery channels.
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Store notification in database.
     */
    public function toDatabase(object $notifiable): array
    {
        $violation = strtolower(
            trim($this->violation->violation ?? '')
        );

        /*
         * DEFAULT TITLE
         */
        $title = 'New Violation Detected';

        /*
         * UNAUTHORIZED APPLICATION
         */
        if (
            str_contains($violation, 'unauthorized') ||
            str_contains($violation, 'application') ||
            str_contains($violation, 'app')
        ) {
            $title =
                'Unauthorized app blocked — ' .
                $this->violation->computer_name .
                ', ' .
                $this->violation->lab;
        }

        /*
         * RESTRICTED WEBSITE
         */
        elseif (
            str_contains($violation, 'restricted') ||
            str_contains($violation, 'website')
        ) {
            $title =
                'Restricted website accessed — ' .
                $this->violation->computer_name .
                ', ' .
                $this->violation->lab;
        }

        /*
         * SYSTEM SETTINGS
         */
        elseif (
            str_contains($violation, 'setting') ||
            str_contains($violation, 'system')
        ) {
            $title =
                'System settings change attempted — ' .
                $this->violation->computer_name .
                ', ' .
                $this->violation->lab;
        }

        /*
         * OTHER VIOLATIONS
         */
        else {
            $title =
                ucfirst(
                    $this->violation->violation
                ) .
                ' — ' .
                $this->violation->computer_name .
                ', ' .
                $this->violation->lab;
        }

        return [
            'type' => 'violation',

            'title' => $title,

            /*
             * Keep this empty so the notification
             * looks clean like your screenshot.
             */
            'message' => '',

            'student_id' =>
                $this->violation->student_id,

            'student_name' =>
                $this->violation->student_name,

            'computer_name' =>
                $this->violation->computer_name,

            'lab' =>
                $this->violation->lab,

            'violation' =>
                $this->violation->violation,

            'severity' =>
                $this->violation->severity,

            'violation_id' =>
                $this->violation->id,

            'violation_time' =>
                $this->violation->violation_time
                    ? $this->violation
                        ->violation_time
                        ->toDateTimeString()
                    : null,
        ];
    }
}