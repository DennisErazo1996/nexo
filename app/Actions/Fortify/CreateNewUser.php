<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Enums\Rol;
use App\Models\Equipo;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user, either creating a new
     * equipo (the user becomes its admin) or joining one via an invite link.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        return ($input['equipo_action'] ?? 'create') === 'join'
            ? $this->createViaInvite($input)
            : $this->createWithNewEquipo($input);
    }

    /**
     * Create a new equipo and register its first user as admin.
     *
     * @param  array<string, mixed>  $input
     */
    private function createWithNewEquipo(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
            'telefono' => $this->telefonoRules(),
            'equipo.nombre' => ['required', 'string', 'max:255'],
        ])->validate();

        return DB::transaction(function () use ($input): User {
            $equipo = Equipo::create(['nombre' => $input['equipo']['nombre']]);

            return User::create([
                'nombres' => $input['nombres'],
                'apellidos' => $input['apellidos'],
                'email' => $input['email'],
                'password' => $input['password'],
                'telefono' => $input['telefono'],
                'equipo_id' => $equipo->id,
                'rol' => Rol::Admin,
            ]);
        });
    }

    /**
     * Register a new agente joining an existing equipo via a signed invite link.
     *
     * @param  array<string, string>  $input
     */
    private function createViaInvite(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
            'telefono' => $this->telefonoRules(),
            'equipo_id' => ['required', 'integer', 'exists:equipos,id'],
            'expires' => ['required'],
            'signature' => ['required', 'string'],
        ])->validate();

        if (! $this->hasValidInviteSignature($input)) {
            throw ValidationException::withMessages([
                'equipo_id' => __('Este link de invitación no es válido o ha expirado.'),
            ]);
        }

        return User::create([
            'nombres' => $input['nombres'],
            'apellidos' => $input['apellidos'],
            'email' => $input['email'],
            'password' => $input['password'],
            'telefono' => $input['telefono'],
            'equipo_id' => $input['equipo_id'],
            'rol' => Rol::Agente,
        ]);
    }

    /**
     * Verify the invite's signature against the signed invitation route.
     *
     * @param  array<string, string>  $input
     */
    private function hasValidInviteSignature(array $input): bool
    {
        $url = route('equipo.invitaciones.show', ['equipo' => $input['equipo_id']]).'?'.http_build_query([
            'expires' => $input['expires'],
            'signature' => $input['signature'],
        ]);

        return Request::create($url)->hasValidSignature();
    }
}
