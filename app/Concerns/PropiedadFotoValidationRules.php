<?php

namespace App\Concerns;

use Illuminate\Contracts\Validation\ValidationRule;

trait PropiedadFotoValidationRules
{
    /**
     * Get the validation rules used to validate a propiedad's fotos.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function fotosRules(): array
    {
        return ['nullable', 'array'];
    }

    /**
     * Get the validation rules used to validate each foto file.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function fotoRules(): array
    {
        return ['image', 'max:10240'];
    }
}
