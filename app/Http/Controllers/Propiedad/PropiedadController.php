<?php

namespace App\Http\Controllers\Propiedad;

use App\Actions\Coincidencia\GenerarCoincidencias;
use App\Actions\PropiedadFoto\ProcesarFoto;
use App\Enums\CondicionLegal;
use App\Enums\EstadoPropiedad;
use App\Enums\FormaPago;
use App\Enums\Moneda;
use App\Enums\TipoPropiedad;
use App\Enums\UnidadMedida;
use App\Http\Controllers\Controller;
use App\Http\Requests\Propiedad\StorePropiedadRequest;
use App\Http\Requests\Propiedad\UpdateEstadoPropiedadRequest;
use App\Models\Coincidencia;
use App\Models\EtiquetaInteres;
use App\Models\Propiedad;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PropiedadController extends Controller
{
    /**
     * List the equipo's propiedades, filtered by estado and/or tipo.
     */
    public function index(Request $request): Response
    {
        $propiedades = Propiedad::query()
            ->with(['fotos' => fn ($query) => $query->limit(1)])
            ->when($request->filled('estado'), fn ($query) => $query->where('estado', $request->string('estado')->value()))
            ->when($request->filled('tipo'), fn ($query) => $query->where('tipo', $request->string('tipo')->value()))
            ->orderByDesc('created_at')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('propiedades/index', [
            'propiedades' => $propiedades,
            'filters' => $request->only(['estado', 'tipo']),
            'estados' => $this->options(EstadoPropiedad::cases()),
            'tipos' => $this->options(TipoPropiedad::cases()),
        ]);
    }

    /**
     * Show the propiedad creation form.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('propiedades/create', [
            'etiquetas' => EtiquetaInteres::orderBy('nombre')->get(['id', 'nombre']),
            'agentes' => $request->user()->equipo->agentes()->orderBy('name')->get(['id', 'name']),
            'tipos' => $this->options(TipoPropiedad::cases()),
            'unidadesMedida' => $this->options(UnidadMedida::cases()),
            'monedas' => $this->options(Moneda::cases()),
            'formasPago' => $this->options(FormaPago::cases()),
            'condicionesLegales' => $this->options(CondicionLegal::cases()),
        ]);
    }

    /**
     * Create the propiedad along with its etiquetas, co-listers, and fotos.
     */
    public function store(StorePropiedadRequest $request, ProcesarFoto $procesarFoto, GenerarCoincidencias $generarCoincidencias): RedirectResponse
    {
        $propiedad = DB::transaction(function () use ($request, $procesarFoto) {
            $propiedad = Propiedad::create($request->safe()->except(['etiquetas', 'agentes', 'fotos']));

            foreach ($request->validated('etiquetas', []) as $etiquetaId) {
                $propiedad->etiquetas()->create(['etiqueta_id' => $etiquetaId]);
            }

            /** @var array<int, int> $agentesSeleccionados */
            $agentesSeleccionados = $request->validated('agentes', []);

            $coListers = collect($agentesSeleccionados)
                ->push($request->user()->id)
                ->unique();

            foreach ($coListers as $agenteId) {
                $propiedad->agentes()->create(['agente_id' => $agenteId]);
            }

            foreach ($request->file('fotos', []) as $orden => $foto) {
                $rutas = $procesarFoto->handle($foto, $propiedad->id);

                $propiedad->fotos()->create([...$rutas, 'orden' => $orden]);
            }

            return $propiedad;
        });

        $generarCoincidencias->paraPropiedad($propiedad);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Propiedad creada.')]);

        return to_route('propiedades.show', $propiedad);
    }

    /**
     * Show a propiedad's detail: fotos, etiquetas, co-listers, and matched clientes.
     */
    public function show(Propiedad $propiedad): Response
    {
        $propiedad->load([
            'fotos',
            'etiquetas.etiqueta:id,nombre',
            'agentes.agente:id,name,telefono',
        ]);

        $coincidencias = Coincidencia::with('cliente:id,nombre,telefono')
            ->where('propiedad_id', $propiedad->id)
            ->get();

        return Inertia::render('propiedades/show', [
            'propiedad' => $propiedad,
            'coincidencias' => $coincidencias,
            'estados' => $this->options(EstadoPropiedad::cases()),
            'tipos' => $this->options(TipoPropiedad::cases()),
            'unidadesMedida' => $this->options(UnidadMedida::cases()),
            'monedas' => $this->options(Moneda::cases()),
            'formasPago' => $this->options(FormaPago::cases()),
            'condicionesLegales' => $this->options(CondicionLegal::cases()),
        ]);
    }

    /**
     * Update a propiedad's estado, regenerating coincidencias if it becomes disponible again.
     */
    public function updateEstado(UpdateEstadoPropiedadRequest $request, Propiedad $propiedad, GenerarCoincidencias $generarCoincidencias): RedirectResponse
    {
        $estabaDisponible = $propiedad->estado === EstadoPropiedad::Disponible;
        $estadoNuevo = EstadoPropiedad::from($request->validated('estado'));

        $propiedad->update($request->validated());

        if (! $estabaDisponible && $estadoNuevo === EstadoPropiedad::Disponible) {
            $generarCoincidencias->paraPropiedad($propiedad);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Estado actualizado.')]);

        return to_route('propiedades.show', $propiedad);
    }

    /**
     * Build a {value, label} option list from a backed enum's cases.
     *
     * @param  array<int, TipoPropiedad|UnidadMedida|Moneda|FormaPago|CondicionLegal|EstadoPropiedad>  $cases
     * @return array<int, array{value: string, label: string}>
     */
    private function options(array $cases): array
    {
        return array_map(
            fn ($case) => ['value' => $case->value, 'label' => $case->label()],
            $cases,
        );
    }
}
