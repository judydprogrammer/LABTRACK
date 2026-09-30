<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
        {
            Schema::create('violations', function (Blueprint $table) {
                $table->id();

                $table->string('student_id', 50);
                $table->string('student_name', 100);

                $table->string('computer_name', 50);
                $table->string('lab', 50);

                $table->string('violation', 255);
                $table->enum('severity', ['Low', 'Medium', 'High'])
                    ->default('Low');

                $table->dateTime('violation_time');

                $table->enum('status', ['Unresolved', 'Resolved'])
                    ->default('Unresolved');

                $table->text('description')->nullable();

                $table->dateTime('resolved_at')->nullable();

                $table->timestamps();
            });
        }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('violations');
    }
};
