<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/equipo.php';
require __DIR__.'/clientes.php';
require __DIR__.'/propiedades.php';
require __DIR__.'/coincidencias.php';
require __DIR__.'/seguimientos.php';
