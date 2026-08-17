<?php

namespace Tests\Feature\Cliente;

use App\Enums\EstadoCliente;
use App\Models\Cliente;
use App\Models\EtiquetaInteres;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClienteManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_agente_can_change_cliente_estado()
    {
        $agente = User::factory()->create();
        $cliente = Cliente::factory()->registradoPor($agente)->create();

        $response = $this->actingAs($agente)->patch(route('clientes.estado.update', $cliente), [
            'estado' => 'contactado',
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertSame(EstadoCliente::Contactado, $cliente->fresh()->estado);
    }

    public function test_agente_can_add_additional_interes()
    {
        $agente = User::factory()->create();
        $cliente = Cliente::factory()->registradoPor($agente)->create();
        $etiqueta = EtiquetaInteres::factory()->create();

        $response = $this->actingAs($agente)->post(route('clientes.intereses.store', $cliente), [
            'etiqueta_id' => $etiqueta->id,
            'zona' => 'Comayagua',
            'presupuesto_min' => 200000,
            'presupuesto_max' => 400000,
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertSame(1, $cliente->intereses()->count());
        $this->assertSame($agente->id, $cliente->intereses()->first()->agente_id);
    }

    public function test_agente_can_add_nota_de_seguimiento()
    {
        $agente = User::factory()->create();
        $cliente = Cliente::factory()->registradoPor($agente)->create();

        $response = $this->actingAs($agente)->post(route('clientes.notas.store', $cliente), [
            'texto' => 'Llamé al cliente, sigue interesado.',
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertSame(1, $cliente->notas()->count());
        $this->assertSame($agente->id, $cliente->notas()->first()->agente_id);
    }

    public function test_index_filters_by_estado()
    {
        $agente = User::factory()->create();
        Cliente::factory()->registradoPor($agente)->create(['estado' => EstadoCliente::Nuevo]);
        Cliente::factory()->registradoPor($agente)->create(['estado' => EstadoCliente::Cerrado]);

        $response = $this->actingAs($agente)->get(route('clientes.index', ['estado' => 'cerrado']));

        $response->assertInertia(fn ($page) => $page
            ->component('clientes/index')
            ->has('clientes.data', 1)
            ->where('clientes.data.0.estado', 'cerrado')
        );
    }

    public function test_index_filters_sin_seguimiento_reciente()
    {
        $agente = User::factory()->create();

        $sinNotas = Cliente::factory()->registradoPor($agente)->create();

        $notaVieja = Cliente::factory()->registradoPor($agente)->create();
        $nota = $notaVieja->notas()->create(['texto' => 'vieja', 'agente_id' => $agente->id]);
        $nota->forceFill(['created_at' => now()->subDays(30)])->saveQuietly();

        $notaReciente = Cliente::factory()->registradoPor($agente)->create();
        $notaReciente->notas()->create(['texto' => 'reciente', 'agente_id' => $agente->id]);

        $response = $this->actingAs($agente)->get(route('clientes.index', ['sin_seguimiento' => '1']));

        $response->assertInertia(fn ($page) => $page
            ->component('clientes/index')
            ->has('clientes.data', 2)
        );

        $ids = collect($response->viewData('page')['props']['clientes']['data'])->pluck('id');
        $this->assertTrue($ids->contains($sinNotas->id));
        $this->assertTrue($ids->contains($notaVieja->id));
        $this->assertFalse($ids->contains($notaReciente->id));
    }
}
