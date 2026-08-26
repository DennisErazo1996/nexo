<?php

namespace App\Enums;

enum EstadoCliente: string
{
    case Nuevo = 'nuevo';
    case Contactado = 'contactado';

    /**
     * Get the human-readable label for the estado.
     */
    public function label(): string
    {
        return match ($this) {
            self::Nuevo => 'Nuevo',
            self::Contactado => 'Contactado',
        };
    }
}
