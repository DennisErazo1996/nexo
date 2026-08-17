<?php

namespace App\Enums;

enum CondicionLegal: string
{
    case EscrituraPublica = 'escritura_publica';
    case EnTramite = 'en_tramite';
    case Hipotecada = 'hipotecada';

    /**
     * Get the human-readable label for the condición legal.
     */
    public function label(): string
    {
        return match ($this) {
            self::EscrituraPublica => 'Escritura pública',
            self::EnTramite => 'En trámite',
            self::Hipotecada => 'Hipotecada',
        };
    }
}
