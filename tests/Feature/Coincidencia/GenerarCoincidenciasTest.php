<?php

namespace Tests\Feature\Coincidencia;

use App\Enums\EstadoPropiedad;
use App\Models\Cliente;
use App\Models\ClienteInteres;
use App\Models\Coincidencia;
use App\Models\EtiquetaInteres;
use App\Models\Propiedad;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GenerarCoincidenciasTest extends TestCase
{
    use RefreshDatabase;

    public function test_creating_propiedad_generates_match_with_compatible_interes()
    {
        $agente = User::factory()->create();
        $etiqueta = EtiquetaInteres::factory()->create();
        $cliente = Cliente::factory()->forEquipo($agente->equipo)->create();
        ClienteInteres::factory()->create([
            'cliente_id' => $cliente->id,
            'etiqueta_id' => $etiqueta->id,
            'zona' => 'juticalpa',
            'presupuesto_min' => 100000,
            'presupuesto_max' => 2000000,
        ]);

        $response = $this->actingAs($agente)->post(route('propiedades.store'), [
            'tipo' => 'casa',
            'zona' => 'juticalpa',
            'area_terreno' => 250,
            'unidad_medida' => 'm2',
            'precio' => 1500000,
            'moneda' => 'HNL',
            'forma_pago' => 'contado',
            'etiquetas' => [$etiqueta->id],
        ]);

        $response->assertSessionHasNoErrors();

        $propiedad = Propiedad::firstOrFail();

        $this->assertDatabaseHas('matches', [
            'cliente_id' => $cliente->id,
            'propiedad_id' => $propiedad->id,
            'estado' => 'pendiente',
        ]);
    }

    public function test_reactivating_propiedad_generates_match_against_existing_interes()
    {
        $agente = User::factory()->create();
        $etiqueta = EtiquetaInteres::factory()->create();
        $propiedad = Propiedad::factory()->forEquipo($agente->equipo)->create([
            'zona' => 'catacamas',
            'precio' => 800000,
            'estado' => EstadoPropiedad::Retirada,
        ]);
        $propiedad->etiquetas()->create(['etiqueta_id' => $etiqueta->id]);

        $cliente = Cliente::factory()->forEquipo($agente->equipo)->create();
        ClienteInteres::factory()->create([
            'cliente_id' => $cliente->id,
            'etiqueta_id' => $etiqueta->id,
            'zona' => 'catacamas',
            'presupuesto_min' => 500000,
            'presupuesto_max' => 1000000,
        ]);

        $this->assertDatabaseMissing('matches', [
            'cliente_id' => $cliente->id,
            'propiedad_id' => $propiedad->id,
        ]);

        $this->actingAs($agente)->patch(route('propiedades.estado.update', $propiedad), [
            'estado' => 'disponible',
        ]);

        $this->assertDatabaseHas('matches', [
            'cliente_id' => $cliente->id,
            'propiedad_id' => $propiedad->id,
        ]);
    }

    public function test_adding_interes_generates_match_against_existing_propiedad()
    {
        $agente = User::factory()->create();
        $etiqueta = EtiquetaInteres::factory()->create();
        $propiedad = Propiedad::factory()->forEquipo($agente->equipo)->create([
            'zona' => 'campamento',
            'precio' => 300000,
            'estado' => EstadoPropiedad::Disponible,
        ]);
        $propiedad->etiquetas()->create(['etiqueta_id' => $etiqueta->id]);

        $cliente = Cliente::factory()->forEquipo($agente->equipo)->create();

        $response = $this->actingAs($agente)->post(route('clientes.intereses.store', $cliente), [
            'etiqueta_id' => $etiqueta->id,
            'zona' => 'campamento',
            'presupuesto_min' => 100000,
            'presupuesto_max' => 500000,
        ]);

        $response->assertSessionHasNoErrors();

        $this->assertDatabaseHas('matches', [
            'cliente_id' => $cliente->id,
            'propiedad_id' => $propiedad->id,
        ]);
    }

    public function test_no_match_when_zona_or_presupuesto_do_not_align()
    {
        $agente = User::factory()->create();
        $etiqueta = EtiquetaInteres::factory()->create();
        $cliente = Cliente::factory()->forEquipo($agente->equipo)->create();

        ClienteInteres::factory()->create([
            'cliente_id' => $cliente->id,
            'etiqueta_id' => $etiqueta->id,
            'zona' => 'juticalpa',
            'presupuesto_min' => 100000,
            'presupuesto_max' => 200000,
        ]);

        $this->actingAs($agente)->post(route('propiedades.store'), [
            'tipo' => 'casa',
            'zona' => 'catacamas',
            'area_terreno' => 250,
            'unidad_medida' => 'm2',
            'precio' => 1500000,
            'moneda' => 'HNL',
            'forma_pago' => 'contado',
            'etiquetas' => [$etiqueta->id],
        ]);

        $this->assertDatabaseCount('matches', 0);
    }

    public function test_does_not_duplicate_match_when_triggered_twice()
    {
        $agente = User::factory()->create();
        $etiqueta = EtiquetaInteres::factory()->create();
        $cliente = Cliente::factory()->forEquipo($agente->equipo)->create();
        ClienteInteres::factory()->create([
            'cliente_id' => $cliente->id,
            'etiqueta_id' => $etiqueta->id,
            'zona' => 'juticalpa',
            'presupuesto_min' => 100000,
            'presupuesto_max' => 2000000,
        ]);

        $propiedad = Propiedad::factory()->forEquipo($agente->equipo)->create([
            'zona' => 'juticalpa',
            'precio' => 1500000,
            'estado' => EstadoPropiedad::Disponible,
        ]);
        $propiedad->etiquetas()->create(['etiqueta_id' => $etiqueta->id]);

        $this->actingAs($agente)->patch(route('propiedades.estado.update', $propiedad), ['estado' => 'reservada']);
        $this->actingAs($agente)->patch(route('propiedades.estado.update', $propiedad), ['estado' => 'disponible']);
        $this->actingAs($agente)->patch(route('propiedades.estado.update', $propiedad), ['estado' => 'reservada']);
        $this->actingAs($agente)->patch(route('propiedades.estado.update', $propiedad), ['estado' => 'disponible']);

        $this->assertSame(1, Coincidencia::count());
    }

    public function test_client_with_existing_match_receives_new_match_when_second_compatible_propiedad_is_created()
    {
        $agente = User::factory()->create();
        $etiqueta = EtiquetaInteres::factory()->create(['nombre' => 'terreno']);
        $cliente = Cliente::factory()->forEquipo($agente->equipo)->create();
        ClienteInteres::factory()->create([
            'cliente_id' => $cliente->id,
            'etiqueta_id' => $etiqueta->id,
            'zona' => 'concordia',
            'presupuesto_min' => 100000,
            'presupuesto_max' => 2000000,
        ]);

        // First propiedad created
        $this->actingAs($agente)->post(route('propiedades.store'), [
            'tipo' => 'terreno',
            'zona' => 'concordia',
            'area_terreno' => 10,
            'unidad_medida' => 'manzana',
            'precio' => 500000,
            'moneda' => 'HNL',
            'forma_pago' => 'contado',
            'etiquetas' => [$etiqueta->id],
        ]);

        $this->assertDatabaseCount('matches', 1);

        // Second propiedad created with same interest
        $this->actingAs($agente)->post(route('propiedades.store'), [
            'tipo' => 'terreno',
            'zona' => 'concordia',
            'area_terreno' => 20,
            'unidad_medida' => 'manzana',
            'precio' => 800000,
            'moneda' => 'HNL',
            'forma_pago' => 'contado',
            'etiquetas' => [$etiqueta->id],
        ]);

        $this->assertDatabaseCount('matches', 2);
        $this->assertSame(2, Coincidencia::where('cliente_id', $cliente->id)->count());
    }

    public function test_creating_carro_generates_match_with_cliente_interested_in_carro()
    {
        $agente = User::factory()->create();
        $etiquetaCarro = EtiquetaInteres::factory()->create(['nombre' => 'carro']);

        $cliente = Cliente::factory()->forEquipo($agente->equipo)->create();
        ClienteInteres::factory()->create([
            'cliente_id' => $cliente->id,
            'etiqueta_id' => $etiquetaCarro->id,
            'zona' => 'catacamas',
            'presupuesto_min' => 100000,
            'presupuesto_max' => 500000,
        ]);

        $response = $this->actingAs($agente)->post(route('propiedades.store'), [
            'tipo' => 'carro',
            'zona' => 'catacamas',
            'precio' => 350000,
            'moneda' => 'HNL',
            'forma_pago' => 'contado',
        ]);

        $response->assertSessionHasNoErrors();

        $propiedad = Propiedad::firstOrFail();

        $this->assertDatabaseHas('matches', [
            'cliente_id' => $cliente->id,
            'propiedad_id' => $propiedad->id,
            'estado' => 'pendiente',
        ]);
    }

    public function test_creating_propiedad_matches_interest_by_tipo_without_explicit_etiquetas()
    {
        $agente = User::factory()->create();
        $etiquetaTerreno = EtiquetaInteres::factory()->create(['nombre' => 'terreno']);
        $etiquetaAgricola = EtiquetaInteres::factory()->create(['nombre' => 'agricola']);

        $cliente = Cliente::factory()->forEquipo($agente->equipo)->create();
        ClienteInteres::factory()->create([
            'cliente_id' => $cliente->id,
            'etiqueta_id' => $etiquetaTerreno->id,
            'zona' => 'patuca',
            'presupuesto_min' => 100000,
            'presupuesto_max' => 500000,
        ]);

        // Propiedad has tipo 'terreno' and only 'agricola' in submitted etiquetas
        $this->actingAs($agente)->post(route('propiedades.store'), [
            'tipo' => 'terreno',
            'zona' => 'patuca',
            'area_terreno' => 5,
            'unidad_medida' => 'manzana',
            'precio' => 200000,
            'moneda' => 'HNL',
            'forma_pago' => 'contado',
            'etiquetas' => [$etiquetaAgricola->id],
        ]);

        $propiedad = Propiedad::firstOrFail();

        $this->assertDatabaseHas('matches', [
            'cliente_id' => $cliente->id,
            'propiedad_id' => $propiedad->id,
        ]);
    }
}
