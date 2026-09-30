<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Student extends Authenticatable
{
    protected $table = 'students';

    protected $fillable = [
        'student_id',
        'fullname',
        'password',
        'profile_picture',
        'date_of_birth',
        'gender',
        'contact',
        'email',
        'address',
        'course',
        'year_level',
        'section',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function taskCompletions(): HasMany
    {
        return $this->hasMany(TaskCompletion::class);
    }
}