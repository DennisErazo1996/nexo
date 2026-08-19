import { Form, Head, usePage } from '@inertiajs/react';
import AgenteController from '@/actions/App/Http/Controllers/Equipo/AgenteController';
import EquipoController from '@/actions/App/Http/Controllers/Equipo/EquipoController';
import InvitationController from '@/actions/App/Http/Controllers/Equipo/InvitationController';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/equipo';
import type { Auth } from '@/types';

type Agente = {
    id: number;
    name: string;
    email: string;
    telefono: string | null;
    rol: 'admin' | 'agente';
};

type PageProps = {
    auth: Auth;
};

export default function EquipoEdit({
    equipo,
    agentes,
}: {
    equipo: { id: number; nombre: string };
    agentes: Agente[];
}) {
    const page = usePage<PageProps>();
    const { auth } = page.props;
    const inviteUrl = (page.flash as { inviteUrl?: string } | undefined)
        ?.inviteUrl;

    return (
        <>
            <Head title="Equipo" />

            <div className="space-y-6 p-4">
                <Heading
                    title="Equipo"
                    description="Gestiona el nombre de tu equipo y sus agentes"
                />

                {auth.isAdmin ? (
                    <Form
                        {...EquipoController.update.form()}
                        options={{ preserveScroll: true }}
                        className="max-w-md space-y-4"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="nombre">
                                        Nombre del equipo
                                    </Label>
                                    <Input
                                        id="nombre"
                                        name="nombre"
                                        defaultValue={equipo.nombre}
                                        required
                                    />
                                    {errors.nombre && (
                                        <p className="text-sm text-destructive">
                                            {errors.nombre}
                                        </p>
                                    )}
                                </div>
                                <Button disabled={processing}>Guardar</Button>
                            </>
                        )}
                    </Form>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        Equipo:{' '}
                        <span className="font-medium text-foreground">
                            {equipo.nombre}
                        </span>
                    </p>
                )}

                <div className="space-y-4">
                    <h3 className="text-base font-medium">Agentes</h3>

                    <div className="divide-y rounded-lg border">
                        {agentes.map((agente) => (
                            <div
                                key={agente.id}
                                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div>
                                    <p className="font-medium">{agente.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {agente.email}
                                        {agente.telefono
                                            ? ` · ${agente.telefono}`
                                            : ''}
                                    </p>
                                </div>

                                {auth.isAdmin ? (
                                    <div className="flex items-center gap-2">
                                        <Form
                                            {...AgenteController.update.form(
                                                agente.id,
                                            )}
                                            options={{ preserveScroll: true }}
                                        >
                                            {({ processing }) => (
                                                <select
                                                    name="rol"
                                                    defaultValue={agente.rol}
                                                    disabled={processing}
                                                    onChange={(event) =>
                                                        event.target.form?.requestSubmit()
                                                    }
                                                    className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                                                >
                                                    <option value="agente">
                                                        Agente
                                                    </option>
                                                    <option value="admin">
                                                        Admin
                                                    </option>
                                                </select>
                                            )}
                                        </Form>

                                        {agente.id !== auth.user.id && (
                                            <Form
                                                {...AgenteController.destroy.form(
                                                    agente.id,
                                                )}
                                                options={{
                                                    preserveScroll: true,
                                                }}
                                            >
                                                {({ processing }) => (
                                                    <Button
                                                        type="submit"
                                                        variant="destructive"
                                                        size="sm"
                                                        disabled={processing}
                                                    >
                                                        Eliminar
                                                    </Button>
                                                )}
                                            </Form>
                                        )}
                                    </div>
                                ) : (
                                    <Badge
                                        variant={
                                            agente.rol === 'admin'
                                                ? 'default'
                                                : 'secondary'
                                        }
                                    >
                                        {agente.rol === 'admin'
                                            ? 'Admin'
                                            : 'Agente'}
                                    </Badge>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {auth.isAdmin && (
                    <div className="space-y-4">
                        <h3 className="text-base font-medium">
                            Invitar agente
                        </h3>

                        <Form
                            {...InvitationController.store.form()}
                            options={{ preserveScroll: true }}
                        >
                            {({ processing }) => (
                                <Button disabled={processing}>
                                    Generar link de invitación
                                </Button>
                            )}
                        </Form>

                        {inviteUrl && (
                            <div className="grid max-w-xl gap-2">
                                <Label htmlFor="invite-url">
                                    Link de invitación (válido 7 días)
                                </Label>
                                <Input
                                    id="invite-url"
                                    readOnly
                                    value={inviteUrl}
                                    onFocus={(event) => event.target.select()}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

EquipoEdit.layout = {
    breadcrumbs: [
        {
            title: 'Equipo',
            href: edit(),
        },
    ],
};
