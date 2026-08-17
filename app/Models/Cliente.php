<?php

namespace App\Models;

use App\Concerns\BelongsToEquipo;
use App\Enums\EstadoCliente;
use Database\Factories\ClienteFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $equipo_id
 * @property string $nombre
 * @property string $telefono
 * @property EstadoCliente $estado
 * @property int $agente_registro_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Equipo $equipo
 * @property-read User $agenteRegistro
 */
#[Fillable(['nombre', 'telefono', 'estado', 'agente_registro_id'])]
class Cliente extends Model
{
    use BelongsToEquipo;

    /** @use HasFactory<ClienteFactory> */
    use HasFactory;

    /**
     * Normalize a telefono for storage/comparison: strip everything except
     * digits and a leading '+', and assume the +504 country code when none
     * is provided.
     */
    public static function normalizarTelefono(string $telefono): string
    {
        $digits = preg_replace('/[^\d+]/', '', $telefono) ?? '';

        return str_starts_with($digits, '+') ? $digits : '+504'.$digits;
    }

    /**
     * Get the equipo this cliente belongs to.
     *
     * @return BelongsTo<Equipo, $this>
     */
    public function equipo(): BelongsTo
    {
        return $this->belongsTo(Equipo::class);
    }

    /**
     * Get the agente who first registered this cliente.
     *
     * @return BelongsTo<User, $this>
     */
    public function agenteRegistro(): BelongsTo
    {
        return $this->belongsTo(User::class, 'agente_registro_id');
    }

    /**
     * Get the interest entries captured for this cliente.
     *
     * @return HasMany<ClienteInteres, $this>
     */
    public function intereses(): HasMany
    {
        return $this->hasMany(ClienteInteres::class);
    }

    /**
     * Get the follow-up notes recorded for this cliente.
     *
     * @return HasMany<NotaSeguimiento, $this>
     */
    public function notas(): HasMany
    {
        return $this->hasMany(NotaSeguimiento::class);
    }

    /**
     * Normalize the telefono before it is stored.
     *
     * @return Attribute<string, string>
     */
    protected function telefono(): Attribute
    {
        return Attribute::make(
            set: fn (string $value) => self::normalizarTelefono($value),
        );
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'estado' => EstadoCliente::class,
        ];
    }
}
