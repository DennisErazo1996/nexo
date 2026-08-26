<?php

namespace App\Http\Controllers\Coincidencia;

use App\Enums\EstadoCoincidencia;
use App\Enums\EstadoPropiedad;
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
            ->when($request->filled('search'), function ($query) use ($request): void {
                $rawSearch = trim($request->string('search')->value());
                $lowerFull = mb_strtolower($rawSearch);
                $terms = array_filter(explode(' ', $rawSearch));

                $query->where(function ($q) use ($lowerFull, $terms): void {
                    $q->whereHas('cliente', fn ($c) => $c->whereRaw('LOWER(nombre) LIKE ?', ["%{$lowerFull}%"])->orWhere('telefono', 'like', "%{$lowerFull}%"))
                        ->orWhereHas('propiedad', fn ($p) => $p->whereRaw('LOWER(zona) LIKE ?', ["%{$lowerFull}%"])->orWhereRaw('LOWER(tipo) LIKE ?', ["%{$lowerFull}%"]));

                    if (count($terms) > 1) {
                        $q->orWhere(function ($wordQuery) use ($terms): void {
                            foreach ($terms as $term) {
                                $lowerTerm = mb_strtolower($term);
                                $wordQuery->where(function ($sub) use ($lowerTerm): void {
                                    $sub->whereHas('cliente', fn ($c) => $c->whereRaw('LOWER(nombre) LIKE ?', ["%{$lowerTerm}%"])->orWhere('telefono', 'like', "%{$lowerTerm}%"))
                                        ->orWhereHas('propiedad', fn ($p) => $p->whereRaw('LOWER(zona) LIKE ?', ["%{$lowerTerm}%"])->orWhereRaw('LOWER(tipo) LIKE ?', ["%{$lowerTerm}%"]));
                                });
                            }
                        });
                    }
                });
            })
            ->with([
                'cliente:id,nombre,telefono,agente_registro_id',
                'cliente.agenteRegistro:id,name',
                'propiedad:id,tipo,zona,precio,moneda',
                'propiedad.agentes.agente:id,name',
            ])
            ->orderByDesc('created_at')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('coincidencias/index', [
            'coincidencias' => $coincidencias,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Update a coincidencia's estado.
     */
    public function updateEstado(UpdateEstadoCoincidenciaRequest $request, Coincidencia $coincidencia): RedirectResponse
    {
        $nuevoEstado = EstadoCoincidencia::from($request->validated('estado'));
        $coincidencia->update(['estado' => $nuevoEstado]);

        if ($nuevoEstado === EstadoCoincidencia::Cerrado) {
            $coincidencia->propiedad()->update(['estado' => EstadoPropiedad::Vendida]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Coincidencia actualizada.')]);

        return back();
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
