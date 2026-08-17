<?php

use App\Http\Controllers\Cliente\ClienteController;
use App\Http\Controllers\ClienteInteres\ClienteInteresController;
use App\Http\Controllers\NotaSeguimiento\NotaSeguimientoController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('clientes', [ClienteController::class, 'index'])->name('clientes.index');
    Route::get('clientes/nuevo', [ClienteController::class, 'create'])->name('clientes.create');
    Route::post('clientes/buscar', [ClienteController::class, 'buscar'])->name('clientes.buscar');
    Route::post('clientes', [ClienteController::class, 'store'])->name('clientes.store');
    Route::get('clientes/{cliente}', [ClienteController::class, 'show'])->name('clientes.show');
    Route::patch('clientes/{cliente}/estado', [ClienteController::class, 'updateEstado'])->name('clientes.estado.update');

    Route::post('clientes/{cliente}/intereses', [ClienteInteresController::class, 'store'])->name('clientes.intereses.store');
    Route::post('clientes/{cliente}/notas', [NotaSeguimientoController::class, 'store'])->name('clientes.notas.store');
});
