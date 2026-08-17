<?php

namespace App\Models;

use Database\Factories\PropiedadFotoFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

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
}
