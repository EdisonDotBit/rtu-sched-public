<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDisabledDatesTable extends Migration
{
    public function up(): void
    {
        Schema::create('disabled_dates', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('aptoffice'); // office abbreviation (e.g., MISO)
            $table->string('aptbranch'); // branch (e.g., Boni)
            $table->date('date');        // the disabled date
            $table->string('time')->nullable(); // if null, disable the whole day; else disable specific time slot
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('disabled_dates');
    }
}
