<?php

namespace Database\Factories;

use App\Models\Propiedad;
use App\Models\PropiedadAgente;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PropiedadAgente>
 */
class PropiedadAgenteFactory extends Factory
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
            'agente_id' => User::factory(),
            'porcentaje_comision' => null,
        ];
    }
}
