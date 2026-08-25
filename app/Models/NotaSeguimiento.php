<?php

namespace App\Models;

use Database\Factories\NotaSeguimientoFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $cliente_id
 * @property int $agente_id
 * @property int|null $propiedad_id
 * @property string $texto
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Cliente $cliente
 * @property-read User $agente
 * @property-read Propiedad|null $propiedad
 */
#[Fillable(['cliente_id', 'agente_id', 'propiedad_id', 'texto'])]
class NotaSeguimiento extends Model
{
    /** @use HasFactory<NotaSeguimientoFactory> */
    use HasFactory;

    /**
     * The table associated with the model.
     */
    protected $table = 'notas_seguimiento';

    /**
     * Get the cliente this nota belongs to.
     *
     * @return BelongsTo<Cliente, $this>
     */
    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class);
    }

    /**
     * Get the agente who wrote this nota.
     *
     * @return BelongsTo<User, $this>
     */
    public function agente(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the propiedad this nota is related to, if any.
     *
     * @return BelongsTo<Propiedad, $this>
     */
    public function propiedad(): BelongsTo
    {
        return $this->belongsTo(Propiedad::class);
    }
}
