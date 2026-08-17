<?php

namespace App\Http\Controllers\Cliente;

use App\Enums\EstadoCliente;
use App\Http\Controllers\Controller;
use App\Http\Requests\Cliente\BuscarClienteRequest;
use App\Http\Requests\Cliente\StoreClienteRequest;
use App\Http\Requests\Cliente\UpdateEstadoClienteRequest;
use App\Models\Cliente;
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
            ->when($request->filled('estado'), fn ($query) => $query->where('estado', $request->string('estado')->value()))
            ->when($request->boolean('sin_seguimiento'), function ($query): void {
                $query->whereDoesntHave('notas', function ($query): void {
                    $query->where('created_at', '>=', now()->subDays(self::DIAS_SIN_SEGUIMIENTO));
                });
            })
            ->orderBy('nombre')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('clientes/index', [
            'clientes' => $clientes,
            'filters' => $request->only(['estado', 'sin_seguimiento']),
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
    public function store(StoreClienteRequest $request): RedirectResponse
    {
        $cliente = DB::transaction(function () use ($request) {
            $cliente = Cliente::create([
                'nombre' => $request->validated('nombre'),
                'telefono' => $request->validated('telefono'),
                'agente_registro_id' => $request->user()->id,
            ]);

            $cliente->intereses()->create([
                'etiqueta_id' => $request->validated('etiqueta_id'),
                'zona' => $request->validated('zona'),
                'presupuesto_min' => $request->validated('presupuesto_min'),
                'presupuesto_max' => $request->validated('presupuesto_max'),
                'agente_id' => $request->user()->id,
            ]);

            return $cliente;
        });

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
        ]);
        $cliente->setRelation('notas', $cliente->notas->sortByDesc('created_at')->values());

        return Inertia::render('clientes/show', [
            'cliente' => $cliente,
            'etiquetas' => EtiquetaInteres::orderBy('nombre')->get(['id', 'nombre']),
            'estados' => $this->estadosOptions(),
        ]);
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
}
