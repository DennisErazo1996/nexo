import { Form, Head } from '@inertiajs/react';
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
    equipo: { id: number; nombre: string };
    expires: string;
    signature: string;
    passwordRules: string;
};

export default function RegisterInvite({
    equipo,
    expires,
    signature,
    passwordRules,
}: Props) {
    return (
        <>
            <Head title="Unirse a equipo" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <input
                                type="hidden"
                                name="equipo_action"
                                value="join"
                            />
                            <input
                                type="hidden"
                                name="equipo_id"
                                value={equipo.id}
                            />
                            <input
                                type="hidden"
                                name="expires"
                                value={expires}
                            />
                            <input
                                type="hidden"
                                name="signature"
                                value={signature}
                            />

                            <p className="text-sm text-muted-foreground">
                                Te unirás a{' '}
                                <span className="font-medium text-foreground">
                                    {equipo.nombre}
                                </span>
                            </p>

                            <div className="grid gap-2">
                                <Label htmlFor="name">Nombre</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Nombre completo"
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">
                                    Correo electrónico
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="telefono">Celular</Label>
                                <Input
                                    id="telefono"
                                    type="tel"
                                    required
                                    tabIndex={3}
                                    autoComplete="tel"
                                    name="telefono"
                                    placeholder="Número de celular"
                                />
                                <InputError message={errors.telefono} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <PasswordInput
                                    id="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Contraseña"
                                    passwordrules={passwordRules}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    Confirmar contraseña
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    tabIndex={5}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Confirmar contraseña"
                                    passwordrules={passwordRules}
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            {errors.equipo_id && (
                                <InputError message={errors.equipo_id} />
                            )}

                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                tabIndex={6}
                            >
                                {processing && <Spinner />}
                                Crear cuenta
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            ¿Ya tienes cuenta?{' '}
                            <TextLink href={login()} tabIndex={7}>
                                Inicia sesión
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

RegisterInvite.layout = {
    title: 'Únete a un equipo',
    description: 'Ingresa tus datos para unirte al equipo',
};
