<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('username')->unique();
            $table->string('email')->nullable(); // Email is no longer unique and can be nullable
            $table->string('contact_number')->nullable();
            $table->string('password');
            $table->enum('role', ['Guest', 'Student'])->default('Guest');
            $table->string('full_name');
            $table->string('student_number')->unique(); // Student number is now required and unique
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
