<?php

namespace App\Enums;

enum EstadoPropiedad: string
{
    case Disponible = 'disponible';
    case Reservada = 'reservada';
    case Vendida = 'vendida';
    case Retirada = 'retirada';

    /**
     * Get the human-readable label for the estado.
     */
    public function label(): string
    {
        return match ($this) {
            self::Disponible => 'Disponible',
            self::Reservada => 'Reservada',
            self::Vendida => 'Vendida',
            self::Retirada => 'Retirada',
        };
    }
}
