<?php

namespace App\Models;

use Database\Factories\PropiedadFotoFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property int $propiedad_id
 * @property string $url
 * @property string $url_con_marca_agua
 * @property int $orden
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Propiedad $propiedad
 */
#[Fillable(['propiedad_id', 'url', 'url_con_marca_agua', 'orden'])]
class PropiedadFoto extends Model
{
    /** @use HasFactory<PropiedadFotoFactory> */
    use HasFactory;

    /**
     * Get the propiedad this foto belongs to.
     *
     * @return BelongsTo<Propiedad, $this>
     */
    public function propiedad(): BelongsTo
    {
        return $this->belongsTo(Propiedad::class);
    }

    /**
     * Path of the original file relative to the public disk root.
     *
     * Tolerates both the current root-relative form (`/storage/...`) and the
     * legacy absolute form (`http://host/storage/...`) stored before URLs were
     * normalized.
     */
    public function rutaOriginal(): string
    {
        if (Str::contains($this->url, '/storage/')) {
            return Str::after($this->url, '/storage/');
        }
        
        return ltrim(parse_url($this->url, PHP_URL_PATH) ?? '', '/');
    }

    /**
     * Path of the watermarked file relative to the disk root.
     */
    public function rutaMarcaAgua(): string
    {
        if (Str::contains($this->url_con_marca_agua, '/storage/')) {
            return Str::after($this->url_con_marca_agua, '/storage/');
        }
        
        return ltrim(parse_url($this->url_con_marca_agua, PHP_URL_PATH) ?? '', '/');
    }
}
