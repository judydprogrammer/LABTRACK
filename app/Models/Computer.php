<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Computer extends Model
{
    protected $fillable = [
        'student_id',
        'computer_name',
        'lab',
        'ip_address',
        'mac_address',
        'status',
        'operating_system',
        'last_seen',
    ];
}