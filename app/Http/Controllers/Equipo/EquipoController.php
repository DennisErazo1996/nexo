<?php

namespace App\Http\Controllers\Equipo;

use App\Http\Controllers\Controller;
use App\Http\Requests\Equipo\UpdateEquipoRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EquipoController extends Controller
{
    /**
     * Show the equipo settings page.
     */
    public function edit(Request $request): Response
    {
        $equipo = $request->user()->equipo;

        return Inertia::render('equipo/edit', [
            'equipo' => $equipo->only(['id', 'nombre']),
            'agentes' => $equipo->agentes()
                ->withCount(['clientesRegistrados', 'propiedadAgentes'])
                ->orderBy('nombres')
                ->orderBy('apellidos')
                ->get(['id', 'nombres', 'apellidos', 'email', 'telefono', 'rol', 'created_at']),
        ]);
    }

    /**
     * Update the equipo's nombre.
     */
    public function update(UpdateEquipoRequest $request): RedirectResponse
    {
        $request->user()->equipo->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Equipo actualizado.')]);

        return to_route('equipo.edit');
    }
}
