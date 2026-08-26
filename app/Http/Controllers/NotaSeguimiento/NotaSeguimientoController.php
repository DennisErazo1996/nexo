<?php

namespace App\Http\Controllers\NotaSeguimiento;

use App\Enums\EstadoCliente;
use App\Http\Controllers\Controller;
use App\Http\Requests\NotaSeguimiento\StoreNotaRequest;
use App\Models\Cliente;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class NotaSeguimientoController extends Controller
{
    /**
     * Add a new follow-up nota to a cliente. The first nota that references a
     * propiedad marks the cliente as contactado.
     */
    public function store(StoreNotaRequest $request, Cliente $cliente): RedirectResponse
    {
        DB::transaction(function () use ($request, $cliente): void {
            $cliente->notas()->create([
                'texto' => $request->validated('texto'),
                'propiedad_id' => $request->validated('propiedad_id'),
                'agente_id' => $request->user()->id,
            ]);

            if ($request->validated('propiedad_id') !== null && $cliente->estado === EstadoCliente::Nuevo) {
                $cliente->update(['estado' => EstadoCliente::Contactado]);
            }
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Nota agregada.')]);

        return to_route('clientes.show', $cliente);
    }
}
