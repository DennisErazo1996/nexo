<?php

use App\Http\Controllers\Equipo\AgenteController;
use App\Http\Controllers\Equipo\EquipoController;
use App\Http\Controllers\Equipo\InvitationController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('equipo', [EquipoController::class, 'edit'])->name('equipo.edit');
    Route::patch('equipo', [EquipoController::class, 'update'])->name('equipo.update');

    Route::patch('equipo/agentes/{agente}', [AgenteController::class, 'update'])->name('equipo.agentes.update');
    Route::delete('equipo/agentes/{agente}', [AgenteController::class, 'destroy'])->name('equipo.agentes.destroy');

    Route::post('equipo/invitaciones', [InvitationController::class, 'store'])->name('equipo.invitaciones.store');
});

Route::get('equipo/{equipo}/invitacion', [InvitationController::class, 'show'])
    ->middleware('signed')
    ->name('equipo.invitaciones.show');
