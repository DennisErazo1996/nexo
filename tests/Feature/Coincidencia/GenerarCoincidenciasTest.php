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
            'zona' => 'Tegucigalpa',
            'presupuesto_min' => 100000,
            'presupuesto_max' => 2000000,
        ]);

        $response = $this->actingAs($agente)->post(route('propiedades.store'), [
            'tipo' => 'casa',
            'zona' => 'tegucigalpa',
            'tamano' => 250,
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
            'zona' => 'Choluteca',
            'precio' => 800000,
            'estado' => EstadoPropiedad::Retirada,
        ]);
        $propiedad->etiquetas()->create(['etiqueta_id' => $etiqueta->id]);

        $cliente = Cliente::factory()->forEquipo($agente->equipo)->create();
        ClienteInteres::factory()->create([
            'cliente_id' => $cliente->id,
            'etiqueta_id' => $etiqueta->id,
            'zona' => 'Choluteca',
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
            'zona' => 'Santa Rosa',
            'precio' => 300000,
            'estado' => EstadoPropiedad::Disponible,
        ]);
        $propiedad->etiquetas()->create(['etiqueta_id' => $etiqueta->id]);

        $cliente = Cliente::factory()->forEquipo($agente->equipo)->create();

        $response = $this->actingAs($agente)->post(route('clientes.intereses.store', $cliente), [
            'etiqueta_id' => $etiqueta->id,
            'zona' => 'santa rosa',
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
            'zona' => 'Tegucigalpa',
            'presupuesto_min' => 100000,
            'presupuesto_max' => 200000,
        ]);

        $this->actingAs($agente)->post(route('propiedades.store'), [
            'tipo' => 'casa',
            'zona' => 'San Pedro Sula',
            'tamano' => 250,
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
            'zona' => 'Tegucigalpa',
            'presupuesto_min' => 100000,
            'presupuesto_max' => 2000000,
        ]);

        $propiedad = Propiedad::factory()->forEquipo($agente->equipo)->create([
            'zona' => 'Tegucigalpa',
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
}
