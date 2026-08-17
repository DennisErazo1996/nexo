<?php

namespace App\Policies;

use App\Models\Propiedad;
use App\Models\User;

class PropiedadPolicy
{
    /**
     * Determine whether the user can view any propiedades.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the propiedad.
     */
    public function view(User $user, Propiedad $propiedad): bool
    {
        return $user->equipo_id === $propiedad->equipo_id;
    }

    /**
     * Determine whether the user can create propiedades.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the propiedad (estado, fotos).
     */
    public function update(User $user, Propiedad $propiedad): bool
    {
        return $user->equipo_id === $propiedad->equipo_id;
    }
}
