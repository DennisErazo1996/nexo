<?php

namespace App\Http\Controllers\Cliente;

use App\Actions\Coincidencia\GenerarCoincidencias;
use App\Enums\EstadoCliente;
use App\Enums\EstadoCoincidencia;
use App\Http\Controllers\Controller;
use App\Http\Requests\Cliente\BuscarClienteRequest;
use App\Http\Requests\Cliente\DestroyClienteRequest;
use App\Http\Requests\Cliente\StoreClienteRequest;
use App\Http\Requests\Cliente\UpdateEstadoClienteRequest;
use App\Models\Cliente;
use App\Models\Coincidencia;
use App\Models\EtiquetaInteres;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ClienteController extends Controller
{
    /**
     * Number of days without a nota before a cliente is considered
     * "sin seguimiento reciente".
     */
    private const DIAS_SIN_SEGUIMIENTO = 14;

    /**
     * List the equipo's clientes, filtered by estado and/or seguimiento.
     */
    public function index(Request $request): Response
    {
        $clientes = Cliente::query()
            ->with('agenteRegistro:id,name')
            ->withMax('notas', 'created_at')
            ->when($request->filled('search'), function ($query) use ($request): void {
                $rawSearch = trim($request->string('search')->value());
                $terms = array_filter(explode(' ', $rawSearch));
                $lowerFull = mb_strtolower($rawSearch);

                $query->where(function ($q) use ($lowerFull, $terms): void {
                    $q->whereRaw('LOWER(nombre) LIKE ?', ["%{$lowerFull}%"])
                        ->orWhere('telefono', 'like', "%{$lowerFull}%");

                    if (count($terms) > 1) {
                        $q->orWhere(function ($wordQuery) use ($terms): void {
                            foreach ($terms as $term) {
                                $lowerTerm = mb_strtolower($term);
                                $wordQuery->where(function ($sub) use ($lowerTerm): void {
                                    $sub->whereRaw('LOWER(nombre) LIKE ?', ["%{$lowerTerm}%"])
                                        ->orWhere('telefono', 'like', "%{$lowerTerm}%");
                                });
                            }
                        });
                    }
                });
            })
            ->when($request->filled('estado'), fn ($query) => $query->where('estado', $request->string('estado')->value()))
            ->when($request->boolean('sin_seguimiento'), function ($query): void {
                $query->whereDoesntHave('notas', function ($query): void {
                    $query->where('created_at', '>=', now()->subDays(self::DIAS_SIN_SEGUIMIENTO));
                });
            })
            ->when($request->filled('sort'), function ($query) use ($request): void {
                $direction = strtolower($request->string('direction')->value()) === 'desc' ? 'desc' : 'asc';
                $field = match ($request->string('sort')->value()) {
                    'nombre' => 'nombre',
                    'telefono' => 'telefono',
                    'estado' => 'estado',
                    'created_at' => 'created_at',
                    'notas_max_created_at' => 'notas_max_created_at',
                    default => 'nombre',
                };
                $query->orderBy($field, $direction);
            }, function ($query): void {
                $query->orderBy('nombre');
            })
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('clientes/index', [
            'clientes' => $clientes,
            'filters' => $request->only(['search', 'estado', 'sin_seguimiento', 'sort', 'direction']),
            'estados' => $this->estadosOptions(),
        ]);
    }

    /**
     * Show the first step of the cliente registration wizard.
     */
    public function create(): Response
    {
        return Inertia::render('clientes/create', [
            'step' => 'telefono',
            'etiquetas' => EtiquetaInteres::orderBy('nombre')->get(['id', 'nombre']),
        ]);
    }

    /**
     * Look up a telefono within the equipo, either redirecting to the
     * existing cliente or advancing the wizard to capture cliente data.
     */
    public function buscar(BuscarClienteRequest $request): Response|RedirectResponse
    {
        $telefono = Cliente::normalizarTelefono($request->string('telefono')->value());

        $cliente = Cliente::where('telefono', $telefono)->with('agenteRegistro:id,name')->first();

        if ($cliente) {
            Inertia::flash('toast', [
                'type' => 'info',
                'message' => __('Ya registrado por :agente el :fecha.', [
                    'agente' => $cliente->agenteRegistro->name,
                    'fecha' => $cliente->created_at?->format('d/m/Y'),
                ]),
            ]);

            return to_route('clientes.show', $cliente);
        }

        return Inertia::render('clientes/create', [
            'step' => 'datos',
            'telefono' => $telefono,
            'etiquetas' => EtiquetaInteres::orderBy('nombre')->get(['id', 'nombre']),
        ]);
    }

    /**
     * Create the cliente along with its first interest.
     */
    public function store(StoreClienteRequest $request, GenerarCoincidencias $generarCoincidencias): RedirectResponse
    {
        [$cliente, $interes] = DB::transaction(function () use ($request) {
            $cliente = Cliente::create([
                'nombre' => $request->validated('nombre'),
                'telefono' => $request->validated('telefono'),
                'agente_registro_id' => $request->user()->id,
            ]);

            $interes = $cliente->intereses()->create([
                'etiqueta_id' => $request->validated('etiqueta_id'),
                'zona' => $request->validated('zona'),
                'presupuesto_min' => $request->validated('presupuesto_min'),
                'presupuesto_max' => $request->validated('presupuesto_max'),
                'agente_id' => $request->user()->id,
            ]);

            return [$cliente, $interes];
        });

        $generarCoincidencias->paraInteres($interes);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Cliente creado.')]);

        return to_route('clientes.show', $cliente);
    }

    /**
     * Show a cliente's detail: intereses, notas, and available etiquetas.
     */
    public function show(Cliente $cliente): Response
    {
        $cliente->load([
            'agenteRegistro:id,name',
            'intereses.etiqueta:id,nombre',
            'intereses.agente:id,name',
            'notas.agente:id,name',
            'notas.propiedad:id,tipo,zona,precio,moneda',
        ]);
        $cliente->setRelation('notas', $cliente->notas->sortByDesc('created_at')->values());

        $coincidencias = Coincidencia::with([
            'propiedad:id,tipo,zona,precio,moneda',
            'propiedad.agentes.agente:id,name',
        ])
            ->where('cliente_id', $cliente->id)
            ->get();

        return Inertia::render('clientes/show', [
            'cliente' => $cliente,
            'coincidencias' => $coincidencias,
            'etiquetas' => EtiquetaInteres::orderBy('nombre')->get(['id', 'nombre']),
            'estados' => $this->estadosOptions(),
            'estadosCoincidencia' => $this->estadosCoincidenciaOptions(),
        ]);
    }

    /**
     * Get the list of estado coincidencia options with their Spanish labels.
     *
     * @return array<int, array{value: string, label: string}>
     */
    private function estadosCoincidenciaOptions(): array
    {
        return array_map(
            fn (EstadoCoincidencia $estado) => [
                'value' => $estado->value,
                'label' => $estado->label(),
            ],
            EstadoCoincidencia::cases(),
        );
    }

    /**
     * Get the list of estado options with their Spanish labels.
     *
     * @return array<int, array{value: string, label: string}>
     */
    private function estadosOptions(): array
    {
        return array_map(
            fn (EstadoCliente $estado) => ['value' => $estado->value, 'label' => $estado->label()],
            EstadoCliente::cases(),
        );
    }

    /**
     * Update a cliente's estado in the pipeline.
     */
    public function updateEstado(UpdateEstadoClienteRequest $request, Cliente $cliente): RedirectResponse
    {
        $cliente->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Estado actualizado.')]);

        return to_route('clientes.show', $cliente);
    }

    /**
     * Delete a cliente and its related records.
     */
    public function destroy(DestroyClienteRequest $request, Cliente $cliente): RedirectResponse
    {
        $cliente->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Cliente eliminado.')]);

        return to_route('clientes.index');
    }
}
