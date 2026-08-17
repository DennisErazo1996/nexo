<?php

namespace App\Concerns;

use App\Enums\Rol;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

trait EquipoValidationRules
{
    /**
     * Get the validation rules used to validate an equipo's nombre.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function equipoNombreRules(): array
    {
        return ['required', 'string', 'max:255'];
    }

    /**
     * Get the validation rules used to validate a user's telefono.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function telefonoRules(): array
    {
        return ['nullable', 'string', 'max:20'];
    }

    /**
     * Get the validation rules used to validate a user's rol.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function rolRules(): array
    {
        return ['required', Rule::in(array_column(Rol::cases(), 'value'))];
    }
}
