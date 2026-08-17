<?php

namespace App\Policies;

use App\Models\Equipo;
use App\Models\User;

class EquipoPolicy
{
    /**
     * Determine whether the user can view the equipo.
     */
    public function view(User $user, Equipo $equipo): bool
    {
        return $user->equipo_id === $equipo->id;
    }

    /**
     * Determine whether the user can update the equipo.
     */
    public function update(User $user, Equipo $equipo): bool
    {
        return $user->isAdmin() && $user->equipo_id === $equipo->id;
    }
}
