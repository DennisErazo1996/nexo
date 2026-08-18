<?php

namespace Tests\Feature\Coincidencia;

use App\Models\Cliente;
use App\Models\Coincidencia;
use App\Models\Propiedad;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CoincidenciaScopingTest extends TestCase
{
    use RefreshDatabase;

    public function test_agente_cannot_update_coincidencia_from_another_equipo()
    {
        $agenteA = User::factory()->create();
        $agenteB = User::factory()->create();

        $clienteB = Cliente::factory()->registradoPor($agenteB)->create();
        $propiedadB = Propiedad::factory()->forEquipo($agenteB->equipo)->create();
        $coincidenciaB = Coincidencia::factory()->forEquipo($agenteB->equipo)->create([
            'cliente_id' => $clienteB->id,
            'propiedad_id' => $propiedadB->id,
        ]);

        $response = $this->actingAs($agenteA)->patch(route('coincidencias.estado.update', $coincidenciaB), [
            'estado' => 'notificado',
        ]);

        $response->assertNotFound();
    }

    public function test_index_does_not_leak_coincidencias_from_another_equipo()
    {
        $agenteA = User::factory()->create();
        $agenteB = User::factory()->create();

        $clienteA = Cliente::factory()->registradoPor($agenteA)->create();
        $propiedadA = Propiedad::factory()->forEquipo($agenteA->equipo)->create();
        $coincidenciaA = Coincidencia::factory()->forEquipo($agenteA->equipo)->create([
            'cliente_id' => $clienteA->id,
            'propiedad_id' => $propiedadA->id,
        ]);

        $clienteB = Cliente::factory()->registradoPor($agenteB)->create();
        $propiedadB = Propiedad::factory()->forEquipo($agenteB->equipo)->create();
        Coincidencia::factory()->forEquipo($agenteB->equipo)->create([
            'cliente_id' => $clienteB->id,
            'propiedad_id' => $propiedadB->id,
        ]);

        $response = $this->actingAs($agenteA)->get(route('coincidencias.index'));

        $response->assertInertia(fn ($page) => $page
            ->component('coincidencias/index')
            ->has('coincidencias.data', 1)
            ->where('coincidencias.data.0.id', $coincidenciaA->id)
        );
    }
}
