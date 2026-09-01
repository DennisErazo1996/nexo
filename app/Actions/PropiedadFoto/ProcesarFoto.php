<?php

namespace App\Actions\PropiedadFoto;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Laravel\Facades\Image;

class ProcesarFoto
{
    /**
     * Maximum width (in pixels) the watermarked photo is scaled down to.
     */
    private const ANCHO_MAXIMO = 1600;

    /**
     * Store the original photo and generate a watermarked copy, both on the
     * public disk.
     *
     * @return array{url: string, url_con_marca_agua: string}
     */
    public function handle(UploadedFile $file, int $propiedadId): array
    {
        $nombre = Str::random(40).'.'.$file->getClientOriginalExtension();

        $rutaOriginal = "propiedades/{$propiedadId}/original/{$nombre}";
        $rutaMarcaAgua = "propiedades/{$propiedadId}/marca-agua/{$nombre}";

        $file->storeAs("propiedades/{$propiedadId}/original", $nombre, 'public');

        Storage::disk('public')->makeDirectory("propiedades/{$propiedadId}/marca-agua");

        Image::decode($file)
            ->scaleDown(width: self::ANCHO_MAXIMO)
            ->text(config('app.name'), 20, 20, function ($font): void {
                $font->size(28);
                $font->color('rgba(255, 255, 255, 0.7)');
            })
            ->save(Storage::disk('public')->path($rutaMarcaAgua));

        return [
            'url' => "/storage/{$rutaOriginal}",
            'url_con_marca_agua' => "/storage/{$rutaMarcaAgua}",
        ];
    }
}
