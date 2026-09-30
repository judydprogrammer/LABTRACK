<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $fillable = [
        'name',
        'type',
        'format',
        'date_from',
        'date_to',
        'generated_at',
    ];

    protected $casts = [
        'date_from' => 'date',
        'date_to' => 'date',
        'generated_at' => 'datetime',
    ];
}