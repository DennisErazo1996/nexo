import { Form, Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowUpRight,
    Building2,
    Calendar,
    Check,
    Copy,
    DollarSign,
    HeartHandshake,
    MapPin,
    MessageCircle,
    MessageSquare,
    Phone,
    Plus,
    Tag,
    Trash2,
    User,
    X,
} from 'lucide-react';
import { useState } from 'react';
import ClienteController from '@/actions/App/Http/Controllers/Cliente/ClienteController';
import ClienteInteresController from '@/actions/App/Http/Controllers/ClienteInteres/ClienteInteresController';
import CoincidenciaController from '@/actions/App/Http/Controllers/Coincidencia/CoincidenciaController';
import NotaSeguimientoController from '@/actions/App/Http/Controllers/NotaSeguimiento/NotaSeguimientoController';
import PropiedadController from '@/actions/App/Http/Controllers/Propiedad/PropiedadController';
import InputError from '@/components/input-error';
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
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { index } from '@/routes/clientes';
import type {
    Cliente,
    EstadoCliente,
    EstadoOption,
    EtiquetaInteres,
} from '@/types/cliente';
import type { Coincidencia, EstadoCoincidencia } from '@/types/coincidencia';

type Props = {
    cliente: Cliente;
    coincidencias: Coincidencia[];
    etiquetas: EtiquetaInteres[];
    estados: EstadoOption[];
    estadosCoincidencia: { value: EstadoCoincidencia; label: string }[];
};

const ESTADO_CLIENTE_STYLES: Record<
    EstadoCliente,
    { bg: string; text: string; border: string }
> = {
    nuevo: {
        bg: 'bg-blue-500/10 dark:bg-blue-500/20',
        text: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-200 dark:border-blue-800/60',
    },
    contactado: {
        bg: 'bg-amber-500/10 dark:bg-amber-500/20',
        text: 'text-amber-700 dark:text-amber-300',
        border: 'border-amber-200 dark:border-amber-800/60',
    },
    visitando: {
        bg: 'bg-purple-500/10 dark:bg-purple-500/20',
        text: 'text-purple-700 dark:text-purple-300',
        border: 'border-purple-200 dark:border-purple-800/60',
    },
    negociando: {
        bg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
        text: 'text-indigo-700 dark:text-indigo-300',
        border: 'border-indigo-200 dark:border-indigo-800/60',
    },
    cerrado: {
        bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
        text: 'text-emerald-700 dark:text-emerald-300',
        border: 'border-emerald-200 dark:border-emerald-800/60',
    },
    perdido: {
        bg: 'bg-zinc-500/10 dark:bg-zinc-500/20',
        text: 'text-zinc-700 dark:text-zinc-300',
        border: 'border-zinc-200 dark:border-zinc-800/60',
    },
};

