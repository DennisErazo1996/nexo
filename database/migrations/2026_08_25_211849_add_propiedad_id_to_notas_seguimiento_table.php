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
        Schema::table('notas_seguimiento', function (Blueprint $table) {
            $table->foreignId('propiedad_id')->nullable()->after('agente_id')->constrained('propiedades')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('notas_seguimiento', function (Blueprint $table) {
            $table->dropConstrainedForeignId('propiedad_id');
        });
    }
};
