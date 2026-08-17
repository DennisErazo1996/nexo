<?php

namespace App\Enums;

enum TipoPropiedad: string
{
    case Terreno = 'terreno';
    case Casa = 'casa';
    case Apartamento = 'apartamento';
    case LocalComercial = 'local_comercial';
    case Bodega = 'bodega';

    /**
     * Get the human-readable label for the tipo.
     */
    public function label(): string
    {
        return match ($this) {
            self::Terreno => 'Terreno',
            self::Casa => 'Casa',
            self::Apartamento => 'Apartamento',
            self::LocalComercial => 'Local comercial',
            self::Bodega => 'Bodega',
        };
    }
}
