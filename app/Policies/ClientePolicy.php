<?php

namespace App\Policies;

use App\Models\Cliente;
use App\Models\User;

class ClientePolicy
{
    /**
     * Determine whether the user can view any clientes.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the cliente.
     */
    public function view(User $user, Cliente $cliente): bool
    {
        return $user->equipo_id === $cliente->equipo_id;
    }

    /**
     * Determine whether the user can create clientes.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the cliente (estado, intereses, notas).
     */
    public function update(User $user, Cliente $cliente): bool
    {
        return $user->equipo_id === $cliente->equipo_id;
    }

    /**
     * Determine whether the user can delete the cliente.
     */
    public function delete(User $user, Cliente $cliente): bool
    {
        return $user->equipo_id === $cliente->equipo_id;
    }
}
