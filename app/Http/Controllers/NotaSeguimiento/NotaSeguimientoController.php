<?php

namespace App\Http\Controllers\NotaSeguimiento;

use App\Http\Controllers\Controller;
use App\Http\Requests\NotaSeguimiento\StoreNotaRequest;
use App\Models\Cliente;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class NotaSeguimientoController extends Controller
{
    /**
     * Add a new follow-up nota to a cliente.
     */
    public function store(StoreNotaRequest $request, Cliente $cliente): RedirectResponse
    {
        $cliente->notas()->create([
            'texto' => $request->validated('texto'),
            'propiedad_id' => $request->validated('propiedad_id'),
            'agente_id' => $request->user()->id,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Nota agregada.')]);

        return to_route('clientes.show', $cliente);
    }
}
