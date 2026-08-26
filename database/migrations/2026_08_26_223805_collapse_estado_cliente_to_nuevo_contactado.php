<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('clientes')
            ->where('estado', '!=', 'nuevo')
            ->update(['estado' => 'contactado']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Irreversible: original estado values are not preserved.
    }
};
