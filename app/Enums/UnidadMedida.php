<?php

namespace App\Enums;

enum UnidadMedida: string
{
    case Manzana = 'manzana';
    case MetroCuadrado = 'm2';
    case VaraCuadrada = 'vara2';

    /**
     * Get the human-readable label for the unidad de medida.
     */
    public function label(): string
    {
        return match ($this) {
            self::Manzana => 'Manzana',
            self::MetroCuadrado => 'm²',
            self::VaraCuadrada => 'vara²',
        };
    }
}
