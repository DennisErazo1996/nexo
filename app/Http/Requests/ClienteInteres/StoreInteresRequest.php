<?php

namespace App\Http\Requests\ClienteInteres;

use App\Concerns\InteresValidationRules;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreInteresRequest extends FormRequest
{
    use InteresValidationRules;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('cliente'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'etiqueta_id' => $this->etiquetaIdRules(),
            'zona' => $this->zonaRules(),
            'presupuesto_min' => $this->presupuestoMinRules(),
            'presupuesto_max' => $this->presupuestoMaxRules(),
        ];
    }
}
