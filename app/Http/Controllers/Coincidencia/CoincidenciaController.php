<?php

namespace App\Http\Controllers\Coincidencia;

use App\Actions\Coincidencia\GenerarCoincidencias;
use App\Enums\CondicionLegal;
use App\Enums\EstadoCoincidencia;
use App\Enums\EstadoPropiedad;
use App\Enums\FormaPago;
use App\Enums\Moneda;
use App\Enums\TipoPropiedad;
use App\Enums\UnidadMedida;
use App\Http\Controllers\Controller;
use App\Http\Requests\Coincidencia\DestroyCoincidenciaRequest;
use App\Http\Requests\Coincidencia\UpdateEstadoCoincidenciaRequest;
use App\Models\Coincidencia;
use Illuminate\Database\Eloquent\Builder;
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
        $coincidencias = Coincidencia::query()
            ->where('estado', EstadoCoincidencia::Pendiente)
            ->tap(fn ($query) => $this->scopeRelacionado($query, $request->user()->id))
            ->when($request->filled('search'), fn ($query) => $this->scopeBusqueda($query, $request->string('search')->value()))
            ->with([
                'cliente:id,nombres,apellidos,telefono,agente_registro_id',
                'cliente.agenteRegistro:id,nombres,apellidos',
                'propiedad',
                'propiedad.etiquetas.etiqueta:id,nombre',
                'propiedad.agentes.agente:id,nombres,apellidos,telefono',
            ])
            ->orderByDesc('created_at')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('coincidencias/index', [
            'coincidencias' => $coincidencias,
            'filters' => $request->only(['search']),
            'tipos' => $this->options(TipoPropiedad::cases()),
            'unidadesMedida' => $this->options(UnidadMedida::cases()),
            'monedas' => $this->options(Moneda::cases()),
            'formasPago' => $this->options(FormaPago::cases()),
            'condicionesLegales' => $this->options(CondicionLegal::cases()),
        ]);
    }

    /**
     * List all coincidencias related to the authenticated agente, across every
     * estado, so the dashboard pipeline stages have somewhere useful to link.
     */
    public function seguimientos(Request $request): Response
    {
        $coincidencias = Coincidencia::query()
            ->tap(fn ($query) => $this->scopeRelacionado($query, $request->user()->id))
            ->when($request->filled('search'), fn ($query) => $this->scopeBusqueda($query, $request->string('search')->value()))
            ->when(
                $request->filled('estado'),
                fn ($query) => $query->where('estado', $request->string('estado')->value()),
                fn ($query) => $query->where('estado', '!=', EstadoCoincidencia::Pendiente)
            )
            ->with([
                'cliente:id,nombres,apellidos,telefono,agente_registro_id',
                'cliente.agenteRegistro:id,nombres,apellidos',
                'propiedad:id,tipo,zona,precio,moneda',
                'propiedad.agentes.agente:id,nombres,apellidos',
            ])
            ->when($request->filled('sort'), function ($query) use ($request): void {
                $direction = strtolower($request->string('direction')->value()) === 'asc' ? 'asc' : 'desc';
                $field = match ($request->string('sort')->value()) {
                    'estado' => 'estado',
                    default => 'created_at',
                };
                $query->orderBy($field, $direction);
            }, fn ($query) => $query->orderByDesc('created_at'))
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('seguimientos/index', [
            'coincidencias' => $coincidencias,
            'filters' => $request->only(['search', 'estado', 'sort', 'direction']),
            'estados' => $this->estadosOptions(),
        ]);
    }

    /**
     * Restrict the query to coincidencias the agente is involved in: they
     * registered the cliente, captured the interés, or co-list the propiedad.
     *
     * @param  Builder<Coincidencia>  $query
     */
    private function scopeRelacionado(Builder $query, int $agenteId): void
    {
        $query->where(fn ($query) => $query
            ->whereHas('cliente', fn ($query) => $query
                ->where('agente_registro_id', $agenteId)
                ->orWhereHas('intereses', fn ($query) => $query->where('agente_id', $agenteId)))
            ->orWhereHas('propiedad', fn ($query) => $query
                ->whereHas('agentes', fn ($query) => $query->where('agente_id', $agenteId))));
    }

    /**
     * Restrict the query to coincidencias whose cliente or propiedad match the
     * given search term(s).
     *
     * @param  Builder<Coincidencia>  $query
     */
    private function scopeBusqueda(Builder $query, string $search): void
    {
        $rawSearch = trim($search);
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
    }

    /**
     * Get the list of estado options with their Spanish labels.
     *
     * @return array<int, array{value: string, label: string}>
     */
    private function estadosOptions(): array
    {
        return array_map(
            fn (EstadoCoincidencia $estado) => ['value' => $estado->value, 'label' => $estado->label()],
            EstadoCoincidencia::cases(),
        );
    }

    /**
     * Update a coincidencia's estado.
     */
    public function updateEstado(UpdateEstadoCoincidenciaRequest $request, Coincidencia $coincidencia, GenerarCoincidencias $generarCoincidencias): RedirectResponse
    {
        $nuevoEstado = EstadoCoincidencia::from($request->validated('estado'));
        $coincidencia->update(['estado' => $nuevoEstado]);

        if ($nuevoEstado === EstadoCoincidencia::Cerrado) {
            $coincidencia->propiedad()->update(['estado' => EstadoPropiedad::Vendida]);
            $generarCoincidencias->descartarActivas($coincidencia->propiedad, $coincidencia->id);
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

    /**
     * Build a {value, label} option list from a backed enum's cases.
     */
    private function options(array $cases): array
    {
        return array_map(
            fn ($case) => ['value' => $case->value, 'label' => $case->label()],
            $cases,
        );
    }
}
