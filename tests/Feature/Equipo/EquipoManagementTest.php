<?php

namespace Tests\Feature\Equipo;

use App\Enums\Rol;
use App\Models\Equipo;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EquipoManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_rename_equipo()
    {
        $equipo = Equipo::factory()->create(['nombre' => 'Old Name']);
        $admin = User::factory()->admin()->forEquipo($equipo)->create();

        $response = $this->actingAs($admin)->patch(route('equipo.update'), ['nombre' => 'New Name']);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect(route('equipo.edit'));
        $this->assertSame('New Name', $equipo->fresh()->nombre);
    }

    public function test_agente_cannot_rename_equipo()
    {
        $equipo = Equipo::factory()->create(['nombre' => 'Old Name']);
        $agente = User::factory()->forEquipo($equipo)->create();

        $response = $this->actingAs($agente)->patch(route('equipo.update'), ['nombre' => 'New Name']);

        $response->assertForbidden();
        $this->assertSame('Old Name', $equipo->fresh()->nombre);
    }

    public function test_admin_can_change_agente_role()
    {
        $equipo = Equipo::factory()->create();
        $admin = User::factory()->admin()->forEquipo($equipo)->create();
        $agente = User::factory()->forEquipo($equipo)->create();

        $response = $this->actingAs($admin)->patch(route('equipo.agentes.update', $agente), ['rol' => 'admin']);

        $response->assertSessionHasNoErrors();
        $this->assertTrue($agente->fresh()->rol === Rol::Admin);
    }

    public function test_agente_cannot_change_another_agentes_role()
    {
        $equipo = Equipo::factory()->create();
        $agente = User::factory()->forEquipo($equipo)->create();
        $other = User::factory()->forEquipo($equipo)->create();

        $response = $this->actingAs($agente)->patch(route('equipo.agentes.update', $other), ['rol' => 'admin']);

        $response->assertForbidden();
        $this->assertTrue($other->fresh()->rol === Rol::Agente);
    }

    public function test_admin_cannot_demote_the_last_admin()
    {
        $equipo = Equipo::factory()->create();
        $admin = User::factory()->admin()->forEquipo($equipo)->create();

        $response = $this->actingAs($admin)->patch(route('equipo.agentes.update', $admin), ['rol' => 'agente']);

        $response->assertSessionHasErrors('rol');
        $this->assertTrue($admin->fresh()->rol === Rol::Admin);
    }

    public function test_admin_cannot_remove_the_last_admin()
    {
        $equipo = Equipo::factory()->create();
        $admin = User::factory()->admin()->forEquipo($equipo)->create();
        $otherAdmin = User::factory()->admin()->forEquipo($equipo)->create();

        // Removing a second admin is fine; removing the last one is not.
        $response = $this->actingAs($admin)->delete(route('equipo.agentes.destroy', $otherAdmin));
        $response->assertSessionHasNoErrors();
        $this->assertNull($otherAdmin->fresh());

        $response = $this->actingAs($admin->fresh())->delete(route('equipo.agentes.destroy', $admin));
        $response->assertForbidden();
        $this->assertNotNull($admin->fresh());
    }

    public function test_admin_cannot_remove_themself()
    {
        $equipo = Equipo::factory()->create();
        $admin = User::factory()->admin()->forEquipo($equipo)->create();
        User::factory()->admin()->forEquipo($equipo)->create();

        $response = $this->actingAs($admin)->delete(route('equipo.agentes.destroy', $admin));

        $response->assertForbidden();
        $this->assertNotNull($admin->fresh());
    }

    public function test_admin_can_remove_agente_from_team()
    {
        $equipo = Equipo::factory()->create();
        $admin = User::factory()->admin()->forEquipo($equipo)->create();
        $agente = User::factory()->forEquipo($equipo)->create();

        $response = $this->actingAs($admin)->delete(route('equipo.agentes.destroy', $agente));

        $response->assertSessionHasNoErrors();
        $response->assertRedirect(route('equipo.edit'));
        $this->assertNull($agente->fresh());
    }
}
