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
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('equipo_id')->after('id')->constrained()->cascadeOnDelete();
            $table->string('telefono')->nullable()->after('email');
            $table->string('rol')->default('agente')->after('telefono');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('equipo_id');
            $table->dropColumn(['telefono', 'rol']);
        });
    }
};
