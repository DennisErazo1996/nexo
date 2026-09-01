<?php

namespace Tests\Feature\Auth;

use App\Enums\Rol;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Fortify\Features;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->skipUnlessFortifyHas(Features::registration());
    }

    public function test_registration_screen_can_be_rendered()
    {
        $response = $this->get(route('register'));

        $response->assertOk();
    }

    public function test_new_users_can_register_and_create_an_equipo()
    {
        $response = $this->post(route('register.store'), [
            'nombres' => 'Test',
            'apellidos' => 'User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'telefono' => '99887766',
            'equipo_action' => 'create',
            'equipo' => ['nombre' => 'Grupo Test'],
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));

        $user = User::whereEmail('test@example.com')->firstOrFail();

        $this->assertSame('Grupo Test', $user->equipo->nombre);
        $this->assertTrue($user->rol === Rol::Admin);
        $this->assertSame('99887766', $user->telefono);
    }

    public function test_equipo_nombre_is_required_to_register()
    {
        $response = $this->post(route('register.store'), [
            'nombres' => 'Test',
            'apellidos' => 'User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'telefono' => '99887766',
            'equipo_action' => 'create',
        ]);

        $response->assertSessionHasErrors('equipo.nombre');
        $this->assertGuest();
    }

    public function test_telefono_is_required_to_register()
    {
        $response = $this->post(route('register.store'), [
            'nombres' => 'Test',
            'apellidos' => 'User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'equipo_action' => 'create',
            'equipo' => ['nombre' => 'Grupo Test'],
        ]);

        $response->assertSessionHasErrors('telefono');
        $this->assertGuest();
    }
}
