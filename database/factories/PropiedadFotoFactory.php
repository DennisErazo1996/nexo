<?php

namespace Database\Factories;

use App\Models\Propiedad;
use App\Models\PropiedadFoto;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PropiedadFoto>
 */
class PropiedadFotoFactory extends Factory
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
            'url' => fake()->imageUrl(),
            'url_con_marca_agua' => fake()->imageUrl(),
            'orden' => 0,
        ];
    }
}
