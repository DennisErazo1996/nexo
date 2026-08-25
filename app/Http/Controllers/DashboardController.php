<?php

namespace App\Http\Controllers;

use App\Enums\EstadoCliente;
use App\Enums\EstadoCoincidencia;
use App\Enums\EstadoPropiedad;
use App\Enums\Moneda;
use App\Enums\TipoPropiedad;
use App\Models\Cliente;
use App\Models\Coincidencia;
use App\Models\NotaSeguimiento;
use App\Models\Propiedad;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Días sin nueva nota de seguimiento para considerar a un cliente "sin seguimiento".
     */
    private const DIAS_SIN_SEGUIMIENTO = 14;

    /**
     * Display the main team dashboard.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $equipoId = $user->equipo_id;

        // 1. Estadísticas de Propiedades
        $propiedadesTotales = Propiedad::count();
        $propiedadesDisponibles = Propiedad::where('estado', EstadoPropiedad::Disponible)->count();
        $propiedadesReservadas = Propiedad::where('estado', EstadoPropiedad::Reservada)->count();
        $propiedadesVendidas = Propiedad::where('estado', EstadoPropiedad::Vendida)->count();
        $propiedadesRetiradas = Propiedad::where('estado', EstadoPropiedad::Retirada)->count();

        // 2. Estadísticas de Clientes
        $clientesTotales = Cliente::count();
        $clientesActivos = Cliente::whereIn('estado', [
            EstadoCliente::Nuevo,
            EstadoCliente::Contactado,
            EstadoCliente::Visitando,
            EstadoCliente::Negociando,
        ])->count();
        $clientesNuevosMes = Cliente::where('created_at', '>=', now()->startOfMonth())->count();
        $clientesCerrados = Cliente::where('estado', EstadoCliente::Cerrado)->count();
        $clientesPerdidos = Cliente::where('estado', EstadoCliente::Perdido)->count();

        $clientesSinSeguimientoCount = Cliente::whereIn('estado', [
            EstadoCliente::Nuevo,
            EstadoCliente::Contactado,
            EstadoCliente::Visitando,
            EstadoCliente::Negociando,
        ])->whereDoesntHave('notas', function ($query): void {
            $query->where('created_at', '>=', now()->subDays(self::DIAS_SIN_SEGUIMIENTO));
        })->count();

        // 3. Estadísticas de Coincidencias
        $coincidenciasPendientesCount = Coincidencia::where('estado', EstadoCoincidencia::Pendiente)->count();
        $coincidenciasNotificadasCount = Coincidencia::where('estado', EstadoCoincidencia::Notificado)->count();

        // 4. Valor total estimado de cartera disponible
        $valorCarteraRaw = Propiedad::where('estado', EstadoPropiedad::Disponible)
            ->select('moneda', DB::raw('SUM(precio) as total_valor'), DB::raw('COUNT(*) as count'))
            ->groupBy('moneda')
            ->get();

        $valorCartera = [
            'HNL' => 0.0,
            'USD' => 0.0,
        ];
        foreach ($valorCarteraRaw as $item) {
            $monedaVal = $item->moneda instanceof Moneda ? $item->moneda->value : (string) $item->moneda;
            if (array_key_exists($monedaVal, $valorCartera)) {
                $valorCartera[$monedaVal] = (float) $item->total_valor;
            }
        }

        // 5. Funnel / Pipeline de Clientes
        $clientesPorEstadoCounts = Cliente::query()
            ->select('estado', DB::raw('count(*) as count'))
            ->groupBy('estado')
            ->get()
            ->mapWithKeys(function ($item) {
                $estadoKey = $item->estado instanceof EstadoCliente ? $item->estado->value : (string) $item->estado;

                return [$estadoKey => (int) $item->count];
            })
            ->all();

        $pipelineClientes = array_map(function (EstadoCliente $estado) use ($clientesPorEstadoCounts, $clientesTotales) {
            $count = $clientesPorEstadoCounts[$estado->value] ?? 0;
            $porcentaje = $clientesTotales > 0 ? (int) round(($count / $clientesTotales) * 100) : 0;

            return [
                'estado' => $estado->value,
                'label' => $estado->label(),
                'count' => $count,
                'porcentaje' => $porcentaje,
            ];
        }, EstadoCliente::cases());

        // 6. Distribución de Propiedades por Tipo
        $propiedadesPorTipo = Propiedad::query()
            ->select('tipo', DB::raw('count(*) as count'))
            ->groupBy('tipo')
            ->orderByDesc('count')
            ->get()
            ->map(function ($item) use ($propiedadesTotales) {
                $tipoEnum = $item->tipo instanceof TipoPropiedad ? $item->tipo : TipoPropiedad::tryFrom((string) $item->tipo);
                $count = (int) $item->count;
                $porcentaje = $propiedadesTotales > 0 ? (int) round(($count / $propiedadesTotales) * 100) : 0;

                return [
                    'tipo' => $tipoEnum ? $tipoEnum->value : (string) $item->tipo,
                    'label' => $tipoEnum ? $tipoEnum->label() : (string) $item->tipo,
                    'count' => $count,
                    'porcentaje' => $porcentaje,
                ];
            });

        // 7. Coincidencias Pendientes Recientes
        $coincidenciasRecientes = Coincidencia::query()
            ->where('estado', EstadoCoincidencia::Pendiente)
            ->with([
                'cliente:id,nombre,telefono,estado',
                'propiedad:id,tipo,zona,precio,moneda,estado',
                'propiedad.fotos' => fn ($query) => $query->limit(1),
            ])
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        // 8. Clientes que Requieren Atención (sin notas recientes)
        $clientesAtencion = Cliente::query()
            ->with('agenteRegistro:id,name')
            ->withMax('notas', 'created_at')
            ->whereIn('estado', [
                EstadoCliente::Nuevo,
                EstadoCliente::Contactado,
                EstadoCliente::Visitando,
                EstadoCliente::Negociando,
            ])
            ->whereDoesntHave('notas', function ($query): void {
                $query->where('created_at', '>=', now()->subDays(self::DIAS_SIN_SEGUIMIENTO));
            })
            ->orderBy('created_at')
            ->limit(5)
            ->get();

        // 9. Propiedades Recientes
        $propiedadesRecientes = Propiedad::query()
            ->with(['fotos' => fn ($query) => $query->limit(1)])
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        // 10. Actividad Reciente del Equipo
        $actividadReciente = NotaSeguimiento::query()
            ->whereHas('cliente')
            ->with([
                'agente:id,name',
                'cliente:id,nombre',
            ])
            ->orderByDesc('created_at')
            ->limit(6)
            ->get();

        // 11. Resumen de Agentes del Equipo
        $agentesEquipo = User::query()
            ->where('equipo_id', $equipoId)
            ->withCount(['clientesRegistrados', 'propiedadAgentes'])
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'telefono', 'rol']);

        return Inertia::render('dashboard', [
            'stats' => [
                'propiedades' => [
                    'totales' => $propiedadesTotales,
                    'disponibles' => $propiedadesDisponibles,
                    'reservadas' => $propiedadesReservadas,
                    'vendidas' => $propiedadesVendidas,
                    'retiradas' => $propiedadesRetiradas,
                ],
                'clientes' => [
                    'totales' => $clientesTotales,
                    'activos' => $clientesActivos,
                    'nuevos_mes' => $clientesNuevosMes,
                    'cerrados' => $clientesCerrados,
                    'perdidos' => $clientesPerdidos,
                    'sin_seguimiento' => $clientesSinSeguimientoCount,
                ],
                'coincidencias' => [
                    'pendientes' => $coincidenciasPendientesCount,
                    'notificadas' => $coincidenciasNotificadasCount,
                ],
                'valor_cartera' => $valorCartera,
            ],
            'pipeline_clientes' => $pipelineClientes,
            'propiedades_por_tipo' => $propiedadesPorTipo,
            'coincidencias_recientes' => $coincidenciasRecientes,
            'clientes_atencion' => $clientesAtencion,
            'propiedades_recientes' => $propiedadesRecientes,
            'actividad_reciente' => $actividadReciente,
            'agentes_equipo' => $agentesEquipo,
        ]);
    }
}
