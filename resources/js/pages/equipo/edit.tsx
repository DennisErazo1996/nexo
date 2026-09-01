import { Form, Head, usePage } from '@inertiajs/react';
import {
    Building2,
    Calendar,
    Check,
    Clock,
    Copy,
    Crown,
    Mail,
    Phone,
    Search,
    Share2,
    ShieldCheck,
    Trash2,
    User,
    UserCheck,
    UserPlus,
    Users,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import AgenteController from '@/actions/App/Http/Controllers/Equipo/AgenteController';
import EquipoController from '@/actions/App/Http/Controllers/Equipo/EquipoController';
import InvitationController from '@/actions/App/Http/Controllers/Equipo/InvitationController';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn, copyToClipboard } from '@/lib/utils';
import { edit } from '@/routes/equipo';
import type { Auth } from '@/types';

type Agente = {
    id: number;
    name: string;
    email: string;
    telefono: string | null;
    rol: 'admin' | 'agente';
    created_at?: string;
    clientes_registrados_count?: number;
    propiedad_agentes_count?: number;
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

    const [searchQuery, setSearchQuery] = useState('');
    const [rolFilter, setRolFilter] = useState<'todos' | 'admin' | 'agente'>(
        'todos',
    );
    const [copied, setCopied] = useState(false);

    // Helpers
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .filter(Boolean)
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handleCopyInvite = async (url: string) => {
        const success = await copyToClipboard(url);
        if (success) {
            setCopied(true);
            toast.success('Enlace de invitación copiado al portapapeles');
            setTimeout(() => setCopied(false), 2500);
        } else {
            toast.error('No se pudo copiar el enlace automáticamente');
        }
    };

    // Filtered Agents
    const filteredAgentes = useMemo(() => {
        return agentes.filter((agente) => {
            const matchesSearch =
                agente.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                agente.email
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                (agente.telefono &&
                    agente.telefono
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()));

            const matchesRole =
                rolFilter === 'todos' ? true : agente.rol === rolFilter;

            return matchesSearch && matchesRole;
        });
    }, [agentes, searchQuery, rolFilter]);

    // Metrics
    const totalMembers = agentes.length;
    const totalAdmins = agentes.filter((a) => a.rol === 'admin').length;
    const totalAgents = agentes.filter((a) => a.rol === 'agente').length;

    return (
        <>
            <Head title={`Equipo - ${equipo.nombre}`} />

            <div className="space-y-6 p-4 md:p-6 lg:p-8">
                {/* Hero Header */}
                <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-xs">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-xs">
                                <Users className="size-7" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                        {equipo.nombre}
                                    </h1>
                                    <Badge
                                        variant="secondary"
                                        className="text-xs font-semibold"
                                    >
                                        {totalMembers} miembro
                                        {totalMembers === 1 ? '' : 's'}
                                    </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Administra los miembros, roles, enlaces de
                                    invitación y configuración de tu equipo
                                    inmobiliario.
                                </p>
                            </div>
                        </div>

                        {auth.isAdmin && (
                            <Form
                                {...InvitationController.store.form()}
                                options={{ preserveScroll: true }}
                            >
                                {({ processing }) => (
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="gap-2 shadow-2xs"
                                    >
                                        <UserPlus className="size-4" />
                                        <span>Invitar nuevo agente</span>
                                    </Button>
                                )}
                            </Form>
                        )}
                    </div>
                </div>

                {/* Key Metrics Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Card className="p-4 py-4 shadow-2xs">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">
                                    Total de Miembros
                                </p>
                                <p className="mt-1 text-2xl font-bold text-foreground">
                                    {totalMembers}
                                </p>
                            </div>
                            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <Users className="size-5" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 py-4 shadow-2xs">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">
                                    Administradores
                                </p>
                                <p className="mt-1 text-2xl font-bold text-foreground">
                                    {totalAdmins}
                                </p>
                            </div>
                            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                <ShieldCheck className="size-5" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 py-4 shadow-2xs">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">
                                    Agentes Comerciales
                                </p>
                                <p className="mt-1 text-2xl font-bold text-foreground">
                                    {totalAgents}
                                </p>
                            </div>
                            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <UserCheck className="size-5" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left & Middle: Agents Directory (2 columns on large) */}
                    <div className="space-y-6 lg:col-span-2">
                        <Card className="shadow-2xs">
                            <CardHeader className="border-b border-border/60 pb-4">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <CardTitle className="text-base font-semibold">
                                            Directorio de Agentes
                                        </CardTitle>
                                        <CardDescription className="text-xs">
                                            Lista de integrantes activos con
                                            acceso al panel
                                        </CardDescription>
                                    </div>

                                    {/* Role quick filter buttons */}
                                    <div className="flex items-center gap-1 rounded-lg border bg-muted/40 p-1 text-xs">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setRolFilter('todos')
                                            }
                                            className={cn(
                                                'rounded-md px-2.5 py-1 font-medium transition-colors',
                                                rolFilter === 'todos'
                                                    ? 'bg-background text-foreground shadow-xs'
                                                    : 'text-muted-foreground hover:text-foreground',
                                            )}
                                        >
                                            Todos ({totalMembers})
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setRolFilter('admin')
                                            }
                                            className={cn(
                                                'rounded-md px-2.5 py-1 font-medium transition-colors',
                                                rolFilter === 'admin'
                                                    ? 'bg-background text-foreground shadow-xs'
                                                    : 'text-muted-foreground hover:text-foreground',
                                            )}
                                        >
                                            Admins ({totalAdmins})
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setRolFilter('agente')
                                            }
                                            className={cn(
                                                'rounded-md px-2.5 py-1 font-medium transition-colors',
                                                rolFilter === 'agente'
                                                    ? 'bg-background text-foreground shadow-xs'
                                                    : 'text-muted-foreground hover:text-foreground',
                                            )}
                                        >
                                            Agentes ({totalAgents})
                                        </button>
                                    </div>
                                </div>

                                {/* Search bar */}
                                <div className="relative mt-2">
                                    <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Buscar por nombre, correo o teléfono..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="h-9 bg-muted/20 pl-9 text-xs shadow-2xs"
                                    />
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={() => setSearchQuery('')}
                                            className="absolute top-2.5 right-2.5 text-muted-foreground hover:text-foreground"
                                        >
                                            <X className="size-4" />
                                        </button>
                                    )}
                                </div>
                            </CardHeader>

                            <CardContent className="p-0">
                                {filteredAgentes.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center p-12 text-center">
                                        <div className="flex size-12 items-center justify-center rounded-full bg-muted/50 text-muted-foreground">
                                            <Users className="size-6" />
                                        </div>
                                        <p className="mt-3 text-sm font-medium text-foreground">
                                            No se encontraron agentes
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Intenta ajustar el término de
                                            búsqueda o el filtro de rol.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-border/60">
                                        {filteredAgentes.map((agente) => {
                                            const isCurrentUser =
                                                agente.id === auth.user.id;

                                            return (
                                                <div
                                                    key={agente.id}
                                                    className="flex flex-col gap-4 p-4 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between"
                                                >
                                                    {/* Agent Info */}
                                                    <div className="flex items-start gap-3.5">
                                                        <Avatar className="size-10 border border-border/80 font-semibold shadow-2xs">
                                                            <AvatarFallback
                                                                className={cn(
                                                                    'text-xs font-bold',
                                                                    agente.rol ===
                                                                        'admin'
                                                                        ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
                                                                        : 'bg-primary/10 text-primary',
                                                                )}
                                                            >
                                                                {getInitials(
                                                                    agente.name,
                                                                )}
                                                            </AvatarFallback>
                                                        </Avatar>

                                                        <div className="space-y-1">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <span className="font-semibold text-foreground">
                                                                    {
                                                                        agente.name
                                                                    }
                                                                </span>

                                                                {isCurrentUser && (
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="border-primary/30 bg-primary/5 px-1.5 py-0 text-[10px] font-medium text-primary"
                                                                    >
                                                                        Tú
                                                                    </Badge>
                                                                )}

                                                                {agente.rol ===
                                                                'admin' ? (
                                                                    <Badge
                                                                        variant="secondary"
                                                                        className="gap-1 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
                                                                    >
                                                                        <Crown className="size-3" />
                                                                        Admin
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="gap-1 px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                                                                    >
                                                                        <User className="size-3" />
                                                                        Agente
                                                                    </Badge>
                                                                )}
                                                            </div>

                                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                                                                <a
                                                                    href={`mailto:${agente.email}`}
                                                                    className="inline-flex items-center gap-1 hover:text-foreground hover:underline"
                                                                >
                                                                    <Mail className="size-3 text-muted-foreground/70" />
                                                                    <span>
                                                                        {
                                                                            agente.email
                                                                        }
                                                                    </span>
                                                                </a>

                                                                {agente.telefono && (
                                                                    <a
                                                                        href={`tel:${agente.telefono}`}
                                                                        className="inline-flex items-center gap-1 hover:text-foreground hover:underline"
                                                                    >
                                                                        <Phone className="size-3 text-muted-foreground/70" />
                                                                        <span>
                                                                            {
                                                                                agente.telefono
                                                                            }
                                                                        </span>
                                                                    </a>
                                                                )}

                                                                {agente.created_at && (
                                                                    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/80">
                                                                        <Calendar className="size-3 text-muted-foreground/60" />
                                                                        <span>
                                                                            Ingresó
                                                                            el{' '}
                                                                            {new Date(
                                                                                agente.created_at,
                                                                            ).toLocaleDateString()}
                                                                        </span>
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {/* Activity counts pills */}
                                                            {(agente.clientes_registrados_count !==
                                                                undefined ||
                                                                agente.propiedad_agentes_count !==
                                                                    undefined) && (
                                                                <div className="flex items-center gap-2 pt-0.5 text-[11px] text-muted-foreground">
                                                                    <span className="rounded-md bg-muted/60 px-2 py-0.5 font-medium">
                                                                        <strong className="text-foreground">
                                                                            {agente.clientes_registrados_count ??
                                                                                0}
                                                                        </strong>{' '}
                                                                        clientes
                                                                    </span>
                                                                    <span className="rounded-md bg-muted/60 px-2 py-0.5 font-medium">
                                                                        <strong className="text-foreground">
                                                                            {agente.propiedad_agentes_count ??
                                                                                0}
                                                                        </strong>{' '}
                                                                        propiedades
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Actions (Admin only) */}
                                                    {auth.isAdmin && (
                                                        <div className="flex items-center gap-2 self-end sm:self-center">
                                                            {/* Role Switcher Form */}
                                                            <Form
                                                                {...AgenteController.update.form(
                                                                    agente.id,
                                                                )}
                                                                options={{
                                                                    preserveScroll: true,
                                                                }}
                                                            >
                                                                {({
                                                                    processing,
                                                                }) => (
                                                                    <select
                                                                        name="rol"
                                                                        defaultValue={
                                                                            agente.rol
                                                                        }
                                                                        disabled={
                                                                            processing
                                                                        }
                                                                        onChange={(
                                                                            event,
                                                                        ) =>
                                                                            event.target.form?.requestSubmit()
                                                                        }
                                                                        className="h-8.5 rounded-lg border border-input bg-card px-2.5 text-xs font-medium shadow-2xs transition-colors focus:ring-2 focus:ring-ring/40 focus:outline-hidden"
                                                                        title="Cambiar rol del agente"
                                                                    >
                                                                        <option value="agente">
                                                                            Rol:
                                                                            Agente
                                                                        </option>
                                                                        <option value="admin">
                                                                            Rol:
                                                                            Admin
                                                                        </option>
                                                                    </select>
                                                                )}
                                                            </Form>

                                                            {/* Delete Button with Confirmation Dialog */}
                                                            {!isCurrentUser && (
                                                                <Dialog>
                                                                    <DialogTrigger
                                                                        asChild
                                                                    >
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="size-8.5 text-muted-foreground opacity-70 hover:bg-destructive/10 hover:text-destructive hover:opacity-100"
                                                                            title="Eliminar agente del equipo"
                                                                        >
                                                                            <Trash2 className="size-4" />
                                                                        </Button>
                                                                    </DialogTrigger>
                                                                    <DialogContent>
                                                                        <DialogHeader>
                                                                            <DialogTitle>
                                                                                ¿Eliminar
                                                                                a{' '}
                                                                                {
                                                                                    agente.name
                                                                                }

                                                                                ?
                                                                            </DialogTitle>
                                                                            <DialogDescription>
                                                                                Esta
                                                                                acción
                                                                                desvinculará
                                                                                al
                                                                                agente
                                                                                del
                                                                                equipo
                                                                                y
                                                                                revocará
                                                                                de
                                                                                inmediato
                                                                                su
                                                                                acceso
                                                                                al
                                                                                panel
                                                                                comercial
                                                                                y
                                                                                registros
                                                                                asociados.
                                                                            </DialogDescription>
                                                                        </DialogHeader>
                                                                        <DialogFooter className="gap-2 pt-2">
                                                                            <DialogClose
                                                                                asChild
                                                                            >
                                                                                <Button variant="secondary">
                                                                                    Cancelar
                                                                                </Button>
                                                                            </DialogClose>
                                                                            <Form
                                                                                {...AgenteController.destroy.form(
                                                                                    agente.id,
                                                                                )}
                                                                                options={{
                                                                                    preserveScroll: true,
                                                                                }}
                                                                            >
                                                                                {({
                                                                                    processing,
                                                                                }) => (
                                                                                    <Button
                                                                                        type="submit"
                                                                                        variant="destructive"
                                                                                        disabled={
                                                                                            processing
                                                                                        }
                                                                                    >
                                                                                        Eliminar
                                                                                        miembro
                                                                                    </Button>
                                                                                )}
                                                                            </Form>
                                                                        </DialogFooter>
                                                                    </DialogContent>
                                                                </Dialog>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: Team Settings & Invitations (1 column on large) */}
                    <div className="space-y-6">
                        {/* Team Name Settings Card */}
                        <Card className="shadow-2xs">
                            <CardHeader className="pb-3">
                                <div className="flex items-center gap-2">
                                    <Building2 className="size-4.5 text-primary" />
                                    <CardTitle className="text-base font-semibold">
                                        Datos del Equipo
                                    </CardTitle>
                                </div>
                                <CardDescription className="text-xs">
                                    Identificador y nombre público de la
                                    organización
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4 pt-1">
                                {auth.isAdmin ? (
                                    <Form
                                        {...EquipoController.update.form()}
                                        options={{ preserveScroll: true }}
                                        className="space-y-4"
                                    >
                                        {({ processing, errors }) => (
                                            <>
                                                <div className="grid gap-2">
                                                    <Label
                                                        htmlFor="nombre"
                                                        className="text-xs font-medium"
                                                    >
                                                        Nombre comercial
                                                    </Label>
                                                    <Input
                                                        id="nombre"
                                                        name="nombre"
                                                        defaultValue={
                                                            equipo.nombre
                                                        }
                                                        placeholder="Ej: Inmobiliaria Nexo"
                                                        required
                                                        className="h-9 bg-card text-xs shadow-2xs"
                                                    />
                                                    {errors.nombre && (
                                                        <p className="text-xs text-destructive">
                                                            {errors.nombre}
                                                        </p>
                                                    )}
                                                </div>

                                                <Button
                                                    disabled={processing}
                                                    size="sm"
                                                    className="w-full shadow-2xs"
                                                >
                                                    Actualizar nombre
                                                </Button>
                                            </>
                                        )}
                                    </Form>
                                ) : (
                                    <div className="space-y-1.5 rounded-lg border bg-muted/30 p-3.5">
                                        <p className="text-xs text-muted-foreground">
                                            Nombre actual:
                                        </p>
                                        <p className="text-sm font-semibold text-foreground">
                                            {equipo.nombre}
                                        </p>
                                        <p className="text-[11px] text-muted-foreground/80">
                                            Solo los administradores del equipo
                                            pueden cambiar este nombre.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Invite Card (Admin only) */}
                        {auth.isAdmin && (
                            <Card className="overflow-hidden border-primary/20 bg-primary/5 shadow-2xs dark:border-primary/30 dark:bg-primary/5">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                            <Share2 className="size-4" />
                                        </div>
                                        <CardTitle className="text-base font-semibold">
                                            Enlace de Invitación
                                        </CardTitle>
                                    </div>
                                    <CardDescription className="text-xs">
                                        Genera un link de registro seguro para
                                        nuevos agentes
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-4 pt-1">
                                    <Form
                                        {...InvitationController.store.form()}
                                        options={{ preserveScroll: true }}
                                    >
                                        {({ processing }) => (
                                            <Button
                                                type="submit"
                                                variant="outline"
                                                size="sm"
                                                disabled={processing}
                                                className="w-full gap-2 border-primary/30 bg-background/80 shadow-2xs hover:bg-background"
                                            >
                                                <UserPlus className="size-3.5 text-primary" />
                                                <span>
                                                    {inviteUrl
                                                        ? 'Generar nuevo enlace'
                                                        : 'Generar enlace de invitación'}
                                                </span>
                                            </Button>
                                        )}
                                    </Form>

                                    {inviteUrl && (
                                        <div className="space-y-3 rounded-xl border border-border/80 bg-background p-3.5 shadow-xs">
                                            <div className="flex items-center justify-between">
                                                <Label
                                                    htmlFor="invite-url"
                                                    className="text-xs font-semibold text-foreground"
                                                >
                                                    Enlace generado
                                                </Label>
                                                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                                                    <Clock className="size-3" />
                                                    Válido 7 días
                                                </span>
                                            </div>

                                            <div className="relative flex items-center gap-2">
                                                <Input
                                                    id="invite-url"
                                                    readOnly
                                                    value={inviteUrl}
                                                    onFocus={(event) =>
                                                        event.target.select()
                                                    }
                                                    className="h-9 bg-muted/40 pr-10 font-mono text-xs select-all"
                                                />
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="secondary"
                                                    onClick={() =>
                                                        handleCopyInvite(
                                                            inviteUrl,
                                                        )
                                                    }
                                                    className="size-9 shrink-0 shadow-2xs"
                                                    title="Copiar enlace"
                                                >
                                                    {copied ? (
                                                        <Check className="size-4 text-emerald-600" />
                                                    ) : (
                                                        <Copy className="size-4" />
                                                    )}
                                                </Button>
                                            </div>

                                            <p className="text-[11px] leading-relaxed text-muted-foreground">
                                                Comparte este enlace por
                                                WhatsApp o correo con el agente
                                                para que configure su cuenta y
                                                contraseña.
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
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
