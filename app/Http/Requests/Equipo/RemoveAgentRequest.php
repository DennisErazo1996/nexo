<?php

namespace App\Http\Requests\Equipo;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class RemoveAgentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        /** @var User $agente */
        $agente = $this->route('agente');

        return $this->user()->can('delete', $agente);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [];
    }
}
