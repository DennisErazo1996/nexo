<?php

namespace Tests\Feature\Cliente;

use App\Models\Cliente;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClienteScopingTest extends TestCase
{
    use RefreshDatabase;

    public function test_agente_cannot_view_cliente_from_another_equipo()
    {
        $agenteA = User::factory()->create();
        $agenteB = User::factory()->create();
        $clienteB = Cliente::factory()->registradoPor($agenteB)->create();

        $response = $this->actingAs($agenteA)->get(route('clientes.show', $clienteB));

        $response->assertNotFound();
    }

    public function test_agente_cannot_change_estado_of_cliente_from_another_equipo()
    {
        $agenteA = User::factory()->create();
        $agenteB = User::factory()->create();
        $clienteB = Cliente::factory()->registradoPor($agenteB)->create();

        $response = $this->actingAs($agenteA)->patch(route('clientes.estado.update', $clienteB), [
            'estado' => 'cerrado',
        ]);

        $response->assertNotFound();
    }

    public function test_index_only_lists_clientes_from_own_equipo()
    {
        $agenteA = User::factory()->create();
        $agenteB = User::factory()->create();
        $clienteA = Cliente::factory()->registradoPor($agenteA)->create();
        Cliente::factory()->registradoPor($agenteB)->create();

        $response = $this->actingAs($agenteA)->get(route('clientes.index'));

        $response->assertInertia(fn ($page) => $page
            ->component('clientes/index')
            ->has('clientes.data', 1)
            ->where('clientes.data.0.id', $clienteA->id)
        );
    }
}
