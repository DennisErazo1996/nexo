<?php

namespace Database\Seeders;

use App\Models\EtiquetaInteres;
use Illuminate\Database\Seeder;

class EtiquetaInteresSeeder extends Seeder
{
    /**
     * The fixed catalog of etiquetas de interés/uso.
     *
     * @var array<int, string>
     */
    private const ETIQUETAS = [
        'casa',
        'terreno',
        'apartamento',
        'local_comercial',
        'ganadero',
        'lotificacion',
        'bodega',
        'agricola',
        'carro',
    ];

    /**
     * Seed the etiquetas_interes catalog.
     */
    public function run(): void
    {
        foreach (self::ETIQUETAS as $nombre) {
            EtiquetaInteres::query()->firstOrCreate(['nombre' => $nombre]);
        }
    }
}
