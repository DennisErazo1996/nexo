<?php

namespace Database\Factories;

use App\Models\Cliente;
use App\Models\NotaSeguimiento;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<NotaSeguimiento>
 */
class NotaSeguimientoFactory extends Factory
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
            'agente_id' => User::factory(),
            'texto' => fake()->sentence(),
        ];
    }
}
