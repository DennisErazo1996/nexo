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
        Schema::create('clientes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('equipo_id')->constrained()->cascadeOnDelete();
            $table->string('nombre');
            $table->string('telefono');
            $table->string('estado')->default('nuevo');
            $table->foreignId('agente_registro_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['equipo_id', 'telefono']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clientes');
    }
};
