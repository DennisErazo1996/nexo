<?php

use App\Http\Controllers\Cliente\ClienteController;
use App\Http\Controllers\ClienteInteres\ClienteInteresController;
use App\Http\Controllers\NotaSeguimiento\NotaSeguimientoController;
use Illuminate\Support\Facades\Route;

Route::pattern('cliente', '[0-9]+');
Route::pattern('interes', '[0-9]+');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('clientes', [ClienteController::class, 'index'])->name('clientes.index');
    Route::get('clientes/nuevo', [ClienteController::class, 'create'])->name('clientes.create');
    Route::get('clientes/buscar', fn () => to_route('clientes.create'));
    Route::post('clientes/buscar', [ClienteController::class, 'buscar'])->name('clientes.buscar');
    Route::post('clientes', [ClienteController::class, 'store'])->name('clientes.store');
    Route::get('clientes/{cliente}', [ClienteController::class, 'show'])->name('clientes.show');
    Route::delete('clientes/{cliente}', [ClienteController::class, 'destroy'])->name('clientes.destroy');

    Route::post('clientes/{cliente}/intereses', [ClienteInteresController::class, 'store'])->name('clientes.intereses.store');
    Route::delete('clientes/{cliente}/intereses/{interes}', [ClienteInteresController::class, 'destroy'])->name('clientes.intereses.destroy');
    Route::post('clientes/{cliente}/notas', [NotaSeguimientoController::class, 'store'])->name('clientes.notas.store');
});
