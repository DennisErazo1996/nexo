<?php

namespace App\Http\Controllers\Equipo;

use App\Actions\Equipo\GenerateInviteLink;
use App\Http\Controllers\Controller;
use App\Http\Requests\Equipo\InviteAgentRequest;
use App\Models\Equipo;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class InvitationController extends Controller
{
    /**
     * Generate and flash an invite link for a new agente to join the equipo.
     */
    public function store(InviteAgentRequest $request, GenerateInviteLink $generateInviteLink): RedirectResponse
    {
        $url = $generateInviteLink->handle($request->user()->equipo);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Link de invitación generado.')]);
        Inertia::flash('inviteUrl', $url);

        return to_route('equipo.edit');
    }

    /**
     * Show the registration page for a user joining via a signed invite link.
     */
    public function show(Request $request, Equipo $equipo): Response
    {
        return Inertia::render('auth/register-invite', [
            'equipo' => $equipo->only(['id', 'nombre']),
            'expires' => $request->query('expires'),
            'signature' => $request->query('signature'),
            'passwordRules' => Password::defaults()->toPasswordRulesString(),
        ]);
    }
}
