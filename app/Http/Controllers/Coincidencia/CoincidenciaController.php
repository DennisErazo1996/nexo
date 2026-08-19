<?php

namespace App\Http\Controllers\Coincidencia;

use App\Enums\EstadoCoincidencia;
use App\Http\Controllers\Controller;
use App\Http\Requests\Coincidencia\DestroyCoincidenciaRequest;
use App\Http\Requests\Coincidencia\UpdateEstadoCoincidenciaRequest;
use App\Models\Coincidencia;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CoincidenciaController extends Controller
{
    /**
     * List the pendiente coincidencias related to the authenticated agente.
     */
    public function index(Request $request): Response
    {
        $agenteId = $request->user()->id;

        $coincidencias = Coincidencia::query()
            ->where('estado', EstadoCoincidencia::Pendiente)
            ->where(fn ($query) => $query
                ->whereHas('cliente', fn ($query) => $query
                    ->where('agente_registro_id', $agenteId)
                    ->orWhereHas('intereses', fn ($query) => $query->where('agente_id', $agenteId)))
                ->orWhereHas('propiedad', fn ($query) => $query
                    ->whereHas('agentes', fn ($query) => $query->where('agente_id', $agenteId))))
            ->with([
                'cliente:id,nombre,telefono',
                'propiedad:id,tipo,zona,precio,moneda',
            ])
            ->orderByDesc('created_at')
            ->paginate(20);

        return Inertia::render('coincidencias/index', [
            'coincidencias' => $coincidencias,
        ]);
    }

    /**
     * Update a coincidencia's estado (notificado or descartado).
     */
    public function updateEstado(UpdateEstadoCoincidenciaRequest $request, Coincidencia $coincidencia): RedirectResponse
    {
        $coincidencia->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Coincidencia actualizada.')]);

        return to_route('coincidencias.index');
    }

    /**
     * Remove a coincidencia between a cliente and a propiedad.
     */
    public function destroy(DestroyCoincidenciaRequest $request, Coincidencia $coincidencia): RedirectResponse
    {
        $clienteId = $coincidencia->cliente_id;

        $coincidencia->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Propiedad potencial eliminada.')]);

        return to_route('clientes.show', $clienteId);
    }
}
