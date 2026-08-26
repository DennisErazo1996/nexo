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

                        {/* Banner del equipo al que se une */}
                        <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3.5 text-sm">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                                <Building2 className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Invitación para unirte a:</p>
                                <p className="font-semibold text-foreground">{equipo.nombre}</p>
                            </div>
                        </div>

                        <div className="grid gap-5">
                            {/* Sección: Datos Personales */}
                            <div className="rounded-lg border border-border/80 bg-card/60 p-4 space-y-3.5 shadow-xs">
                                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    <User className="h-3.5 w-3.5 text-primary" />
                                    <span>Tus Datos de Agente</span>
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
                                            autoFocus
                                            tabIndex={1}
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
                                            tabIndex={2}
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
                                        tabIndex={3}
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
                                            tabIndex={4}
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
                                            tabIndex={5}
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

                            {errors.equipo_id && (
                                <InputError message={errors.equipo_id} />
                            )}

                            <Button
                                type="submit"
                                className="mt-1 h-11 w-full text-sm font-semibold shadow-sm transition-all hover:shadow-md"
                                tabIndex={6}
                                disabled={processing}
                            >
                                {processing && <Spinner className="mr-2" />}
                                Aceptar invitación y unirse
                            </Button>
                        </div>

                        <div className="pt-1 text-center text-sm text-muted-foreground">
                            ¿Ya tienes cuenta?{' '}
                            <TextLink href={login()} tabIndex={7} className="font-semibold text-primary underline-offset-4 hover:underline">
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
    description: 'Completa tus datos para unirte al equipo',
};
