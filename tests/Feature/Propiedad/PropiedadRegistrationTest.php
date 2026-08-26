<?php

namespace Tests\Feature\Propiedad;

use App\Models\EtiquetaInteres;
use App\Models\Propiedad;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PropiedadRegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_agente_can_create_propiedad_with_etiquetas_and_fotos()
    {
        Storage::fake('public');

        $agente = User::factory()->create();
        $coLister = User::factory()->forEquipo($agente->equipo)->create();
        $etiqueta = EtiquetaInteres::factory()->create();
        $foto = UploadedFile::fake()->image('foto.jpg', 800, 600);

        $response = $this->actingAs($agente)->post(route('propiedades.store'), [
            'tipo' => 'casa',
            'zona' => 'Tegucigalpa',
            'area_terreno' => 250,
            'area_construccion' => 120,
            'unidad_medida' => 'm2',
            'precio' => 1500000,
            'moneda' => 'HNL',
            'forma_pago' => 'contado',
            'condicion_legal' => 'escritura_publica',
            'acceso' => 'Pavimento a 100m',
            'descripcion' => 'Casa amplia',
            'etiquetas' => [$etiqueta->id],
            'agentes' => [$coLister->id],
            'fotos' => [$foto],
        ]);

        $response->assertSessionHasNoErrors();

        $propiedad = Propiedad::firstOrFail();
        $this->assertSame('Tegucigalpa', $propiedad->zona);
        $this->assertEquals(250, (float) $propiedad->area_terreno);
        $this->assertEquals(120, (float) $propiedad->area_construccion);
        $this->assertCount(1, $propiedad->etiquetas);
        $this->assertSame($etiqueta->id, $propiedad->etiquetas->first()->etiqueta_id);

        $agenteIds = $propiedad->agentes->pluck('agente_id');
        $this->assertTrue($agenteIds->contains($agente->id));
        $this->assertTrue($agenteIds->contains($coLister->id));

        $this->assertCount(1, $propiedad->fotos);
        $fotoCreada = $propiedad->fotos->first();
        Storage::disk('public')->assertExists(str_replace(Storage::disk('public')->url(''), '', $fotoCreada->url));
        Storage::disk('public')->assertExists(str_replace(Storage::disk('public')->url(''), '', $fotoCreada->url_con_marca_agua));

        $response->assertRedirect(route('propiedades.show', $propiedad));
    }

    public function test_create_page_excludes_the_logged_in_agente_from_co_agentes_options()
    {
        $agente = User::factory()->create();
        $otroAgente = User::factory()->forEquipo($agente->equipo)->create();

        $response = $this->actingAs($agente)->get(route('propiedades.create'));

        $response->assertInertia(fn ($page) => $page
            ->component('propiedades/create')
            ->has('agentes', 1)
            ->where('agentes.0.id', $otroAgente->id)
        );
    }

    public function test_creator_becomes_co_lister_even_without_selecting_agentes()
    {
        $agente = User::factory()->create();

        $this->actingAs($agente)->post(route('propiedades.store'), [
            'tipo' => 'terreno',
            'zona' => 'Choluteca',
            'area_terreno' => 10,
            'unidad_medida' => 'manzana',
            'precio' => 500000,
            'moneda' => 'HNL',
            'forma_pago' => 'negociable',
        ]);

        $propiedad = Propiedad::firstOrFail();
        $this->assertCount(1, $propiedad->agentes);
        $this->assertSame($agente->id, $propiedad->agentes->first()->agente_id);
        $this->assertNull($propiedad->area_construccion);
    }
}
