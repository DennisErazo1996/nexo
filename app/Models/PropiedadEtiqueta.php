<?php

namespace App\Models;

use Database\Factories\PropiedadEtiquetaFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $propiedad_id
 * @property int $etiqueta_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Propiedad $propiedad
 * @property-read EtiquetaInteres $etiqueta
 */
#[Fillable(['propiedad_id', 'etiqueta_id'])]
class PropiedadEtiqueta extends Model
{
    /** @use HasFactory<PropiedadEtiquetaFactory> */
    use HasFactory;

    /**
     * Get the propiedad this etiqueta belongs to.
     *
     * @return BelongsTo<Propiedad, $this>
     */
    public function propiedad(): BelongsTo
    {
        return $this->belongsTo(Propiedad::class);
    }

    /**
     * Get the etiqueta assigned to the propiedad.
     *
     * @return BelongsTo<EtiquetaInteres, $this>
     */
    public function etiqueta(): BelongsTo
    {
        return $this->belongsTo(EtiquetaInteres::class, 'etiqueta_id');
    }
}
