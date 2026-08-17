<?php

namespace App\Actions\Equipo;

use App\Models\Equipo;
use Illuminate\Support\Facades\URL;

class GenerateInviteLink
{
    /**
     * Generate a temporary signed URL agentes can use to join an equipo.
     */
    public function handle(Equipo $equipo): string
    {
        return URL::temporarySignedRoute(
            'equipo.invitaciones.show',
            now()->addDays(7),
            ['equipo' => $equipo->id],
        );
    }
}
