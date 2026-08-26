<?php

namespace App\Http\Requests\Propiedad;

use App\Concerns\PropiedadValidationRules;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdatePropiedadRequest extends FormRequest
{
    use PropiedadValidationRules;

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
            'tipo' => $this->tipoRules(),
            'zona' => $this->zonaRules(),
            'area_terreno' => $this->areaTerrenoRules(),
            'area_construccion' => $this->areaConstruccionRules(),
            'unidad_medida' => $this->unidadMedidaRules(),
            'precio' => $this->precioRules(),
            'moneda' => $this->monedaRules(),
            'forma_pago' => $this->formaPagoRules(),
            'condicion_legal' => $this->condicionLegalRules(),
            'acceso' => $this->accesoRules(),
            'descripcion' => $this->descripcionRules(),
            'etiquetas' => $this->etiquetasRules(),
            'etiquetas.*' => $this->etiquetaIdRules(),
            'agentes' => $this->agentesRules(),
            'agentes.*' => $this->agenteIdRules(),
        ];
    }
}
