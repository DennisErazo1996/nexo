<?php

namespace App\Http\Requests\PropiedadFoto;

use App\Concerns\PropiedadFotoValidationRules;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreFotoRequest extends FormRequest
{
    use PropiedadFotoValidationRules;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('propiedad'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'fotos' => ['required', 'array'],
            'fotos.*' => $this->fotoRules(),
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'fotos.*' => __('foto'),
        ];
    }
}
