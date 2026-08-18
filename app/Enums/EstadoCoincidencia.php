<?php

namespace App\Enums;

enum EstadoCoincidencia: string
{
    case Pendiente = 'pendiente';
    case Notificado = 'notificado';
    case Descartado = 'descartado';

    /**
     * Get the human-readable label for the estado.
     */
    public function label(): string
    {
        return match ($this) {
            self::Pendiente => 'Pendiente',
            self::Notificado => 'Notificado',
            self::Descartado => 'Descartado',
        };
    }
}
