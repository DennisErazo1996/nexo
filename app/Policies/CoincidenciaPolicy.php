<?php

namespace App\Policies;

use App\Models\Coincidencia;
use App\Models\User;

class CoincidenciaPolicy
{
    /**
     * Determine whether the user can view any coincidencias.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the coincidencia.
     */
    public function view(User $user, Coincidencia $coincidencia): bool
    {
        return $this->relacionado($user, $coincidencia);
    }

    /**
     * Determine whether the user can update the coincidencia's estado.
     */
    public function update(User $user, Coincidencia $coincidencia): bool
    {
        return $this->relacionado($user, $coincidencia);
    }

    /**
     * Determine whether the user belongs to the coincidencia's equipo and is
     * related to it: the cliente's registering agente, an agente who
     * captured one of the cliente's intereses, or a co-lister of the
     * propiedad.
     */
    private function relacionado(User $user, Coincidencia $coincidencia): bool
    {
        if ($user->equipo_id !== $coincidencia->equipo_id) {
            return false;
        }

        return $coincidencia->cliente->agente_registro_id === $user->id
            || $coincidencia->cliente->intereses()->where('agente_id', $user->id)->exists()
            || $coincidencia->propiedad->agentes()->where('agente_id', $user->id)->exists();
    }
}
