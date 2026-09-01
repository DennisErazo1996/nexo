<?php

namespace Database\Factories;

use App\Enums\EstadoCliente;
use App\Models\Cliente;
use App\Models\Equipo;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Cliente>
 */
class ClienteFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'equipo_id' => Equipo::factory(),
            'nombres' => fake()->firstName(),
            'apellidos' => fake()->lastName(),
            'telefono' => fake()->unique()->numerify('+504########'),
            'estado' => EstadoCliente::Nuevo,
            'agente_registro_id' => User::factory(),
        ];
    }

    /**
     * Indicate that the cliente belongs to the given equipo.
     */
    public function forEquipo(Equipo $equipo): static
    {
        return $this->state(fn (array $attributes) => [
            'equipo_id' => $equipo->id,
        ]);
    }

    /**
     * Indicate that the cliente was registered by the given agente.
     */
    public function registradoPor(User $agente): static
    {
        return $this->state(fn (array $attributes) => [
            'equipo_id' => $agente->equipo_id,
            'agente_registro_id' => $agente->id,
        ]);
    }
}
