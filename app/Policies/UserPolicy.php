<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Determine whether the user can update another agente (e.g. change their rol).
     */
    public function update(User $user, User $agente): bool
    {
        return $user->isAdmin() && $user->equipo_id === $agente->equipo_id;
    }

    /**
     * Determine whether the user can remove another agente from the equipo.
     */
    public function delete(User $user, User $agente): bool
    {
        if (! $user->isAdmin() || $user->equipo_id !== $agente->equipo_id) {
            return false;
        }

        if ($user->id === $agente->id) {
            return false;
        }

        return ! $this->isLastAdmin($agente);
    }

    /**
     * Determine whether the given agente is the only admin left in their equipo.
     */
    public function isLastAdmin(User $agente): bool
    {
        if (! $agente->isAdmin()) {
            return false;
        }

        return $agente->equipo->agentes()->where('rol', 'admin')->count() === 1;
    }
}
