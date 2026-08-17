<?php

namespace App\Models;

use Database\Factories\ClienteInteresFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $cliente_id
 * @property int $etiqueta_id
 * @property string|null $zona
 * @property string|null $presupuesto_min
 * @property string|null $presupuesto_max
 * @property int $agente_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Cliente $cliente
 * @property-read EtiquetaInteres $etiqueta
 * @property-read User $agente
 */
#[Fillable(['cliente_id', 'etiqueta_id', 'zona', 'presupuesto_min', 'presupuesto_max', 'agente_id'])]
class ClienteInteres extends Model
{
    /** @use HasFactory<ClienteInteresFactory> */
    use HasFactory;

    /**
     * The table associated with the model.
     */
    protected $table = 'cliente_intereses';

    /**
     * Get the cliente this interest belongs to.
     *
     * @return BelongsTo<Cliente, $this>
     */
    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class);
    }

    /**
     * Get the etiqueta captured for this interest.
     *
     * @return BelongsTo<EtiquetaInteres, $this>
     */
    public function etiqueta(): BelongsTo
    {
        return $this->belongsTo(EtiquetaInteres::class, 'etiqueta_id');
    }

    /**
     * Get the agente who captured this interest.
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
            'presupuesto_min' => 'decimal:2',
            'presupuesto_max' => 'decimal:2',
        ];
    }
}
