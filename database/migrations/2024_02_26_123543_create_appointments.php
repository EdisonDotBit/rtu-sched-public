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
        Schema::create('appointments', function (Blueprint $table) {
            $table->bigIncrements('aptid');
            $table->string('apttype');
            $table->string('aptname');
            $table->string('aptstudnum');
            $table->date('aptdate');
            $table->string('aptoffice');
            $table->string('aptpnumber');
            $table->string('aptemail');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
