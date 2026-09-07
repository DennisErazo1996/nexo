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
    public function handle(UploadedFile $file, int $propiedadId, bool $aplicarMarcaAgua = true): array
    {
        // Increase memory limit for large image processing
        ini_set('memory_limit', '1024M');
        
        $nombre = Str::random(40).'.'.$file->getClientOriginalExtension();
        $ruta = "propiedades/{$propiedadId}/{$nombre}";

        // Process image with Intervention
        $image = Image::decode($file)
            ->scaleDown(width: self::ANCHO_MAXIMO);

        if ($aplicarMarcaAgua) {
            $user = auth()->user();
            if ($user && $user->logo_marca_agua) {
                // Use user logo
                try {
                    // Read file via storage as intervention needs path or contents
                    $logoContents = Storage::get($user->logo_marca_agua);
                    // Decode and scale logo down so it doesn't cover the whole image or crash memory
                    $logo = Image::decode($logoContents)->scaleDown(width: 300);
                    
                    $image->insert($logo, 20, 20, 'bottom-right'); // 20px padding
                } catch (\Exception $e) {
                    // Fallback to text if logo fails
                    $image->text(config('app.name'), 20, 20, function ($font): void {
                        $font->size(28);
                        $font->color('rgba(255, 255, 255, 0.7)');
                    });
                }
            } else {
                // Fallback to text
                $image->text(config('app.name'), 20, 20, function ($font): void {
                    $font->size(28);
                    $font->color('rgba(255, 255, 255, 0.7)');
                });
            }
        }

        // Encode image respecting its original extension and put it to default disk
        $encoded = $image->encodeUsingFileExtension($file->getClientOriginalExtension());
        Storage::put($ruta, (string) $encoded);

        $url = Storage::url($ruta);

        return [
            'url' => $url,
            'url_con_marca_agua' => $url,
        ];
    }
}
