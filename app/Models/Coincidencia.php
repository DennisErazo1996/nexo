<?php

namespace App\Models;

use App\Concerns\BelongsToEquipo;
use App\Enums\EstadoCoincidencia;
use Database\Factories\CoincidenciaFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $equipo_id
 * @property int $cliente_id
 * @property int $propiedad_id
 * @property EstadoCoincidencia $estado
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Equipo $equipo
 * @property-read Cliente $cliente
 * @property-read Propiedad $propiedad
 */
#[Fillable(['equipo_id', 'cliente_id', 'propiedad_id', 'estado'])]
class Coincidencia extends Model
{
    use BelongsToEquipo;

    /** @use HasFactory<CoincidenciaFactory> */
    use HasFactory;

    /**
     * The table associated with the model.
     */
    protected $table = 'matches';

    /**
     * Get the equipo this coincidencia belongs to.
     *
     * @return BelongsTo<Equipo, $this>
     */
    public function equipo(): BelongsTo
    {
        return $this->belongsTo(Equipo::class);
    }

    /**
     * Get the cliente involved in this coincidencia.
     *
     * @return BelongsTo<Cliente, $this>
     */
    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class);
    }

    /**
     * Get the propiedad involved in this coincidencia.
     *
     * @return BelongsTo<Propiedad, $this>
     */
    public function propiedad(): BelongsTo
    {
        return $this->belongsTo(Propiedad::class);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'estado' => EstadoCoincidencia::class,
        ];
    }
}
