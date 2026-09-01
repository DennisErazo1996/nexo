<?php

namespace Tests\Feature;

use App\Enums\EstadoCliente;
use App\Enums\EstadoCoincidencia;
use App\Enums\EstadoPropiedad;
use App\Enums\Moneda;
use App\Enums\TipoPropiedad;
use App\Models\Cliente;
use App\Models\Coincidencia;
use App\Models\Equipo;
use App\Models\NotaSeguimiento;
use App\Models\Propiedad;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_the_login_page(): void
    {
        $response = $this->get(route('dashboard'));
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_visit_the_dashboard_with_all_props(): void
    {
        $equipo = Equipo::factory()->create();
        $user = User::factory()->create(['equipo_id' => $equipo->id]);
        $this->actingAs($user);

        $propiedad = Propiedad::factory()->create([
            'equipo_id' => $equipo->id,
            'estado' => EstadoPropiedad::Disponible,
            'tipo' => TipoPropiedad::Casa,
            'precio' => '3500000.00',
            'moneda' => Moneda::Lempiras,
        ]);

        $cliente = Cliente::factory()->create([
            'equipo_id' => $equipo->id,
            'estado' => EstadoCliente::Nuevo,
            'agente_registro_id' => $user->id,
        ]);

        NotaSeguimiento::factory()->create([
            'cliente_id' => $cliente->id,
            'agente_id' => $user->id,
            'texto' => 'Primera llamada con el cliente.',
        ]);

        Coincidencia::factory()->create([
            'equipo_id' => $equipo->id,
            'cliente_id' => $cliente->id,
            'propiedad_id' => $propiedad->id,
            'estado' => EstadoCoincidencia::Pendiente,
        ]);

        $response = $this->get(route('dashboard'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->has('stats')
            ->has('pipeline_clientes')
            ->has('propiedades_por_tipo')
            ->has('coincidencias_recientes', 1)
            ->has('propiedades_recientes', 1)
            ->has('actividad_reciente', 1)
            ->has('agentes_equipo', 1)
            ->where('stats.propiedades.disponibles', 1)
            ->where('stats.clientes.totales', 1)
            ->where('stats.coincidencias.pendientes', 1)
            ->where('stats.clientes.en_seguimiento', 1)
            ->where('stats.valor_cartera.HNL', 3500000)
        );
    }

    public function test_en_seguimiento_excludes_clientes_whose_coincidencias_are_all_cerrado_or_descartado(): void
    {
        $equipo = Equipo::factory()->create();
        $user = User::factory()->create(['equipo_id' => $equipo->id]);
        $this->actingAs($user);

        $propiedad = Propiedad::factory()->create(['equipo_id' => $equipo->id]);

        $clienteActivo = Cliente::factory()->create(['equipo_id' => $equipo->id]);
        Coincidencia::factory()->create([
            'equipo_id' => $equipo->id,
            'cliente_id' => $clienteActivo->id,
            'propiedad_id' => $propiedad->id,
            'estado' => EstadoCoincidencia::Notificado,
        ]);

        $clienteCerrado = Cliente::factory()->create(['equipo_id' => $equipo->id]);
        Coincidencia::factory()->create([
            'equipo_id' => $equipo->id,
            'cliente_id' => $clienteCerrado->id,
            'propiedad_id' => $propiedad->id,
            'estado' => EstadoCoincidencia::Cerrado,
        ]);

        $clienteDescartado = Cliente::factory()->create(['equipo_id' => $equipo->id]);
        Coincidencia::factory()->create([
            'equipo_id' => $equipo->id,
            'cliente_id' => $clienteDescartado->id,
            'propiedad_id' => $propiedad->id,
            'estado' => EstadoCoincidencia::Descartado,
        ]);

        // Cliente without any coincidencia is not "en seguimiento".
        Cliente::factory()->create(['equipo_id' => $equipo->id]);

        $response = $this->get(route('dashboard'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->where('stats.clientes.en_seguimiento', 1)
        );
    }

    public function test_dashboard_scopes_data_to_users_equipo(): void
    {
        $equipoA = Equipo::factory()->create();
        $userA = User::factory()->create(['equipo_id' => $equipoA->id]);

        $equipoB = Equipo::factory()->create();
        $userB = User::factory()->create(['equipo_id' => $equipoB->id]);

        Propiedad::factory()->create([
            'equipo_id' => $equipoA->id,
            'estado' => EstadoPropiedad::Disponible,
        ]);

        Propiedad::factory()->create([
            'equipo_id' => $equipoB->id,
            'estado' => EstadoPropiedad::Disponible,
        ]);

        $this->actingAs($userA);

        $response = $this->get(route('dashboard'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->where('stats.propiedades.disponibles', 1)
            ->where('stats.propiedades.totales', 1)
        );
    }
}
