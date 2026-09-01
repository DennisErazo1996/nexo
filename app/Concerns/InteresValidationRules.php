<?php

namespace App\Concerns;

use App\Enums\Municipio;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

trait InteresValidationRules
{
    /**
     * Get the validation rules used to validate an interest's etiqueta_id.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function etiquetaIdRules(): array
    {
        return ['required', 'integer', 'exists:etiquetas_interes,id'];
    }

    /**
     * Get the validation rules used to validate an interest's zona.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function zonaRules(): array
    {
        return ['nullable', Rule::enum(Municipio::class)];
    }

    /**
     * Get the validation rules used to validate an interest's presupuesto_min.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function presupuestoMinRules(): array
    {
        return [
            'nullable',
            'numeric',
            'min:0',
            Rule::when(request()->filled('presupuesto_max'), ['lte:presupuesto_max']),
        ];
    }

    /**
     * Get the validation rules used to validate an interest's presupuesto_max.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function presupuestoMaxRules(): array
    {
        return [
            'nullable',
            'numeric',
            'min:0',
            Rule::when(request()->filled('presupuesto_min'), ['gte:presupuesto_min']),
        ];
    }
}
