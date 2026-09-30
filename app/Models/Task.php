<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Task extends Model
{
    protected $table = 'tasks';

    protected $fillable = [
        'title',
        'description',
        'subject_code',
        'course',
        'year_level',
        'section',
        'due_date',
    ];

    protected $casts = [
        'due_date' => 'datetime',
    ];

    public function completions(): HasMany
    {
        return $this->hasMany(
            TaskCompletion::class
        );
    }
}