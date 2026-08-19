<?php

namespace Tests\Feature\Coincidencia;

use App\Models\Cliente;
use App\Models\Coincidencia;
use App\Models\Propiedad;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CoincidenciaManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_only_lists_coincidencias_related_to_the_agente()
    {
        $agente = User::factory()->create();
        $otroAgente = User::factory()->forEquipo($agente->equipo)->create();

        $clientePropio = Cliente::factory()->registradoPor($agente)->create();
        $propiedadAjena = Propiedad::factory()->forEquipo($agente->equipo)->create();
        $propiedadAjena->agentes()->create(['agente_id' => $otroAgente->id]);
        $coincidenciaPropia = Coincidencia::factory()->forEquipo($agente->equipo)->create([
            'cliente_id' => $clientePropio->id,
            'propiedad_id' => $propiedadAjena->id,
        ]);

        $clienteAjeno = Cliente::factory()->registradoPor($otroAgente)->create();
        $propiedadCualquiera = Propiedad::factory()->forEquipo($agente->equipo)->create();
        Coincidencia::factory()->forEquipo($agente->equipo)->create([
            'cliente_id' => $clienteAjeno->id,
            'propiedad_id' => $propiedadCualquiera->id,
        ]);

        $response = $this->actingAs($agente)->get(route('coincidencias.index'));

        $response->assertInertia(fn ($page) => $page
            ->component('coincidencias/index')
            ->has('coincidencias.data', 1)
            ->where('coincidencias.data.0.id', $coincidenciaPropia->id)
        );
    }

    public function test_agente_can_mark_coincidencia_as_notificado()
    {
        $agente = User::factory()->create();
        $cliente = Cliente::factory()->registradoPor($agente)->create();
        $propiedad = Propiedad::factory()->forEquipo($agente->equipo)->create();
        $coincidencia = Coincidencia::factory()->forEquipo($agente->equipo)->create([
            'cliente_id' => $cliente->id,
            'propiedad_id' => $propiedad->id,
        ]);

        $response = $this->actingAs($agente)->patch(route('coincidencias.estado.update', $coincidencia), [
            'estado' => 'notificado',
        ]);

        $response->assertRedirect(route('coincidencias.index'));
        $this->assertSame('notificado', $coincidencia->refresh()->estado->value);
    }

    public function test_agente_can_delete_coincidencia()
    {
        $agente = User::factory()->create();
        $cliente = Cliente::factory()->registradoPor($agente)->create();
        $propiedad = Propiedad::factory()->forEquipo($agente->equipo)->create();
        $coincidencia = Coincidencia::factory()->forEquipo($agente->equipo)->create([
            'cliente_id' => $cliente->id,
            'propiedad_id' => $propiedad->id,
        ]);

        $response = $this->actingAs($agente)->delete(route('coincidencias.destroy', $coincidencia));

        $response->assertRedirect(route('clientes.show', $cliente));
        $this->assertModelMissing($coincidencia);
    }

    public function test_unrelated_agente_cannot_delete_coincidencia()
    {
        $agente = User::factory()->create();
        $otroAgente = User::factory()->forEquipo($agente->equipo)->create();

        $cliente = Cliente::factory()->registradoPor($otroAgente)->create();
        $propiedad = Propiedad::factory()->forEquipo($agente->equipo)->create();
        $coincidencia = Coincidencia::factory()->forEquipo($agente->equipo)->create([
            'cliente_id' => $cliente->id,
            'propiedad_id' => $propiedad->id,
        ]);

        $response = $this->actingAs($agente)->delete(route('coincidencias.destroy', $coincidencia));

        $response->assertForbidden();
        $this->assertModelExists($coincidencia);
    }

    public function test_unrelated_agente_cannot_update_coincidencia()
    {
        $agente = User::factory()->create();
        $otroAgente = User::factory()->forEquipo($agente->equipo)->create();

        $cliente = Cliente::factory()->registradoPor($otroAgente)->create();
        $propiedad = Propiedad::factory()->forEquipo($agente->equipo)->create();
        $coincidencia = Coincidencia::factory()->forEquipo($agente->equipo)->create([
            'cliente_id' => $cliente->id,
            'propiedad_id' => $propiedad->id,
        ]);

        $response = $this->actingAs($agente)->patch(route('coincidencias.estado.update', $coincidencia), [
            'estado' => 'descartado',
        ]);

        $response->assertForbidden();
    }
}
