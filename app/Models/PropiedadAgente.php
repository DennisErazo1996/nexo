<?php

namespace App\Models;

use Database\Factories\PropiedadAgenteFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $propiedad_id
 * @property int $agente_id
 * @property string|null $porcentaje_comision
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Propiedad $propiedad
 * @property-read User $agente
 */
#[Fillable(['propiedad_id', 'agente_id', 'porcentaje_comision'])]
class PropiedadAgente extends Model
{
    /** @use HasFactory<PropiedadAgenteFactory> */
    use HasFactory;

    /**
     * Get the propiedad this co-lister belongs to.
     *
     * @return BelongsTo<Propiedad, $this>
     */
    public function propiedad(): BelongsTo
    {
        return $this->belongsTo(Propiedad::class);
    }

    /**
     * Get the co-listing agente.
     *
     * @return BelongsTo<User, $this>
     */
    public function agente(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'porcentaje_comision' => 'decimal:2',
        ];
    }
}
