<?php

namespace App\Concerns;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

/**
 * Scopes a model to the authenticated user's equipo.
 *
 * Used by multi-tenant models (Cliente, and Propiedad in a later phase) for
 * isolation by equipo_id.
 */
trait BelongsToEquipo
{
    /**
     * Boot the trait, registering the equipo global scope.
     */
    protected static function bootBelongsToEquipo(): void
    {
        static::addGlobalScope('equipo', function (Builder $query): void {
            $query->when(
                Auth::check(),
                fn (Builder $query) => $query->where('equipo_id', Auth::user()->equipo_id),
            );
        });

        static::creating(function ($model): void {
            if (! $model->equipo_id && Auth::check()) {
                $model->equipo_id = Auth::user()->equipo_id;
            }
        });
    }
}
