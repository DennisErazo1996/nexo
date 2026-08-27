<?php

use App\Http\Controllers\Coincidencia\CoincidenciaController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('seguimientos', [CoincidenciaController::class, 'seguimientos'])->name('seguimientos.index');
});
