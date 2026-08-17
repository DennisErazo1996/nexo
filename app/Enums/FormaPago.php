<?php

namespace App\Enums;

enum FormaPago: string
{
    case Contado = 'contado';
    case Financiable = 'financiable';
    case Negociable = 'negociable';

    /**
     * Get the human-readable label for the forma de pago.
     */
    public function label(): string
    {
        return match ($this) {
            self::Contado => 'Contado',
            self::Financiable => 'Financiable',
            self::Negociable => 'Negociable',
        };
    }
}
