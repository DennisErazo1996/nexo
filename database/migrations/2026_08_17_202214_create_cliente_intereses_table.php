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
        Schema::create('cliente_intereses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cliente_id')->constrained()->cascadeOnDelete();
            $table->foreignId('etiqueta_id')->constrained('etiquetas_interes')->cascadeOnDelete();
            $table->string('zona')->nullable();
            $table->decimal('presupuesto_min', 12, 2)->nullable();
            $table->decimal('presupuesto_max', 12, 2)->nullable();
            $table->foreignId('agente_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cliente_intereses');
    }
};
