<?php

namespace App\Enums;

enum Rol: string
{
    case Admin = 'admin';
    case Agente = 'agente';

    /**
     * Get the human-readable label for the role.
     */
    public function label(): string
    {
        return match ($this) {
            self::Admin => 'Admin',
            self::Agente => 'Agente',
        };
    }
}
