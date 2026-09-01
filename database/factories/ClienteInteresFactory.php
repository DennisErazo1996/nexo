<?php

namespace Database\Factories;

use App\Enums\Municipio;
use App\Models\Cliente;
use App\Models\ClienteInteres;
use App\Models\EtiquetaInteres;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ClienteInteres>
 */
class ClienteInteresFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'cliente_id' => Cliente::factory(),
            'etiqueta_id' => EtiquetaInteres::factory(),
            'zona' => fake()->randomElement(Municipio::cases())->value,
            'presupuesto_min' => fake()->numberBetween(100000, 500000),
            'presupuesto_max' => fake()->numberBetween(500001, 1000000),
            'agente_id' => User::factory(),
        ];
    }
}
