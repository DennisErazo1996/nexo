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
        Schema::create('propiedades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('equipo_id')->constrained()->cascadeOnDelete();
            $table->string('tipo');
            $table->string('zona');
            $table->decimal('tamano', 10, 2);
            $table->string('unidad_medida');
            $table->decimal('precio', 12, 2);
            $table->string('moneda')->default('HNL');
            $table->string('forma_pago');
            $table->string('condicion_legal')->nullable();
            $table->text('acceso')->nullable();
            $table->text('descripcion')->nullable();
            $table->string('estado')->default('disponible');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('propiedades');
    }
};
