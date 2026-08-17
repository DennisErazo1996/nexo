<?php

namespace App\Enums;

enum Moneda: string
{
    case Lempiras = 'HNL';
    case Dolares = 'USD';

    /**
     * Get the human-readable label for the moneda.
     */
    public function label(): string
    {
        return match ($this) {
            self::Lempiras => 'Lempiras (HNL)',
            self::Dolares => 'Dólares (USD)',
        };
    }
}
