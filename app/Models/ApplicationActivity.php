<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ApplicationActivity extends Model
{
    protected $fillable = [
        'time',
        'pc_name',
        'student_name',
        'lab',
        'application_name',
        'action',
        'status',
        'reason',
    ];
}