function getInitials(name: string): string {
    const parts = name.trim().split(/\s+/);

    if (parts.length === 0 || !parts[0]) {
        return 'CL';
    }

    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function cleanPhoneForWhatsApp(phone: string): string {
    return phone.replace(/\D/g, '');
}

function cleanPhoneForTel(phone: string): string {
    return phone.replace(/[^\d+]/g, '');
}

function formatCurrency(amount: string | number | null | undefined): string {
    if (!amount) {
return '';
}

    const num = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (isNaN(num)) {
return String(amount);
}

    return num.toLocaleString('es-HN');
}

export default function ClienteShow({
    cliente,
    coincidencias,
    etiquetas,
    estados,
    estadosCoincidencia,
}: Props) {
    const { auth } = usePage().props;
    const [isInteresDialogOpen, setIsInteresDialogOpen] = useState(false);
    const [copiedPhone, setCopiedPhone] = useState(false);

    function copyPhone() {
        if (!cliente.telefono) {
return;
}

        void navigator.clipboard.writeText(cliente.telefono);
        setCopiedPhone(true);
        setTimeout(() => setCopiedPhone(false), 2000);
    }

    const currentEstadoStyle =
        ESTADO_CLIENTE_STYLES[cliente.estado] ?? ESTADO_CLIENTE_STYLES['nuevo'];

    const pendingCoincidenciasCount = coincidencias.filter(
        (c) => c.estado === 'pendiente',
    ).length;

    const fechaRegistro = new Date(cliente.created_at).toLocaleDateString(
        'es-ES',
        {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        },
    );

    return (
        <>
            <Head title={`${cliente.nombre} — Perfil de Cliente`} />

            <div className="space-y-6 p-4 md:p-6 lg:p-8">
                {/* Hero Header */}
                <div className="flex flex-col gap-6 rounded-2xl border border-border/70 bg-card p-6 shadow-xs lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-4 sm:items-center">
                        <Avatar className="size-14 border border-primary/20 bg-primary/10 text-primary">
                            <AvatarFallback className="bg-primary/10 text-lg font-bold text-primary">
                                {getInitials(cliente.nombre)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                    {cliente.nombre}
                                </h1>

                                <Form
                                    {...ClienteController.updateEstado.form(
                                        cliente.id,
                                    )}
                                    options={{ preserveScroll: true }}
                                >
                                    {({ processing }) => (
                                        <div className="relative inline-flex items-center">
                                            <select
                                                name="estado"
                                                defaultValue={cliente.estado}
                                                disabled={processing}
                                                onChange={(event) =>
                                                    event.target.form?.requestSubmit()
                                                }
                                                className={cn(
                                                    'h-7 cursor-pointer rounded-full border px-3 text-xs font-semibold tracking-wider uppercase transition-colors focus:ring-2 focus:ring-ring/40 focus:outline-hidden',
                                                    currentEstadoStyle.bg,
                                                    currentEstadoStyle.text,
                                                    currentEstadoStyle.border,
                                                )}
                                                title="Cambiar estado del pipeline"
                                            >
                                                {estados.map((estado) => (
                                                    <option
                                                        key={estado.value}
                                                        value={estado.value}
                                                        className="bg-popover text-xs text-popover-foreground"
                                                    >
                                                        {estado.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </Form>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                {cliente.agente_registro && (
                                    <span className="flex items-center gap-1">
                                        <User className="size-3.5" />
                                        Registrado por{' '}
                                        <strong className="font-medium text-foreground">
                                            {cliente.agente_registro.name}
                                        </strong>
                                    </span>
                                )}
                                <span className="flex items-center gap-1">
                                    <Calendar className="size-3.5" />
                                    {fechaRegistro}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Contact & Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                        {cliente.telefono && (
                            <>
                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className="h-9 gap-1.5 border-emerald-300/80 bg-emerald-50/70 text-xs font-medium text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/60"
                                >
                                    <a
                                        href={`https://wa.me/${cleanPhoneForWhatsApp(cliente.telefono)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="Abrir chat o llamada en WhatsApp"
                                    >
                                        <MessageCircle className="size-4 text-emerald-600 dark:text-emerald-400" />
                                        WhatsApp
                                    </a>
                                </Button>

                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className="h-9 gap-1.5 border-sky-300/80 bg-sky-50/70 text-xs font-medium text-sky-700 hover:bg-sky-100 hover:text-sky-800 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-300 dark:hover:bg-sky-900/60"
                                >
                                    <a
                                        href={`tel:${cleanPhoneForTel(cliente.telefono)}`}
                                        title="Llamar directamente"
                                    >
                                        <Phone className="size-4 text-sky-600 dark:text-sky-400" />
                                        Llamar
                                    </a>
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={copyPhone}
                                    className="h-9 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                                    title="Copiar número de teléfono"
                                >
                                    {copiedPhone ? (
                                        <>
                                            <Check className="size-4 text-emerald-600 dark:text-emerald-400" />
                                            <span className="text-emerald-600 dark:text-emerald-400">
                                                ¡Copiado!
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="size-4" />
                                            <span>{cliente.telefono}</span>
                                        </>
                                    )}
                                </Button>
                            </>
                        )}

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-9 gap-1.5 border-destructive/30 text-xs font-medium text-destructive hover:bg-destructive/10 hover:text-destructive"
                                    title="Eliminar cliente"
                                >
                                    <Trash2 className="size-4" />
                                    <span>Eliminar</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        ¿Eliminar cliente?
                                    </DialogTitle>
                                    <DialogDescription>
                                        Esta acción eliminará permanentemente al cliente "{cliente.nombre}", incluyendo todos sus intereses, notas de seguimiento y coincidencias asociadas.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="gap-2 pt-2">
                                    <DialogClose asChild>
                                        <Button variant="secondary">
                                            Cancelar
                                        </Button>
                                    </DialogClose>
                                    <Form
                                        {...ClienteController.destroy.form(
                                            cliente.id,
                                        )}
                                    >
                                        {({ processing }) => (
                                            <Button
                                                type="submit"
                                                variant="destructive"
                                                disabled={processing}
                                            >
                                                Eliminar cliente
                                            </Button>
                                        )}
                                    </Form>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* KPI Metrics Summary Bar */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Card className="py-4 shadow-2xs">
                        <CardContent className="flex items-center justify-between px-5 py-0">
                            <div>
                                <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                    Intereses
                                </p>
                                <p className="text-2xl font-bold tracking-tight">
                                    {cliente.intereses?.length ?? 0}
                                </p>
                            </div>
                            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <Tag className="size-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="py-4 shadow-2xs">
                        <CardContent className="flex items-center justify-between px-5 py-0">
                            <div>
                                <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                    Coincidencias
                                </p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold tracking-tight">
                                        {coincidencias.length}
                                    </span>
                                    {pendingCoincidenciasCount > 0 && (
                                        <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                                            ({pendingCoincidenciasCount}{' '}
                                            pendientes)
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                <Building2 className="size-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="py-4 shadow-2xs">
                        <CardContent className="flex items-center justify-between px-5 py-0">
                            <div>
                                <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                    Notas de Seguimiento
                                </p>
                                <p className="text-2xl font-bold tracking-tight">
                                    {cliente.notas?.length ?? 0}
                                </p>
                            </div>
                            <div className="flex size-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                                <MessageSquare className="size-5" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 2-Column Main Dashboard Layout */}
                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
                    {/* Left Column: Client Details & Interests */}
                    <div className="space-y-6 lg:col-span-4">
                        {/* Search Interests Card */}
                        <Card className="shadow-2xs">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                <div>
                                    <CardTitle className="text-base font-semibold">
                                        Intereses de Búsqueda
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Criterios para búsqueda de propiedades
                                    </CardDescription>
                                </div>
                                <Dialog
                                    open={isInteresDialogOpen}
                                    onOpenChange={setIsInteresDialogOpen}
                                >
                                    <DialogTrigger asChild>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-8 gap-1 px-2.5 text-xs shadow-2xs"
                                        >
                                            <Plus className="size-3.5" />
                                            Agregar
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>
                                                Agregar interés de búsqueda
                                            </DialogTitle>
                                            <DialogDescription>
                                                Define el tipo de inmueble, zona
                                                y rango presupuestario deseado.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <Form
                                            {...ClienteInteresController.store.form(
                                                cliente.id,
                                            )}
                                            resetOnSuccess
                                            onSuccess={() =>
                                                setIsInteresDialogOpen(false)
                                            }
                                            className="space-y-4 pt-2"
                                        >
                                            {({ processing, errors }) => (
                                                <>
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="etiqueta_id">
                                                            Tipo de Propiedad /
                                                            Etiqueta
                                                        </Label>
                                                        <select
                                                            id="etiqueta_id"
                                                            name="etiqueta_id"
                                                            required
                                                            className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring/40 focus:outline-hidden"
                                                        >
                                                            {etiquetas.map(
                                                                (etiqueta) => (
                                                                    <option
                                                                        key={
                                                                            etiqueta.id
                                                                        }
                                                                        value={
                                                                            etiqueta.id
                                                                        }
                                                                    >
                                                                        {
                                                                            etiqueta.nombre
                                                                        }
                                                                    </option>
                                                                ),
                                                            )}
                                                        </select>
                                                        <InputError
                                                            message={
                                                                errors.etiqueta_id
                                                            }
                                                        />
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <Label htmlFor="zona">
                                                            Zona de interés
                                                        </Label>
                                                        <Input
                                                            id="zona"
                                                            name="zona"
                                                            placeholder="Ej. Col. Palmira, Santa Rosa..."
                                                        />
                                                        <InputError
                                                            message={
                                                                errors.zona
                                                            }
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="grid gap-2">
                                                            <Label htmlFor="presupuesto_min">
                                                                Presupuesto mín.
                                                            </Label>
                                                            <Input
                                                                id="presupuesto_min"
                                                                name="presupuesto_min"
                                                                type="number"
                                                                placeholder="0"
                                                            />
                                                            <InputError
                                                                message={
                                                                    errors.presupuesto_min
                                                                }
                                                            />
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <Label htmlFor="presupuesto_max">
                                                                Presupuesto máx.
                                                            </Label>
                                                            <Input
                                                                id="presupuesto_max"
                                                                name="presupuesto_max"
                                                                type="number"
                                                                placeholder="Sin límite"
                                                            />
                                                            <InputError
                                                                message={
                                                                    errors.presupuesto_max
                                                                }
                                                            />
                                                        </div>
                                                    </div>

                                                    <DialogFooter className="pt-2">
                                                        <Button
                                                            type="submit"
                                                            disabled={
                                                                processing
                                                            }
                                                        >
                                                            Guardar interés
                                                        </Button>
                                                    </DialogFooter>
                                                </>
                                            )}
                                        </Form>
                                    </DialogContent>
                                </Dialog>
                            </CardHeader>

                            <CardContent className="space-y-2.5 pt-0">
                                {cliente.intereses &&
                                cliente.intereses.length > 0 ? (
                                    cliente.intereses.map((interes) => (
                                        <div
                                            key={interes.id}
                                            className="group relative flex flex-col justify-between gap-2 rounded-xl border border-border/60 bg-muted/20 p-3 transition-colors hover:border-border hover:bg-muted/40"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <Badge
                                                    variant="secondary"
                                                    className="font-semibold"
                                                >
                                                    {interes.etiqueta?.nombre}
                                                </Badge>

                                                <Form
                                                    {...ClienteInteresController.destroy.form(
                                                        [
                                                            cliente.id,
                                                            interes.id,
                                                        ],
                                                    )}
                                                    options={{
                                                        preserveScroll: true,
                                                    }}
                                                >
                                                    {({ processing }) => (
                                                        <Button
                                                            type="submit"
                                                            size="icon"
                                                            variant="ghost"
                                                            disabled={
                                                                processing
                                                            }
                                                            className="size-7 text-muted-foreground opacity-60 transition-opacity group-hover:opacity-100 hover:text-destructive"
                                                            title="Eliminar este interés"
                                                        >
                                                            <Trash2 className="size-3.5" />
                                                        </Button>
                                                    )}
                                                </Form>
                                            </div>

                                            <div className="space-y-1 text-xs text-muted-foreground">
                                                {interes.zona && (
                                                    <div className="flex items-center gap-1.5 font-medium text-foreground/90">
                                                        <MapPin className="size-3.5 shrink-0 text-muted-foreground" />
                                                        <span>
                                                            {interes.zona}
                                                        </span>
                                                    </div>
                                                )}

                                                {(interes.presupuesto_min ||
                                                    interes.presupuesto_max) && (
                                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                                        <DollarSign className="size-3.5 shrink-0" />
                                                        <span>
                                                            {interes.presupuesto_min
                                                                ? formatCurrency(
                                                                      interes.presupuesto_min,
                                                                  )
                                                                : '0'}{' '}
                                                            —{' '}
                                                            {interes.presupuesto_max
                                                                ? formatCurrency(
                                                                      interes.presupuesto_max,
                                                                  )
                                                                : 'Sin máx.'}
                                                        </span>
                                                    </div>
                                                )}

                                                {interes.agente && (
                                                    <p className="pt-0.5 text-[11px] text-muted-foreground/80">
                                                        Agregado por{' '}
                                                        {interes.agente.name}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 p-6 text-center">
                                        <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                            <Tag className="size-5" />
                                        </div>
                                        <p className="text-sm font-medium text-foreground">
                                            Sin intereses registrados
                                        </p>
                                        <p className="mt-0.5 max-w-xs text-xs text-muted-foreground">
                                            Agrega un interés para que Nexo
                                            pueda encontrar propiedades
                                            coincidentes automáticamente.
                                        </p>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                setIsInteresDialogOpen(true)
                                            }
                                            className="mt-3.5 h-8 text-xs"
                                        >
                                            <Plus className="mr-1 size-3.5" />
                                            Agregar primer interés
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Matched Properties & Tracking Notes Timeline */}
                    <div className="space-y-6 lg:col-span-8">
                        {/* Coincidencias / Potential Properties */}
                        <Card className="shadow-2xs">
                            <CardHeader className="flex flex-row items-center justify-between pb-3">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-base font-semibold">
                                            Propiedades Coincidentes
                                        </CardTitle>
                                        {coincidencias.length > 0 && (
                                            <Badge
                                                variant="secondary"
                                                className="text-xs"
                                            >
                                                {coincidencias.length}
                                            </Badge>
                                        )}
                                    </div>
                                    <CardDescription className="text-xs">
                                        Propiedades del equipo que coinciden con
                                        los criterios de búsqueda
                                    </CardDescription>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-3 pt-0">
                                {coincidencias.length > 0 ? (
                                    <div className="space-y-2.5">
                                        {coincidencias.map((coincidencia) => (
                                            <div
                                                key={coincidencia.id}
                                                className="group flex flex-col justify-between gap-3 rounded-xl border border-border/70 bg-card p-4 transition-all hover:border-primary/30 hover:shadow-xs sm:flex-row sm:items-center"
                                            >
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        {coincidencia.propiedad ? (
                                                            <Link
                                                                href={
                                                                    PropiedadController.show(
                                                                        coincidencia
                                                                            .propiedad
                                                                            .id,
                                                                    ).url
                                                                }
                                                                className="group/link inline-flex items-center gap-1 text-sm font-semibold text-foreground transition-colors hover:text-primary"
                                                            >
                                                                <span>
                                                                    {
                                                                        coincidencia
                                                                            .propiedad
                                                                            .tipo
                                                                    }{' '}
                                                                    en{' '}
                                                                    {
                                                                        coincidencia
                                                                            .propiedad
                                                                            .zona
                                                                    }
                                                                </span>
                                                                <ArrowUpRight className="size-3.5 opacity-60 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 group-hover/link:opacity-100" />
                                                            </Link>
                                                        ) : (
                                                            <span className="text-sm font-semibold">
                                                                Propiedad
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                                                        {coincidencia.propiedad && (
                                                            <span className="font-semibold text-foreground">
                                                                {
                                                                    coincidencia
                                                                        .propiedad
                                                                        .moneda
                                                                }{' '}
                                                                {formatCurrency(
                                                                    coincidencia
                                                                        .propiedad
                                                                        .precio,
                                                                )}
                                                            </span>
                                                        )}

                                                        {coincidencia.propiedad
                                                            ?.agentes &&
                                                            coincidencia
                                                                .propiedad
                                                                .agentes
                                                                .length > 0 && (
                                                                <span>
                                                                    Agente:{' '}
                                                                    {coincidencia.propiedad.agentes
                                                                        .map(
                                                                            (
                                                                                a,
                                                                            ) =>
                                                                                a
                                                                                    .agente
                                                                                    ?.name,
                                                                        )
                                                                        .filter(
                                                                            Boolean,
                                                                        )
                                                                        .join(
                                                                            ', ',
                                                                        )}
                                                                </span>
                                                            )}
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-2">
                                                    {coincidencia.estado ===
                                                    'pendiente' ? (
                                                        <>
                                                            <Badge
                                                                variant="outline"
                                                                className="border-amber-300 bg-amber-50 text-xs font-medium text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300"
                                                            >
                                                                Pendiente
                                                            </Badge>

                                                            <Form
                                                                {...CoincidenciaController.updateEstado.form(
                                                                    coincidencia.id,
                                                                )}
                                                                options={{
                                                                    preserveScroll: true,
                                                                }}
                                                            >
                                                                {({
                                                                    processing,
                                                                }) => (
                                                                    <>
                                                                        <input
                                                                            type="hidden"
                                                                            name="estado"
                                                                            value="notificado"
                                                                        />
                                                                        <Button
                                                                            type="submit"
                                                                            size="sm"
                                                                            disabled={
                                                                                processing
                                                                            }
                                                                            className="h-8 gap-1 bg-emerald-600 px-2.5 text-xs text-white hover:bg-emerald-700"
                                                                        >
                                                                            <Check className="size-3.5" />
                                                                            Notificado
                                                                        </Button>
                                                                    </>
                                                                )}
                                                            </Form>

                                                            <Form
                                                                {...CoincidenciaController.updateEstado.form(
                                                                    coincidencia.id,
                                                                )}
                                                                options={{
                                                                    preserveScroll: true,
                                                                }}
                                                            >
                                                                {({
                                                                    processing,
                                                                }) => (
                                                                    <>
                                                                        <input
                                                                            type="hidden"
                                                                            name="estado"
                                                                            value="descartado"
                                                                        />
                                                                        <Button
                                                                            type="submit"
                                                                            variant="outline"
                                                                            size="sm"
                                                                            disabled={
                                                                                processing
                                                                            }
                                                                            className="h-8 px-2 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                                                            title="Descartar coincidencia"
                                                                        >
                                                                            <X className="size-3.5" />
                                                                        </Button>
                                                                    </>
                                                                )}
                                                            </Form>
                                                        </>
                                                    ) : (
                                                        <Form
                                                            {...CoincidenciaController.updateEstado.form(
                                                                coincidencia.id,
                                                            )}
                                                            options={{
                                                                preserveScroll: true,
                                                            }}
                                                        >
                                                            {({
                                                                processing,
                                                            }) => (
                                                                <select
                                                                    name="estado"
                                                                    defaultValue={
                                                                        coincidencia.estado
                                                                    }
                                                                    disabled={
                                                                        processing
                                                                    }
                                                                    onChange={(
                                                                        event,
                                                                    ) =>
                                                                        event.target.form?.requestSubmit()
                                                                    }
                                                                    className="h-8 rounded-md border border-input bg-background px-2.5 text-xs font-medium capitalize focus:ring-2 focus:ring-ring/40 focus:outline-hidden"
                                                                >
                                                                    {estadosCoincidencia
                                                                        .filter(
                                                                            (
                                                                                e,
                                                                            ) =>
                                                                                e.value !==
                                                                                'pendiente',
                                                                        )
                                                                        .map(
                                                                            (
                                                                                estado,
                                                                            ) => (
                                                                                <option
                                                                                    key={
                                                                                        estado.value
                                                                                    }
                                                                                    value={
                                                                                        estado.value
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        estado.label
                                                                                    }
                                                                                </option>
                                                                            ),
                                                                        )}
                                                                </select>
                                                            )}
                                                        </Form>
                                                    )}

                                                    {auth.isAdmin && (
                                                        <Form
                                                            {...CoincidenciaController.destroy.form(
                                                                coincidencia.id,
                                                            )}
                                                            options={{
                                                                preserveScroll: true,
                                                            }}
                                                        >
                                                            {({ processing }) => (
                                                                <Button
                                                                    type="submit"
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    disabled={
                                                                        processing
                                                                    }
                                                                    className="size-8 text-muted-foreground opacity-60 hover:text-destructive hover:opacity-100"
                                                                    title="Eliminar coincidencia"
                                                                >
                                                                    <Trash2 className="size-3.5" />
                                                                </Button>
                                                            )}
                                                        </Form>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 p-8 text-center">
                                        <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                            <HeartHandshake className="size-5" />
                                        </div>
                                        <p className="text-sm font-medium text-foreground">
                                            Sin propiedades coincidentes
                                        </p>
                                        <p className="mt-0.5 max-w-sm text-xs text-muted-foreground">
                                            Cuando se registren propiedades en
                                            el inventario que encajen con los
                                            intereses del cliente, aparecerán
                                            aquí automáticamente.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Seguimiento y Notas Feed */}
                        <Card className="shadow-2xs">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-base font-semibold">
                                            Notas de Seguimiento
                                        </CardTitle>
                                        <CardDescription className="text-xs">
                                            Historial de llamadas, visitas y
                                            acuerdos con el cliente
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-6 pt-0">
                                {/* Note Composer */}
                                <Form
                                    {...NotaSeguimientoController.store.form(
                                        cliente.id,
                                    )}
                                    resetOnSuccess
                                    options={{ preserveScroll: true }}
                                    className="space-y-3 rounded-xl border border-border/70 bg-muted/20 p-3.5"
                                >
                                    {({ processing, errors }) => (
                                        <div className="space-y-3">
                                            {coincidencias.length > 0 && (
                                                <div className="grid gap-1.5">
                                                    <Label
                                                        htmlFor="propiedad_id"
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        Vincular a propiedad
                                                        (opcional)
                                                    </Label>
                                                    <select
                                                        id="propiedad_id"
                                                        name="propiedad_id"
                                                        className="h-8 rounded-md border border-input bg-background px-2.5 text-xs focus:ring-2 focus:ring-ring/40 focus:outline-hidden"
                                                    >
                                                        <option value="">
                                                            General (sin
                                                            propiedad
                                                            específica)
                                                        </option>
                                                        {coincidencias.map(
                                                            (c) =>
                                                                c.propiedad && (
                                                                    <option
                                                                        key={
                                                                            c
                                                                                .propiedad
                                                                                .id
                                                                        }
                                                                        value={
                                                                            c
                                                                                .propiedad
                                                                                .id
                                                                        }
                                                                    >
                                                                        {
                                                                            c
                                                                                .propiedad
                                                                                .tipo
                                                                        }{' '}
                                                                        en{' '}
                                                                        {
                                                                            c
                                                                                .propiedad
                                                                                .zona
                                                                        }{' '}
                                                                        (
                                                                        {
                                                                            c
                                                                                .propiedad
                                                                                .moneda
                                                                        }{' '}
                                                                        {formatCurrency(
                                                                            c
                                                                                .propiedad
                                                                                .precio,
                                                                        )}
                                                                        )
                                                                    </option>
                                                                ),
                                                        )}
                                                    </select>
                                                </div>
                                            )}

                                            <div className="space-y-1.5">
                                                <Textarea
                                                    name="texto"
                                                    placeholder="Escribe una nota sobre llamadas, reuniones, preferencias o acuerdos..."
                                                    required
                                                    rows={2}
                                                    className="min-h-[70px] resize-y bg-background text-sm"
                                                />
                                                <InputError
                                                    message={errors.texto}
                                                />
                                            </div>

                                            <div className="flex justify-end">
                                                <Button
                                                    type="submit"
                                                    size="sm"
                                                    disabled={processing}
                                                    className="h-8 gap-1 text-xs"
                                                >
                                                    <Plus className="size-3.5" />
                                                    Guardar nota
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </Form>

                                {/* Notes Timeline Feed */}
                                <div className="space-y-3">
                                    {cliente.notas &&
                                    cliente.notas.length > 0 ? (
                                        <div className="space-y-3">
                                            {cliente.notas.map((nota) => (
                                                <div
                                                    key={nota.id}
                                                    className="relative flex gap-3 rounded-xl border border-border/60 bg-card p-4 transition-colors hover:border-border"
                                                >
                                                    <Avatar className="size-8 shrink-0 border border-primary/20 bg-primary/10 text-primary">
                                                        <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                                                            {getInitials(
                                                                nota.agente
                                                                    ?.name ??
                                                                    'Agente',
                                                            )}
                                                        </AvatarFallback>
                                                    </Avatar>

                                                    <div className="flex-1 space-y-1.5">
                                                        <div className="flex flex-wrap items-center justify-between gap-1">
                                                            <span className="text-xs font-semibold text-foreground">
                                                                {nota.agente
                                                                    ?.name ??
                                                                    'Agente'}
                                                            </span>
                                                            <span className="text-[11px] text-muted-foreground">
                                                                {new Date(
                                                                    nota.created_at,
                                                                ).toLocaleDateString(
                                                                    'es-ES',
                                                                    {
                                                                        day: 'numeric',
                                                                        month: 'short',
                                                                        year: 'numeric',
                                                                        hour: '2-digit',
                                                                        minute: '2-digit',
                                                                    },
                                                                )}
                                                            </span>
                                                        </div>

                                                        {nota.propiedad && (
                                                            <div>
                                                                <Link
                                                                    href={
                                                                        PropiedadController.show(
                                                                            nota
                                                                                .propiedad
                                                                                .id,
                                                                        ).url
                                                                    }
                                                                    className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground transition-colors hover:bg-muted/80"
                                                                >
                                                                    <Building2 className="size-3 text-muted-foreground" />
                                                                    <span>
                                                                        {
                                                                            nota
                                                                                .propiedad
                                                                                .tipo
                                                                        }{' '}
                                                                        en{' '}
                                                                        {
                                                                            nota
                                                                                .propiedad
                                                                                .zona
                                                                        }
                                                                    </span>
                                                                </Link>
                                                            </div>
                                                        )}

                                                        <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
                                                            {nota.texto}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 p-8 text-center">
                                            <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                                <MessageSquare className="size-5" />
                                            </div>
                                            <p className="text-sm font-medium text-foreground">
                                                Sin notas registradas
                                            </p>
                                            <p className="mt-0.5 max-w-sm text-xs text-muted-foreground">
                                                Registra acuerdos, llamadas o
                                                comentarios sobre el cliente
                                                para mantener al equipo
                                                sincronizado.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

ClienteShow.layout = (props: Props) => ({
    breadcrumbs: [
        { title: 'Clientes', href: index() },
        { title: props.cliente.nombre, href: index() },
    ],
});
