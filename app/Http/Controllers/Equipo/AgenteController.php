<?php

namespace App\Http\Controllers\Equipo;

use App\Http\Controllers\Controller;
use App\Http\Requests\Equipo\RemoveAgentRequest;
use App\Http\Requests\Equipo\UpdateAgentRoleRequest;
use App\Models\User;
use App\Policies\UserPolicy;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AgenteController extends Controller
{
    /**
     * Update an agente's rol within the equipo.
     */
    public function update(UpdateAgentRoleRequest $request, User $agente, UserPolicy $policy): RedirectResponse
    {
        if ($request->validated('rol') !== 'admin' && $policy->isLastAdmin($agente)) {
            throw ValidationException::withMessages([
                'rol' => __('El equipo debe tener al menos un admin.'),
            ]);
        }

        $agente->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Rol actualizado.')]);

        return to_route('equipo.edit');
    }

    /**
     * Remove an agente from the equipo.
     */
    public function destroy(RemoveAgentRequest $request, User $agente): RedirectResponse
    {
        $agente->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Agente eliminado.')]);

        return to_route('equipo.edit');
    }
}
