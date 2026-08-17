<?php

namespace Database\Factories;

use App\Models\EtiquetaInteres;
use App\Models\Propiedad;
use App\Models\PropiedadEtiqueta;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PropiedadEtiqueta>
 */
class PropiedadEtiquetaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'propiedad_id' => Propiedad::factory(),
            'etiqueta_id' => EtiquetaInteres::factory(),
        ];
    }
}
