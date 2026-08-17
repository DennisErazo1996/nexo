<?php

namespace Tests\Feature\Propiedad;

use App\Models\Propiedad;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PropiedadScopingTest extends TestCase
{
    use RefreshDatabase;

    public function test_agente_cannot_view_propiedad_from_another_equipo()
    {
        $agenteA = User::factory()->create();
        $agenteB = User::factory()->create();
        $propiedadB = Propiedad::factory()->forEquipo($agenteB->equipo)->create();

        $response = $this->actingAs($agenteA)->get(route('propiedades.show', $propiedadB));

        $response->assertNotFound();
    }

    public function test_index_only_lists_propiedades_from_own_equipo()
    {
        $agenteA = User::factory()->create();
        $agenteB = User::factory()->create();
        $propiedadA = Propiedad::factory()->forEquipo($agenteA->equipo)->create();
        Propiedad::factory()->forEquipo($agenteB->equipo)->create();

        $response = $this->actingAs($agenteA)->get(route('propiedades.index'));

        $response->assertInertia(fn ($page) => $page
            ->component('propiedades/index')
            ->has('propiedades.data', 1)
            ->where('propiedades.data.0.id', $propiedadA->id)
        );
    }
}
