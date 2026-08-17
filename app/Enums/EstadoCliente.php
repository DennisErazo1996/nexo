<?php

namespace App\Enums;

enum EstadoCliente: string
{
    case Nuevo = 'nuevo';
    case Contactado = 'contactado';
    case Visitando = 'visitando';
    case Negociando = 'negociando';
    case Cerrado = 'cerrado';
    case Perdido = 'perdido';

    /**
     * Get the human-readable label for the estado.
     */
    public function label(): string
    {
        return match ($this) {
            self::Nuevo => 'Nuevo',
            self::Contactado => 'Contactado',
            self::Visitando => 'Visitando',
            self::Negociando => 'Negociando',
            self::Cerrado => 'Cerrado',
            self::Perdido => 'Perdido',
        };
    }
}
