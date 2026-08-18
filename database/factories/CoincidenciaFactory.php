<?php

namespace Database\Factories;

use App\Enums\EstadoCoincidencia;
use App\Models\Cliente;
use App\Models\Coincidencia;
use App\Models\Equipo;
use App\Models\Propiedad;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Coincidencia>
 */
class CoincidenciaFactory extends Factory
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
            'cliente_id' => Cliente::factory(),
            'propiedad_id' => Propiedad::factory(),
            'estado' => EstadoCoincidencia::Pendiente,
        ];
    }

    /**
     * Indicate that the coincidencia belongs to the given equipo.
     */
    public function forEquipo(Equipo $equipo): static
    {
        return $this->state(fn (array $attributes) => [
            'equipo_id' => $equipo->id,
        ]);
    }
}
