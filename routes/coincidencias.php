<?php

use App\Http\Controllers\Coincidencia\CoincidenciaController;
use Illuminate\Support\Facades\Route;

Route::pattern('coincidencia', '[0-9]+');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('coincidencias', [CoincidenciaController::class, 'index'])->name('coincidencias.index');
    Route::patch('coincidencias/{coincidencia}/estado', [CoincidenciaController::class, 'updateEstado'])->name('coincidencias.estado.update');
    Route::delete('coincidencias/{coincidencia}', [CoincidenciaController::class, 'destroy'])->name('coincidencias.destroy');
});
