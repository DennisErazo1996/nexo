<?php

namespace App\Http\Controllers\ClienteInteres;

use App\Http\Controllers\Controller;
use App\Http\Requests\ClienteInteres\StoreInteresRequest;
use App\Models\Cliente;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class ClienteInteresController extends Controller
{
    /**
     * Add a new interest to an existing cliente.
     */
    public function store(StoreInteresRequest $request, Cliente $cliente): RedirectResponse
    {
        $cliente->intereses()->create([
            ...$request->validated(),
            'agente_id' => $request->user()->id,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Interés agregado.')]);

        return to_route('clientes.show', $cliente);
    }
}
