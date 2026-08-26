<?php

namespace App\Models;

use App\Concerns\BelongsToEquipo;
use App\Enums\CondicionLegal;
use App\Enums\EstadoPropiedad;
use App\Enums\FormaPago;
use App\Enums\Moneda;
use App\Enums\TipoPropiedad;
use App\Enums\UnidadMedida;
use Database\Factories\PropiedadFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $equipo_id
 * @property TipoPropiedad $tipo
 * @property string $zona
 * @property string $area_terreno
 * @property string|null $area_construccion
 * @property UnidadMedida $unidad_medida
 * @property string $precio
 * @property Moneda $moneda
 * @property FormaPago $forma_pago
 * @property CondicionLegal|null $condicion_legal
 * @property string|null $acceso
 * @property string|null $descripcion
 * @property EstadoPropiedad $estado
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Equipo $equipo
 */
#[Fillable([
    'tipo', 'zona', 'area_terreno', 'area_construccion', 'unidad_medida', 'precio', 'moneda',
    'forma_pago', 'condicion_legal', 'acceso', 'descripcion', 'estado',
])]
class Propiedad extends Model
{
    use BelongsToEquipo;

    /** @use HasFactory<PropiedadFactory> */
    use HasFactory;

    /**
     * The table associated with the model.
     */
    protected $table = 'propiedades';

    /**
     * Get the equipo this propiedad belongs to.
     *
     * @return BelongsTo<Equipo, $this>
     */
    public function equipo(): BelongsTo
    {
        return $this->belongsTo(Equipo::class);
    }

    /**
     * Get the etiquetas de uso for this propiedad.
     *
     * @return HasMany<PropiedadEtiqueta, $this>
     */
    public function etiquetas(): HasMany
    {
        return $this->hasMany(PropiedadEtiqueta::class);
    }

    /**
     * Get the co-listing agentes for this propiedad.
     *
     * @return HasMany<PropiedadAgente, $this>
     */
    public function agentes(): HasMany
    {
        return $this->hasMany(PropiedadAgente::class);
    }

    /**
     * Get the fotos for this propiedad, ordered by orden.
     *
     * @return HasMany<PropiedadFoto, $this>
     */
    public function fotos(): HasMany
    {
        return $this->hasMany(PropiedadFoto::class)->orderBy('orden');
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tipo' => TipoPropiedad::class,
            'unidad_medida' => UnidadMedida::class,
            'moneda' => Moneda::class,
            'forma_pago' => FormaPago::class,
            'condicion_legal' => CondicionLegal::class,
            'estado' => EstadoPropiedad::class,
            'area_terreno' => 'decimal:2',
            'area_construccion' => 'decimal:2',
            'precio' => 'decimal:2',
        ];
    }
}
