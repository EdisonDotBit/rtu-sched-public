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
            $table->bigIncrements(column: 'aptid');
            $table->string('apttype')->nullable(false);
            $table->string('aptbranch')->nullable(false);
            $table->string('aptoffice')->nullable(false);
            $table->string('aptname')->nullable(false);
            $table->string('aptpurpose')->nullable(false);
            $table->string('aptstudnum')->nullable(false);
            $table->date('aptdate')->nullable(false);
            $table->string('aptpnumber')->nullable(false);
            $table->string('aptemail')->nullable(false);
            $table->string('aptstatus')->default('ongoing')->nullable(false);
            $table->time('apttime')->nullable(false);
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
