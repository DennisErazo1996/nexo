<?php

namespace App\Http\Requests\Equipo;

use App\Concerns\EquipoValidationRules;
use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateAgentRoleRequest extends FormRequest
{
    use EquipoValidationRules;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        /** @var User $agente */
        $agente = $this->route('agente');

        return $this->user()->can('update', $agente);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'rol' => $this->rolRules(),
        ];
    }
}
