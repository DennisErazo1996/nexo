<?php

namespace Tests\Feature\Cliente;

use App\Models\Cliente;
use App\Models\Equipo;
use App\Models\EtiquetaInteres;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClienteRegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_buscar_advances_wizard_when_telefono_is_new()
    {
        $agente = User::factory()->create();

        $response = $this->actingAs($agente)->post(route('clientes.buscar'), ['telefono' => '99887766']);

        $response->assertSessionHasNoErrors();
        $response->assertInertia(fn ($page) => $page
            ->component('clientes/create')
            ->where('step', 'datos')
            ->where('telefono', '+50499887766')
        );
    }

    public function test_buscar_redirects_to_existing_cliente_when_telefono_already_registered()
    {
        $agente = User::factory()->create();
        $registrador = User::factory()->forEquipo(Equipo::find($agente->equipo_id))->create(['name' => 'Ana Agente']);
        $cliente = Cliente::factory()->registradoPor($registrador)->create(['telefono' => '+50499887766']);

        $response = $this->actingAs($agente)->post(route('clientes.buscar'), ['telefono' => '9988-7766']);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect(route('clientes.show', $cliente));
    }

    public function test_telefono_is_normalized_with_and_without_country_code()
    {
        $this->assertSame('+50499887766', Cliente::normalizarTelefono('9988-7766'));
        $this->assertSame('+50499887766', Cliente::normalizarTelefono('+504 9988 7766'));
    }

    public function test_store_creates_cliente_with_first_interes()
    {
        $agente = User::factory()->create();
        $etiqueta = EtiquetaInteres::factory()->create();

        $response = $this->actingAs($agente)->post(route('clientes.store'), [
            'telefono' => '99887766',
            'nombre' => 'Juan Pérez',
            'etiqueta_id' => $etiqueta->id,
            'zona' => 'Tegucigalpa',
            'presupuesto_min' => 500000,
            'presupuesto_max' => 1000000,
        ]);

        $response->assertSessionHasNoErrors();

        $cliente = Cliente::where('telefono', '+50499887766')->firstOrFail();
        $this->assertSame('Juan Pérez', $cliente->nombre);
        $this->assertSame($agente->id, $cliente->agente_registro_id);
        $this->assertCount(1, $cliente->intereses);
        $this->assertSame($etiqueta->id, $cliente->intereses->first()->etiqueta_id);

        $response->assertRedirect(route('clientes.show', $cliente));
    }

    public function test_cannot_duplicate_telefono_within_same_equipo()
    {
        $agente = User::factory()->create();
        $etiqueta = EtiquetaInteres::factory()->create();
        Cliente::factory()->registradoPor($agente)->create(['telefono' => '+50499887766']);

        $response = $this->actingAs($agente)->post(route('clientes.store'), [
            'telefono' => '99887766',
            'nombre' => 'Otro Nombre',
            'etiqueta_id' => $etiqueta->id,
        ]);

        $response->assertSessionHasErrors();
        $this->assertSame(1, Cliente::where('telefono', '+50499887766')->count());
    }

    public function test_same_telefono_allowed_in_different_equipos()
    {
        $agenteA = User::factory()->create();
        $agenteB = User::factory()->create();
        $etiqueta = EtiquetaInteres::factory()->create();

        Cliente::factory()->registradoPor($agenteA)->create(['telefono' => '+50499887766']);

        $response = $this->actingAs($agenteB)->post(route('clientes.store'), [
            'telefono' => '99887766',
            'nombre' => 'Cliente Equipo B',
            'etiqueta_id' => $etiqueta->id,
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertSame(2, Cliente::withoutGlobalScopes()->where('telefono', '+50499887766')->count());
    }
}
