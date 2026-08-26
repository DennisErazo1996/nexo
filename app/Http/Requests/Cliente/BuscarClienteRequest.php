<?php

namespace App\Http\Requests\Cliente;

use App\Concerns\ClienteValidationRules;
use App\Models\Cliente;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class BuscarClienteRequest extends FormRequest
{
    use ClienteValidationRules;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('create', Cliente::class);
    }

    /**
     * Normalize the telefono before validation runs.
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
            'telefono' => $this->telefonoRules(),
        ];
    }
}
