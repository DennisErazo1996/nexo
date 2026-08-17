<?php

namespace App\Concerns;

use App\Enums\CondicionLegal;
use App\Enums\EstadoPropiedad;
use App\Enums\FormaPago;
use App\Enums\Moneda;
use App\Enums\TipoPropiedad;
use App\Enums\UnidadMedida;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

trait PropiedadValidationRules
{
    /**
     * Get the validation rules used to validate a propiedad's tipo.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function tipoRules(): array
    {
        return ['required', Rule::in(array_column(TipoPropiedad::cases(), 'value'))];
    }

    /**
     * Get the validation rules used to validate a propiedad's zona.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function zonaRules(): array
    {
        return ['required', 'string', 'max:255'];
    }

    /**
     * Get the validation rules used to validate a propiedad's tamano.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function tamanoRules(): array
    {
        return ['required', 'numeric', 'min:0'];
    }

    /**
     * Get the validation rules used to validate a propiedad's unidad_medida.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function unidadMedidaRules(): array
    {
        return ['required', Rule::in(array_column(UnidadMedida::cases(), 'value'))];
    }

    /**
     * Get the validation rules used to validate a propiedad's precio.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function precioRules(): array
    {
        return ['required', 'numeric', 'min:0'];
    }

    /**
     * Get the validation rules used to validate a propiedad's moneda.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function monedaRules(): array
    {
        return ['required', Rule::in(array_column(Moneda::cases(), 'value'))];
    }

    /**
     * Get the validation rules used to validate a propiedad's forma_pago.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function formaPagoRules(): array
    {
        return ['required', Rule::in(array_column(FormaPago::cases(), 'value'))];
    }

    /**
     * Get the validation rules used to validate a propiedad's condicion_legal.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function condicionLegalRules(): array
    {
        return ['nullable', Rule::in(array_column(CondicionLegal::cases(), 'value'))];
    }

    /**
     * Get the validation rules used to validate a propiedad's acceso.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function accesoRules(): array
    {
        return ['nullable', 'string'];
    }

    /**
     * Get the validation rules used to validate a propiedad's descripcion.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function descripcionRules(): array
    {
        return ['nullable', 'string'];
    }

    /**
     * Get the validation rules used to validate a propiedad's estado.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function estadoRules(): array
    {
        return ['required', Rule::in(array_column(EstadoPropiedad::cases(), 'value'))];
    }

    /**
     * Get the validation rules used to validate a propiedad's etiquetas.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function etiquetasRules(): array
    {
        return ['nullable', 'array'];
    }

    /**
     * Get the validation rules used to validate each etiqueta id.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function etiquetaIdRules(): array
    {
        return ['integer', 'exists:etiquetas_interes,id'];
    }

    /**
     * Get the validation rules used to validate a propiedad's agentes (co-listers).
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function agentesRules(): array
    {
        return ['nullable', 'array'];
    }

    /**
     * Get the validation rules used to validate each agente id.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function agenteIdRules(): array
    {
        return ['integer', 'exists:users,id'];
    }
}
