<?php

namespace Database\Factories;

use App\Enums\EstadoPropiedad;
use App\Enums\FormaPago;
use App\Enums\Moneda;
use App\Enums\TipoPropiedad;
use App\Enums\UnidadMedida;
use App\Models\Equipo;
use App\Models\Propiedad;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Propiedad>
 */
class PropiedadFactory extends Factory
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
            'tipo' => fake()->randomElement(TipoPropiedad::cases()),
            'zona' => fake()->city(),
            'tamano' => fake()->randomFloat(2, 1, 500),
            'unidad_medida' => fake()->randomElement(UnidadMedida::cases()),
            'precio' => fake()->numberBetween(200000, 5000000),
            'moneda' => Moneda::Lempiras,
            'forma_pago' => fake()->randomElement(FormaPago::cases()),
            'condicion_legal' => null,
            'acceso' => fake()->sentence(),
            'descripcion' => fake()->paragraph(),
            'estado' => EstadoPropiedad::Disponible,
        ];
    }

    /**
     * Indicate that the propiedad belongs to the given equipo.
     */
    public function forEquipo(Equipo $equipo): static
    {
        return $this->state(fn (array $attributes) => [
            'equipo_id' => $equipo->id,
        ]);
    }
}
