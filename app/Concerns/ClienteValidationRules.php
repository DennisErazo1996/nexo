<?php

namespace App\Concerns;

use Illuminate\Contracts\Validation\ValidationRule;

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
}
