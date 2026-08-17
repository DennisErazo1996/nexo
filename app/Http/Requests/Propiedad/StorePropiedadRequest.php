<?php

namespace App\Http\Requests\Propiedad;

use App\Concerns\PropiedadFotoValidationRules;
use App\Concerns\PropiedadValidationRules;
use App\Models\Propiedad;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StorePropiedadRequest extends FormRequest
{
    use PropiedadFotoValidationRules, PropiedadValidationRules;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('create', Propiedad::class);
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
            'tamano' => $this->tamanoRules(),
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
            'fotos' => $this->fotosRules(),
            'fotos.*' => $this->fotoRules(),
        ];
    }
}
