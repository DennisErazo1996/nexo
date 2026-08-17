<?php

namespace App\Http\Requests\Cliente;

use App\Concerns\ClienteValidationRules;
use App\Concerns\InteresValidationRules;
use App\Models\Cliente;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreClienteRequest extends FormRequest
{
    use ClienteValidationRules, InteresValidationRules;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('create', Cliente::class);
    }

    /**
     * Normalize the telefono before validation runs, so the uniqueness
     * check compares against the same format stored on the model.
     */
    protected function prepareForValidation(): void
    {
        if ($this->filled('telefono')) {
            $this->merge(['telefono' => Cliente::normalizarTelefono($this->string('telefono')->value())]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'telefono' => [
                ...$this->telefonoRules(),
                Rule::unique('clientes')->where('equipo_id', $this->user()->equipo_id),
            ],
            'nombre' => $this->nombreRules(),
            'etiqueta_id' => $this->etiquetaIdRules(),
            'zona' => $this->zonaRules(),
            'presupuesto_min' => $this->presupuestoMinRules(),
            'presupuesto_max' => $this->presupuestoMaxRules(),
        ];
    }
}
