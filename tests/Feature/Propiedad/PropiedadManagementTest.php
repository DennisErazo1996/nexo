<?php

namespace Tests\Feature\Propiedad;

use App\Enums\EstadoPropiedad;
use App\Models\Propiedad;
use App\Models\PropiedadFoto;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PropiedadManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_agente_can_change_propiedad_estado()
    {
        $agente = User::factory()->create();
        $propiedad = Propiedad::factory()->forEquipo($agente->equipo)->create();

        $response = $this->actingAs($agente)->patch(route('propiedades.estado.update', $propiedad), [
            'estado' => 'reservada',
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertSame(EstadoPropiedad::Reservada, $propiedad->fresh()->estado);
    }

    public function test_agente_can_add_additional_fotos()
    {
        Storage::fake('public');

        $agente = User::factory()->create();
        $propiedad = Propiedad::factory()->forEquipo($agente->equipo)->create();
        $foto = UploadedFile::fake()->image('foto.jpg', 800, 600);

        $response = $this->actingAs($agente)->post(route('propiedades.fotos.store', $propiedad), [
            'fotos' => [$foto],
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertSame(1, $propiedad->fotos()->count());
    }

    public function test_agente_can_delete_a_foto_and_its_files()
    {
        Storage::fake('public');

        $agente = User::factory()->create();
        $propiedad = Propiedad::factory()->forEquipo($agente->equipo)->create();

        Storage::disk('public')->put('propiedades/1/original/foto.jpg', 'contenido');
        Storage::disk('public')->put('propiedades/1/marca-agua/foto.jpg', 'contenido');

        $foto = PropiedadFoto::factory()->create([
            'propiedad_id' => $propiedad->id,
            'url' => Storage::disk('public')->url('propiedades/1/original/foto.jpg'),
            'url_con_marca_agua' => Storage::disk('public')->url('propiedades/1/marca-agua/foto.jpg'),
        ]);

        $response = $this->actingAs($agente)->delete(route('propiedades.fotos.destroy', [$propiedad, $foto]));

        $response->assertSessionHasNoErrors();
        $this->assertNull($foto->fresh());
        Storage::disk('public')->assertMissing('propiedades/1/original/foto.jpg');
        Storage::disk('public')->assertMissing('propiedades/1/marca-agua/foto.jpg');
    }

    public function test_agente_can_delete_a_propiedad_and_its_foto_files()
    {
        Storage::fake('public');

        $agente = User::factory()->create();
        $propiedad = Propiedad::factory()->forEquipo($agente->equipo)->create();

        Storage::disk('public')->put('propiedades/1/original/foto.jpg', 'contenido');
        Storage::disk('public')->put('propiedades/1/marca-agua/foto.jpg', 'contenido');

        PropiedadFoto::factory()->create([
            'propiedad_id' => $propiedad->id,
            'url' => Storage::disk('public')->url('propiedades/1/original/foto.jpg'),
            'url_con_marca_agua' => Storage::disk('public')->url('propiedades/1/marca-agua/foto.jpg'),
        ]);

        $response = $this->actingAs($agente)->delete(route('propiedades.destroy', $propiedad));

        $response->assertRedirect(route('propiedades.index'));
        $this->assertModelMissing($propiedad);
        Storage::disk('public')->assertMissing('propiedades/1/original/foto.jpg');
        Storage::disk('public')->assertMissing('propiedades/1/marca-agua/foto.jpg');
    }

    public function test_agente_de_otro_equipo_no_puede_eliminar_propiedad()
    {
        $agente = User::factory()->create();
        $otroAgente = User::factory()->create();
        $propiedad = Propiedad::factory()->forEquipo($otroAgente->equipo)->create();

        $response = $this->actingAs($agente)->delete(route('propiedades.destroy', $propiedad));

        $response->assertNotFound();
        $this->assertModelExists($propiedad);
    }

    public function test_index_filters_by_estado_and_tipo()
    {
        $agente = User::factory()->create();
        Propiedad::factory()->forEquipo($agente->equipo)->create(['estado' => EstadoPropiedad::Disponible, 'tipo' => 'casa']);
        Propiedad::factory()->forEquipo($agente->equipo)->create(['estado' => EstadoPropiedad::Vendida, 'tipo' => 'terreno']);

        $response = $this->actingAs($agente)->get(route('propiedades.index', ['estado' => 'vendida']));

        $response->assertInertia(fn ($page) => $page
            ->component('propiedades/index')
            ->has('propiedades.data', 1)
            ->where('propiedades.data.0.estado', 'vendida')
        );
    }

    public function test_index_searches_by_zona_case_insensitively()
    {
        $agente = User::factory()->create();
        $propiedadA = Propiedad::factory()->forEquipo($agente->equipo)->create(['zona' => 'Col. Palmira, Tegucigalpa']);
        $propiedadB = Propiedad::factory()->forEquipo($agente->equipo)->create(['zona' => 'Santa Rosa de Copán']);

        $response = $this->actingAs($agente)->get(route('propiedades.index', ['search' => 'palmira']));

        $response->assertInertia(fn ($page) => $page
            ->component('propiedades/index')
            ->has('propiedades.data', 1)
            ->where('propiedades.data.0.id', $propiedadA->id)
        );

        $responseCopan = $this->actingAs($agente)->get(route('propiedades.index', ['search' => 'santa rosa']));

        $responseCopan->assertInertia(fn ($page) => $page
            ->component('propiedades/index')
            ->has('propiedades.data', 1)
            ->where('propiedades.data.0.id', $propiedadB->id)
        );
    }

    public function test_index_searches_by_acceso_and_etiquetas()
    {
        $agente = User::factory()->create();
        $propiedad = Propiedad::factory()->forEquipo($agente->equipo)->create([
            'zona' => 'El Hatillo',
            'acceso' => 'Calle de tierra 500m',
        ]);
        Propiedad::factory()->forEquipo($agente->equipo)->create([
            'zona' => 'Valle de Ángeles',
            'acceso' => 'Pavimentado',
        ]);

        $response = $this->actingAs($agente)->get(route('propiedades.index', ['search' => 'tierra']));

        $response->assertInertia(fn ($page) => $page
            ->component('propiedades/index')
            ->has('propiedades.data', 1)
            ->where('propiedades.data.0.id', $propiedad->id)
        );
    }
}
