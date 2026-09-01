<?php

namespace App\Enums;

enum CondicionLegal: string
{
    case EscrituraPublica = 'escritura_publica';
    case EnTramite = 'en_tramite';
    case Hipotecada = 'hipotecada';
    case PapelesEnRegla = 'papeles_en_regla';
    case DocumentoPrivado = 'documento_privado';

    /**
     * Get the human-readable label for the condición legal.
     */
    public function label(): string
    {
        return match ($this) {
            self::EscrituraPublica => 'Escritura pública',
            self::EnTramite => 'En trámite',
            self::Hipotecada => 'Hipotecada',
            self::PapelesEnRegla => 'Papeles en regla',
            self::DocumentoPrivado => 'Documento privado',
        };
    }
}
