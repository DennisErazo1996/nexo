<?php

namespace Tests\Feature\Equipo;

use App\Models\Equipo;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EquipoScopingTest extends TestCase
{
    use RefreshDatabase;

    public function test_agentes_from_one_equipo_do_not_leak_into_another()
    {
        $equipoA = Equipo::factory()->create();
        $equipoB = Equipo::factory()->create();

        $agenteA = User::factory()->forEquipo($equipoA)->create();
        $agenteB = User::factory()->forEquipo($equipoB)->create();

        $this->assertTrue($equipoA->agentes->contains($agenteA));
        $this->assertFalse($equipoA->agentes->contains($agenteB));

        $this->assertTrue($equipoB->agentes->contains($agenteB));
        $this->assertFalse($equipoB->agentes->contains($agenteA));
    }

    public function test_admin_only_sees_own_equipo_on_edit_page()
    {
        $equipoA = Equipo::factory()->create();
        $equipoB = Equipo::factory()->create();

        $adminA = User::factory()->admin()->forEquipo($equipoA)->create();
        $agenteA = User::factory()->forEquipo($equipoA)->create();
        User::factory()->forEquipo($equipoB)->create();

        $response = $this->actingAs($adminA)->get(route('equipo.edit'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('equipo/edit')
            ->where('equipo.id', $equipoA->id)
            ->has('agentes', 2)
            ->where('agentes.0.id', fn ($id) => in_array($id, [$adminA->id, $agenteA->id], true))
        );
    }
}
