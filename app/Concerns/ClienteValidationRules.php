<?php

namespace App\Concerns;

use App\Enums\EstadoCliente;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

trait ClienteValidationRules
{
    /**
     * Get the validation rules used to validate a cliente's nombre.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function nombreRules(): array
    {
        return ['required', 'string', 'max:255'];
    }

    /**
     * Get the validation rules used to validate a cliente's telefono.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function telefonoRules(): array
    {
        return ['required', 'string', 'max:20'];
    }

    /**
     * Get the validation rules used to validate a cliente's estado.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function estadoRules(): array
    {
        return ['required', Rule::in(array_column(EstadoCliente::cases(), 'value'))];
    }
}
