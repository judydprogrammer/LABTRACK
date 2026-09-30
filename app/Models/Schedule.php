<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    protected $fillable = [
        'subject_code',
        'subject_name',
        'room',
        'teacher',
        'course',
        'year_level',
        'block',
        'semester',
        'day',
        'time',
    ];
}