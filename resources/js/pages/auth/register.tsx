import { Form, Head } from '@inertiajs/react';
import { Building2, Lock, User } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';

type Props = {
    passwordRules: string;
};

export default function Register({ passwordRules }: Props) {
    return (
        <>
            <Head title="Registro de equipo y agente" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <input
                            type="hidden"
                            name="equipo_action"
                            value="create"
                        />

                        <div className="grid gap-5">
                            {/* Sección: Equipo / Inmobiliaria */}
                            <div className="rounded-lg border border-border/80 bg-card/60 p-4 space-y-3 shadow-xs">
                                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    <Building2 className="h-3.5 w-3.5 text-primary" />
                                    <span>Tu Inmobiliaria o Equipo</span>
                                </div>
                                <div className="grid gap-1.5">
                                    <Label htmlFor="equipo.nombre" className="text-sm font-medium">
                                        Nombre del equipo / agencia
                                    </Label>
                                    <Input
                                        id="equipo.nombre"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        name="equipo[nombre]"
                                        placeholder="ej. Inmobiliaria Los Pinos"
                                        className="h-10"
                                    />
                                    <InputError
                                        message={errors['equipo.nombre']}
                                        className="mt-1"
                                    />
                                </div>
                            </div>

                            {/* Sección: Datos Personales */}
                            <div className="rounded-lg border border-border/80 bg-card/60 p-4 space-y-3.5 shadow-xs">
                                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    <User className="h-3.5 w-3.5 text-primary" />
                                    <span>Datos del Administrador</span>
                                </div>

                                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="name" className="text-sm font-medium">
                                            Nombre completo
                                        </Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            required
                                            tabIndex={2}
                                            autoComplete="name"
                                            name="name"
                                            placeholder="Tu nombre y apellido"
                                            className="h-10"
                                        />
                                        <InputError
                                            message={errors.name}
                                            className="mt-1"
                                        />
                                    </div>

                                    <div className="grid gap-1.5">
                                        <Label htmlFor="telefono" className="text-sm font-medium">
                                            Celular / WhatsApp
                                        </Label>
                                        <Input
                                            id="telefono"
                                            type="tel"
                                            required
                                            tabIndex={3}
                                            autoComplete="tel"
                                            name="telefono"
                                            placeholder="ej. 99887766"
                                            className="h-10"
                                        />
                                        <InputError
                                            message={errors.telefono}
                                            className="mt-1"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="email" className="text-sm font-medium">
                                        Correo electrónico
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        tabIndex={4}
                                        autoComplete="email"
                                        name="email"
                                        placeholder="correo@ejemplo.com"
                                        className="h-10"
                                    />
                                    <InputError message={errors.email} className="mt-1" />
                                </div>
                            </div>

                            {/* Sección: Seguridad */}
                            <div className="rounded-lg border border-border/80 bg-card/60 p-4 space-y-3.5 shadow-xs">
                                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    <Lock className="h-3.5 w-3.5 text-primary" />
                                    <span>Seguridad</span>
                                </div>

                                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="password" className="text-sm font-medium">
                                            Contraseña
                                        </Label>
                                        <PasswordInput
                                            id="password"
                                            required
                                            tabIndex={5}
                                            autoComplete="new-password"
                                            name="password"
                                            placeholder="••••••••"
                                            passwordrules={passwordRules}
                                            className="h-10"
                                        />
                                        <InputError message={errors.password} className="mt-1" />
                                    </div>

                                    <div className="grid gap-1.5">
                                        <Label htmlFor="password_confirmation" className="text-sm font-medium">
                                            Confirmar contraseña
                                        </Label>
                                        <PasswordInput
                                            id="password_confirmation"
                                            required
                                            tabIndex={6}
                                            autoComplete="new-password"
                                            name="password_confirmation"
                                            placeholder="••••••••"
                                            passwordrules={passwordRules}
                                            className="h-10"
                                        />
                                        <InputError
                                            message={errors.password_confirmation}
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="mt-1 h-11 w-full text-sm font-semibold shadow-sm transition-all hover:shadow-md"
                                tabIndex={7}
                                disabled={processing}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner className="mr-2" />}
                                Crear cuenta y equipo
                            </Button>
                        </div>

                        <div className="pt-1 text-center text-sm text-muted-foreground">
                            ¿Ya tienes una cuenta registrada?{' '}
                            <TextLink href={login()} tabIndex={8} className="font-semibold text-primary underline-offset-4 hover:underline">
                                Inicia sesión
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: 'Crea tu cuenta',
    description: 'Registra a tu equipo inmobiliario para comenzar',
};
