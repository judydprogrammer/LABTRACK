<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendance_records', function (Blueprint $table) {
            $table->id();

            $table->string('student_id', 50);
            $table->string('student_name', 100);
            $table->string('block', 50);
            $table->string('subject', 100);

            $table->date('attendance_date');

            $table->time('time_in')->nullable();
            $table->time('time_out')->nullable();

            $table->enum('status', [
                'Present',
                'Late',
                'Absent'
            ])->default('Present');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendance_records');
    }
};