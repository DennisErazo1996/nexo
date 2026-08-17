<?php

use App\Http\Controllers\Propiedad\PropiedadController;
use App\Http\Controllers\PropiedadFoto\PropiedadFotoController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('propiedades', [PropiedadController::class, 'index'])->name('propiedades.index');
    Route::get('propiedades/nueva', [PropiedadController::class, 'create'])->name('propiedades.create');
    Route::post('propiedades', [PropiedadController::class, 'store'])->name('propiedades.store');
    Route::get('propiedades/{propiedad}', [PropiedadController::class, 'show'])->name('propiedades.show');
    Route::patch('propiedades/{propiedad}/estado', [PropiedadController::class, 'updateEstado'])->name('propiedades.estado.update');

    Route::post('propiedades/{propiedad}/fotos', [PropiedadFotoController::class, 'store'])->name('propiedades.fotos.store');
    Route::delete('propiedades/{propiedad}/fotos/{foto}', [PropiedadFotoController::class, 'destroy'])->name('propiedades.fotos.destroy');
});
