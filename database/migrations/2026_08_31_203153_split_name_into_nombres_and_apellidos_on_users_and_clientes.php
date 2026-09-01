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
            $table->string('nombres')->nullable()->after('id');
            $table->string('apellidos')->nullable()->after('nombres');
        });

        Schema::table('clientes', function (Blueprint $table) {
            $table->string('nombres')->nullable()->after('equipo_id');
            $table->string('apellidos')->nullable()->after('nombres');
        });

        // Copy existing data if any
        DB::table('users')->orderBy('id')->chunk(100, function ($users) {
            foreach ($users as $user) {
                $parts = explode(' ', trim($user->name));
                $apellidos = count($parts) > 1 ? array_pop($parts) : '';
                $nombres = implode(' ', $parts);
                DB::table('users')->where('id', $user->id)->update([
                    'nombres' => $nombres,
                    'apellidos' => $apellidos,
                ]);
            }
        });

        DB::table('clientes')->orderBy('id')->chunk(100, function ($clientes) {
            foreach ($clientes as $cliente) {
                $parts = explode(' ', trim($cliente->nombre));
                $apellidos = count($parts) > 1 ? array_pop($parts) : '';
                $nombres = implode(' ', $parts);
                DB::table('clientes')->where('id', $cliente->id)->update([
                    'nombres' => $nombres,
                    'apellidos' => $apellidos,
                ]);
            }
        });

        Schema::table('users', function (Blueprint $table) {
            $table->string('nombres')->nullable(false)->change();
            $table->string('apellidos')->nullable(false)->change();
            $table->dropColumn('name');
        });

        Schema::table('clientes', function (Blueprint $table) {
            $table->string('nombres')->nullable(false)->change();
            $table->string('apellidos')->nullable(false)->change();
            $table->dropColumn('nombre');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('name')->after('id')->nullable();
        });

        Schema::table('clientes', function (Blueprint $table) {
            $table->string('nombre')->after('equipo_id')->nullable();
        });

        DB::table('users')->orderBy('id')->chunk(100, function ($users) {
            foreach ($users as $user) {
                DB::table('users')->where('id', $user->id)->update([
                    'name' => trim($user->nombres.' '.$user->apellidos),
                ]);
            }
        });

        DB::table('clientes')->orderBy('id')->chunk(100, function ($clientes) {
            foreach ($clientes as $cliente) {
                DB::table('clientes')->where('id', $cliente->id)->update([
                    'nombre' => trim($cliente->nombres.' '.$cliente->apellidos),
                ]);
            }
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['nombres', 'apellidos']);
        });

        Schema::table('clientes', function (Blueprint $table) {
            $table->dropColumn(['nombres', 'apellidos']);
        });
    }
};
