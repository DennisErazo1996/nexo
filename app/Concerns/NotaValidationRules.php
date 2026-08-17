<?php

namespace App\Concerns;

use Illuminate\Contracts\Validation\ValidationRule;

trait NotaValidationRules
{
    /**
     * Get the validation rules used to validate a nota's texto.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function textoRules(): array
    {
        return ['required', 'string', 'max:2000'];
    }
}
