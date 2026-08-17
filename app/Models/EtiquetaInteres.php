<?php

namespace App\Models;

use Database\Factories\EtiquetaInteresFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $nombre
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['nombre'])]
class EtiquetaInteres extends Model
{
    /** @use HasFactory<EtiquetaInteresFactory> */
    use HasFactory;

    /**
     * The table associated with the model.
     */
    protected $table = 'etiquetas_interes';

    /**
     * Get the cliente interest entries using this etiqueta.
     *
     * @return HasMany<ClienteInteres, $this>
     */
    public function clienteIntereses(): HasMany
    {
        return $this->hasMany(ClienteInteres::class, 'etiqueta_id');
    }
}
