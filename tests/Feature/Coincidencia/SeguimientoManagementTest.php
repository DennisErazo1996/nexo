<?php

namespace Tests\Feature\Coincidencia;

use App\Enums\EstadoCoincidencia;
use App\Models\Cliente;
use App\Models\Coincidencia;
use App\Models\Propiedad;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SeguimientoManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_lists_coincidencias_related_to_the_agente_across_every_estado()
    {
        $agente = User::factory()->create();
        $cliente = Cliente::factory()->registradoPor($agente)->create();
        $propiedad = Propiedad::factory()->forEquipo($agente->equipo)->create();

        $visitando = Coincidencia::factory()->forEquipo($agente->equipo)->create([
            'cliente_id' => $cliente->id,
            'propiedad_id' => $propiedad->id,
            'estado' => EstadoCoincidencia::Visitando,
        ]);

        $response = $this->actingAs($agente)->get(route('seguimientos.index'));

        $response->assertInertia(fn ($page) => $page
            ->component('seguimientos/index')
            ->has('coincidencias.data', 1)
            ->where('coincidencias.data.0.id', $visitando->id)
        );
    }

    public function test_filters_by_estado()
    {
        $agente = User::factory()->create();
        $cliente = Cliente::factory()->registradoPor($agente)->create();
        $propiedadNegociando = Propiedad::factory()->forEquipo($agente->equipo)->create();
        $propiedadCerrada = Propiedad::factory()->forEquipo($agente->equipo)->create();

        Coincidencia::factory()->forEquipo($agente->equipo)->create([
            'cliente_id' => $cliente->id,
            'propiedad_id' => $propiedadNegociando->id,
            'estado' => EstadoCoincidencia::Negociando,
        ]);
        $cerrada = Coincidencia::factory()->forEquipo($agente->equipo)->create([
            'cliente_id' => $cliente->id,
            'propiedad_id' => $propiedadCerrada->id,
            'estado' => EstadoCoincidencia::Cerrado,
        ]);

        $response = $this->actingAs($agente)->get(route('seguimientos.index', ['estado' => 'cerrado']));

        $response->assertInertia(fn ($page) => $page
            ->component('seguimientos/index')
            ->has('coincidencias.data', 1)
            ->where('coincidencias.data.0.id', $cerrada->id)
        );
    }

    public function test_agente_not_involved_does_not_see_the_coincidencia()
    {
        $agente = User::factory()->create();
        $otroAgente = User::factory()->forEquipo($agente->equipo)->create();

        $clienteAjeno = Cliente::factory()->registradoPor($otroAgente)->create();
        $propiedadAjena = Propiedad::factory()->forEquipo($agente->equipo)->create();
        Coincidencia::factory()->forEquipo($agente->equipo)->create([
            'cliente_id' => $clienteAjeno->id,
            'propiedad_id' => $propiedadAjena->id,
            'estado' => EstadoCoincidencia::Negociando,
        ]);

        $response = $this->actingAs($agente)->get(route('seguimientos.index'));

        $response->assertInertia(fn ($page) => $page
            ->component('seguimientos/index')
            ->has('coincidencias.data', 0)
        );
    }

    public function test_coincidencia_from_another_equipo_never_appears()
    {
        $agente = User::factory()->create();
        $otroEquipoAgente = User::factory()->create();

        $clienteOtroEquipo = Cliente::factory()->registradoPor($otroEquipoAgente)->create();
        $propiedadOtroEquipo = Propiedad::factory()->forEquipo($otroEquipoAgente->equipo)->create();
        Coincidencia::factory()->forEquipo($otroEquipoAgente->equipo)->create([
            'cliente_id' => $clienteOtroEquipo->id,
            'propiedad_id' => $propiedadOtroEquipo->id,
            'estado' => EstadoCoincidencia::Visitando,
        ]);

        $response = $this->actingAs($agente)->get(route('seguimientos.index'));

        $response->assertInertia(fn ($page) => $page
            ->component('seguimientos/index')
            ->has('coincidencias.data', 0)
        );
    }
}
