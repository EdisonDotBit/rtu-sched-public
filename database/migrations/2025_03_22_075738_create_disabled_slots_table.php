<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDisabledSlotsTable extends Migration
{
    public function up(): void
    {
        Schema::create('disabled_slots', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('aptoffice'); // e.g., "MISO"
            $table->string('aptbranch'); // e.g., "Boni"
            $table->date('date');        // The disabled date
            $table->string('time')->nullable(); // If null, whole day is disabled; otherwise, specific time slot
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('disabled_slots');
    }
}
