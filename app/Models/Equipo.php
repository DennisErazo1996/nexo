<?php

namespace App\Models;

use Database\Factories\EquipoFactory;
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
class Equipo extends Model
{
    /** @use HasFactory<EquipoFactory> */
    use HasFactory;

    /**
     * Get the agentes that belong to this equipo.
     *
     * @return HasMany<User, $this>
     */
    public function agentes(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
