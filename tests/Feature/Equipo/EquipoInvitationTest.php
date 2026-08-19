<?php

namespace Tests\Feature\Equipo;

use App\Enums\Rol;
use App\Models\Equipo;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

class EquipoInvitationTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_generate_invite_link()
    {
        $equipo = Equipo::factory()->create();
        $admin = User::factory()->admin()->forEquipo($equipo)->create();

        $response = $this->actingAs($admin)->post(route('equipo.invitaciones.store'));

        $response->assertSessionHasNoErrors();
        $response->assertRedirect(route('equipo.edit'));
    }

    public function test_agente_cannot_generate_invite_link()
    {
        $equipo = Equipo::factory()->create();
        $agente = User::factory()->forEquipo($equipo)->create();

        $response = $this->actingAs($agente)->post(route('equipo.invitaciones.store'));

        $response->assertForbidden();
    }

    public function test_user_can_register_via_valid_invite_link()
    {
        $equipo = Equipo::factory()->create();

        $url = URL::temporarySignedRoute('equipo.invitaciones.show', now()->addDays(7), ['equipo' => $equipo->id]);
        parse_str(parse_url($url, PHP_URL_QUERY), $query);

        $response = $this->post(route('register.store'), [
            'name' => 'New Agente',
            'email' => 'agente@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'telefono' => '99887766',
            'equipo_action' => 'join',
            'equipo_id' => $equipo->id,
            'expires' => $query['expires'],
            'signature' => $query['signature'],
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));

        $user = User::whereEmail('agente@example.com')->firstOrFail();

        $this->assertSame($equipo->id, $user->equipo_id);
        $this->assertTrue($user->rol === Rol::Agente);
        $this->assertSame('99887766', $user->telefono);
    }

    public function test_tampered_invite_link_is_rejected()
    {
        $equipo = Equipo::factory()->create();

        $response = $this->post(route('register.store'), [
            'name' => 'New Agente',
            'email' => 'agente@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'telefono' => '99887766',
            'equipo_action' => 'join',
            'equipo_id' => $equipo->id,
            'expires' => now()->addDays(7)->timestamp,
            'signature' => 'not-a-valid-signature',
        ]);

        $response->assertSessionHasErrors('equipo_id');
        $this->assertGuest();
    }

    public function test_expired_invite_link_is_rejected()
    {
        $equipo = Equipo::factory()->create();

        $url = URL::temporarySignedRoute('equipo.invitaciones.show', now()->subDay(), ['equipo' => $equipo->id]);
        parse_str(parse_url($url, PHP_URL_QUERY), $query);

        $response = $this->post(route('register.store'), [
            'name' => 'New Agente',
            'email' => 'agente@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'telefono' => '99887766',
            'equipo_action' => 'join',
            'equipo_id' => $equipo->id,
            'expires' => $query['expires'],
            'signature' => $query['signature'],
        ]);

        $response->assertSessionHasErrors('equipo_id');
        $this->assertGuest();
    }
}
