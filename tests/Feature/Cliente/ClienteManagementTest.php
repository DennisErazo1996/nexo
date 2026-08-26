<?php

namespace Tests\Feature\Cliente;

use App\Enums\EstadoCliente;
use App\Enums\EstadoPropiedad;
use App\Models\Cliente;
use App\Models\Coincidencia;
use App\Models\EtiquetaInteres;
use App\Models\Propiedad;
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

    public function test_show_page_offers_matching_propiedad_after_adding_interes()
    {
        $agente = User::factory()->create();
        $etiqueta = EtiquetaInteres::factory()->create();
        $propiedad = Propiedad::factory()->forEquipo($agente->equipo)->create([
            'zona' => 'Santa Rosa',
            'precio' => 300000,
            'estado' => EstadoPropiedad::Disponible,
        ]);
        $propiedad->etiquetas()->create(['etiqueta_id' => $etiqueta->id]);

        $cliente = Cliente::factory()->registradoPor($agente)->create();

        $this->actingAs($agente)->post(route('clientes.intereses.store', $cliente), [
            'etiqueta_id' => $etiqueta->id,
            'zona' => 'santa rosa',
            'presupuesto_min' => 100000,
            'presupuesto_max' => 500000,
        ]);

        $response = $this->actingAs($agente)->get(route('clientes.show', $cliente));

        $response->assertInertia(fn ($page) => $page
            ->component('clientes/show')
            ->has('coincidencias', 1)
            ->where('coincidencias.0.propiedad_id', $propiedad->id)
        );
    }

    public function test_creating_cliente_generates_matches_for_its_initial_interes()
    {
        $agente = User::factory()->create();
        $etiqueta = EtiquetaInteres::factory()->create();
        $propiedad = Propiedad::factory()->forEquipo($agente->equipo)->create([
            'zona' => 'Laguna Seca',
            'precio' => 300000,
            'estado' => EstadoPropiedad::Disponible,
        ]);
        $propiedad->etiquetas()->create(['etiqueta_id' => $etiqueta->id]);

        $response = $this->actingAs($agente)->post(route('clientes.store'), [
            'nombre' => 'Cliente Nuevo',
            'telefono' => '99998888',
            'etiqueta_id' => $etiqueta->id,
            'zona' => 'laguna seca',
        ]);

        $cliente = Cliente::firstOrFail();
        $response->assertRedirect(route('clientes.show', $cliente));
        $this->assertTrue(
            Coincidencia::where('cliente_id', $cliente->id)->where('propiedad_id', $propiedad->id)->exists()
        );
    }

    public function test_agente_can_delete_interes()
    {
        $agente = User::factory()->create();
        $cliente = Cliente::factory()->registradoPor($agente)->create();
        $etiqueta = EtiquetaInteres::factory()->create();
        $interes = $cliente->intereses()->create([
            'etiqueta_id' => $etiqueta->id,
            'agente_id' => $agente->id,
        ]);

        $response = $this->actingAs($agente)->delete(route('clientes.intereses.destroy', [$cliente, $interes]));

        $response->assertRedirect(route('clientes.show', $cliente));
        $this->assertModelMissing($interes);
    }

    public function test_agente_de_otro_equipo_no_puede_eliminar_interes()
    {
        $agente = User::factory()->create();
        $otroAgente = User::factory()->create();
        $cliente = Cliente::factory()->registradoPor($agente)->create();
        $etiqueta = EtiquetaInteres::factory()->create();
        $interes = $cliente->intereses()->create([
            'etiqueta_id' => $etiqueta->id,
            'agente_id' => $agente->id,
        ]);

        $response = $this->actingAs($otroAgente)->delete(route('clientes.intereses.destroy', [$cliente, $interes]));

        $response->assertNotFound();
        $this->assertModelExists($interes);
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

    public function test_agente_can_add_nota_de_seguimiento_with_associated_propiedad()
    {
        $agente = User::factory()->create();
        $cliente = Cliente::factory()->registradoPor($agente)->create();
        $propiedad = Propiedad::factory()->forEquipo($agente->equipo)->create();

        $response = $this->actingAs($agente)->post(route('clientes.notas.store', $cliente), [
            'texto' => 'Mostré la propiedad, le gustó mucho.',
            'propiedad_id' => $propiedad->id,
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertSame(1, $cliente->notas()->count());
        $this->assertSame($propiedad->id, $cliente->notas()->first()->propiedad_id);
        $this->assertSame($propiedad->id, $cliente->notas()->first()->propiedad->id);
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

    public function test_agente_can_delete_cliente()
    {
        $agente = User::factory()->create();
        $cliente = Cliente::factory()->registradoPor($agente)->create();
        $etiqueta = EtiquetaInteres::factory()->create();
        $interes = $cliente->intereses()->create([
            'etiqueta_id' => $etiqueta->id,
            'agente_id' => $agente->id,
        ]);
        $nota = $cliente->notas()->create([
            'texto' => 'Nota de prueba',
            'agente_id' => $agente->id,
        ]);

        $response = $this->actingAs($agente)->delete(route('clientes.destroy', $cliente));

        $response->assertRedirect(route('clientes.index'));
        $this->assertModelMissing($cliente);
        $this->assertModelMissing($interes);
        $this->assertModelMissing($nota);
    }

    public function test_agente_de_otro_equipo_no_puede_eliminar_cliente()
    {
        $agente = User::factory()->create();
        $otroAgente = User::factory()->create();
        $cliente = Cliente::factory()->registradoPor($agente)->create();

        $response = $this->actingAs($otroAgente)->delete(route('clientes.destroy', $cliente));

        $response->assertNotFound();
        $this->assertModelExists($cliente);
    }
}
