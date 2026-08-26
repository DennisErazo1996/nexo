import { Form, Head, Link } from '@inertiajs/react';
import {
    ArrowUpRight,
    Building2,
    Calendar,
    Check,
    Copy,
    CreditCard,
    FileText,
    HeartHandshake,
    ImageIcon,
    MapPin,
    Maximize2,
    MessageCircle,
    Navigation,
    Phone,
    Plus,
    Scale,
    Share2,
    Tag,
    Trash2,
    Upload,
    User,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import ClienteController from '@/actions/App/Http/Controllers/Cliente/ClienteController';
import PropiedadController from '@/actions/App/Http/Controllers/Propiedad/PropiedadController';
import PropiedadFotoController from '@/actions/App/Http/Controllers/PropiedadFoto/PropiedadFotoController';
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
import { Textarea } from '@/components/ui/textarea';
import { buildTextoCompartir } from '@/lib/texto-compartir';
import { cn } from '@/lib/utils';
import { index } from '@/routes/propiedades';
import type { Coincidencia } from '@/types/coincidencia';
import type { EnumOption, Propiedad } from '@/types/propiedad';

type Props = {
    propiedad: Propiedad;
    coincidencias: Coincidencia[];
    estados: EnumOption[];
    tipos: EnumOption[];
    unidadesMedida: EnumOption[];
    monedas: EnumOption[];
    formasPago: EnumOption[];
    condicionesLegales: EnumOption[];
};

const ESTADO_PROPIEDAD_STYLES: Record<
    string,
    { bg: string; text: string; border: string }
> = {
    disponible: {
        bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
        text: 'text-emerald-700 dark:text-emerald-300',
        border: 'border-emerald-200 dark:border-emerald-800/60',
    },
    reservada: {
        bg: 'bg-amber-500/10 dark:bg-amber-500/20',
        text: 'text-amber-700 dark:text-amber-300',
        border: 'border-amber-200 dark:border-amber-800/60',
    },
    vendida: {
        bg: 'bg-blue-500/10 dark:bg-blue-500/20',
        text: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-200 dark:border-blue-800/60',
    },
    retirada: {
        bg: 'bg-zinc-500/10 dark:bg-zinc-500/20',
        text: 'text-zinc-700 dark:text-zinc-300',
        border: 'border-zinc-200 dark:border-zinc-800/60',
    },
};

function getInitials(name: string): string {
    const parts = name.trim().split(/\s+/);

    if (parts.length === 0 || !parts[0]) {
        return 'AG';
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

export default function PropiedadShow({
    propiedad,
    coincidencias,
    estados,
    tipos,
    unidadesMedida,
    monedas,
    formasPago,
    condicionesLegales,
}: Props) {
    const [textoCompartir, setTextoCompartir] = useState<string | null>(null);
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
    const [copiedShareText, setCopiedShareText] = useState(false);
    const [selectedFilesCount, setSelectedFilesCount] = useState<number>(0);

    function generarTextoCompartir() {
        const texto = buildTextoCompartir(
            propiedad,
            tipos,
            unidadesMedida,
            monedas,
            formasPago,
            condicionesLegales,
        );
        setTextoCompartir(texto);
        setIsShareDialogOpen(true);
    }

    function copiarTextoCompartir() {
        if (textoCompartir) {
            void navigator.clipboard.writeText(textoCompartir);
            setCopiedShareText(true);
            setTimeout(() => setCopiedShareText(false), 2000);
        }
    }

    const currentEstadoStyle =
        ESTADO_PROPIEDAD_STYLES[propiedad.estado] ??
        ESTADO_PROPIEDAD_STYLES['disponible'];

    const fechaRegistro = new Date(propiedad.created_at).toLocaleDateString(
        'es-ES',
        {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        },
    );

    return (
        <>
            <Head title={`${propiedad.tipo} en ${propiedad.zona}`} />

            <div className="space-y-6 p-4 md:p-6 lg:p-8">
                {/* Hero Header */}
                <div className="flex flex-col gap-6 rounded-2xl border border-border/70 bg-card p-6 shadow-xs lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-4 sm:items-center">
                        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-xs">
                            <Building2 className="size-7" />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                    {propiedad.tipo} en {propiedad.zona}
                                </h1>

                                <Form
                                    {...PropiedadController.updateEstado.form(
                                        propiedad.id,
                                    )}
                                    options={{ preserveScroll: true }}
                                >
                                    {({ processing }) => (
                                        <div className="relative inline-flex items-center">
                                            <select
                                                name="estado"
                                                defaultValue={propiedad.estado}
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
                                                title="Cambiar estado del inventario"
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
                                <span className="text-lg font-bold text-foreground">
                                    {propiedad.moneda}{' '}
                                    {formatCurrency(propiedad.precio)}
                                </span>
                                <span className="text-muted-foreground/60">
                                    •
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="size-3.5" />
                                    Publicada el {fechaRegistro}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                        {propiedad.estado !== 'vendida' && (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="default"
                                        size="sm"
                                        className="h-9 gap-1.5 bg-emerald-600 px-3 text-xs font-medium text-white shadow-xs hover:bg-emerald-700"
                                    >
                                        <Check className="size-3.5" />
                                        Marcar como vendida
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            ¿Confirmar venta de la propiedad?
                                        </DialogTitle>
                                        <DialogDescription>
                                            El estado de la propiedad cambiará a
                                            "Vendida" y dejará de ofrecerse a
                                            nuevos clientes.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter className="gap-2 pt-2">
                                        <DialogClose asChild>
                                            <Button variant="secondary">
                                                Cancelar
                                            </Button>
                                        </DialogClose>
                                        <Form
                                            {...PropiedadController.updateEstado.form(
                                                propiedad.id,
                                            )}
                                            options={{
                                                preserveScroll: true,
                                            }}
                                        >
                                            {({ processing }) => (
                                                <>
                                                    <input
                                                        type="hidden"
                                                        name="estado"
                                                        value="vendida"
                                                    />
                                                    <Button
                                                        type="submit"
                                                        className="bg-emerald-600 text-white hover:bg-emerald-700"
                                                        disabled={processing}
                                                    >
                                                        Confirmar venta
                                                    </Button>
                                                </>
                                            )}
                                        </Form>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )}

                        {/* Compartir Ficha Modal Trigger */}
                        <Dialog
                            open={isShareDialogOpen}
                            onOpenChange={setIsShareDialogOpen}
                        >
                            <DialogTrigger asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={generarTextoCompartir}
                                    className="h-9 gap-1.5 border-primary/20 bg-primary/5 text-xs font-medium text-primary shadow-xs hover:bg-primary/10"
                                >
                                    <Share2 className="size-3.5" />
                                    Compartir ficha
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-lg">
                                <DialogHeader>
                                    <DialogTitle>
                                        Ficha comercial para compartir
                                    </DialogTitle>
                                    <DialogDescription>
                                        Texto estructurado y listo para enviar a
                                        clientes por WhatsApp o redes sociales.
                                    </DialogDescription>
                                </DialogHeader>

                                {textoCompartir && (
                                    <div className="space-y-4 pt-2">
                                        <Textarea
                                            readOnly
                                            rows={9}
                                            value={textoCompartir}
                                            className="bg-muted/40 font-mono text-xs leading-relaxed"
                                        />

                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <Button
                                                asChild
                                                variant="outline"
                                                size="sm"
                                                className="h-9 gap-1.5 border-emerald-300 bg-emerald-50 text-xs font-medium text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300"
                                            >
                                                <a
                                                    href={`https://wa.me/?text=${encodeURIComponent(textoCompartir)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <MessageCircle className="size-4 text-emerald-600 dark:text-emerald-400" />
                                                    Enviar por WhatsApp
                                                </a>
                                            </Button>

                                            <Button
                                                type="button"
                                                size="sm"
                                                onClick={copiarTextoCompartir}
                                                className="h-9 gap-1.5 text-xs"
                                            >
                                                {copiedShareText ? (
                                                    <>
                                                        <Check className="size-3.5" />
                                                        ¡Texto copiado!
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="size-3.5" />
                                                        Copiar texto
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* KPI Metrics Summary Bar */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="py-4 shadow-2xs">
                        <CardContent className="flex items-center justify-between px-5 py-0">
                            <div>
                                <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                    Precio
                                </p>
                                <p className="text-xl font-bold tracking-tight">
                                    {propiedad.moneda}{' '}
                                    {formatCurrency(propiedad.precio)}
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
                                    Superficie
                                </p>
                                <p className="text-xl font-bold tracking-tight">
                                    {propiedad.tamano} {propiedad.unidad_medida}
                                </p>
                            </div>
                            <div className="flex size-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                                <Maximize2 className="size-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="py-4 shadow-2xs">
                        <CardContent className="flex items-center justify-between px-5 py-0">
                            <div>
                                <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                    Clientes Coincidentes
                                </p>
                                <p className="text-xl font-bold tracking-tight">
                                    {coincidencias.length}
                                </p>
                            </div>
                            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                <Users className="size-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="py-4 shadow-2xs">
                        <CardContent className="flex items-center justify-between px-5 py-0">
                            <div>
                                <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                    Galería Multimedia
                                </p>
                                <p className="text-xl font-bold tracking-tight">
                                    {propiedad.fotos?.length ?? 0} fotos
                                </p>
                            </div>
                            <div className="flex size-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                                <ImageIcon className="size-5" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 2-Column Main Layout */}
                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
                    {/* Left Column: Property Details, Amenities & Assigned Co-Agents */}
                    <div className="space-y-6 lg:col-span-5">
                        {/* Characteristics & Technical Sheet */}
                        <Card className="shadow-2xs">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold">
                                    Ficha Técnica & Atributos
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Detalles y especificaciones del inmueble
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4 pt-0">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
                                        <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                                            <Maximize2 className="size-3" />
                                            Dimensión
                                        </span>
                                        <p className="mt-1 text-sm font-semibold text-foreground">
                                            {propiedad.tamano}{' '}
                                            {propiedad.unidad_medida}
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
                                        <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                                            <CreditCard className="size-3" />
                                            Forma de Pago
                                        </span>
                                        <p className="mt-1 text-sm font-semibold text-foreground capitalize">
                                            {propiedad.forma_pago}
                                        </p>
                                    </div>

                                    {propiedad.condicion_legal && (
                                        <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
                                            <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                                                <Scale className="size-3" />
                                                Condición Legal
                                            </span>
                                            <p className="mt-1 text-sm font-semibold text-foreground">
                                                {propiedad.condicion_legal}
                                            </p>
                                        </div>
                                    )}

                                    {propiedad.acceso && (
                                        <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
                                            <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                                                <Navigation className="size-3" />
                                                Tipo de Acceso
                                            </span>
                                            <p className="mt-1 text-sm font-semibold text-foreground">
                                                {propiedad.acceso}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Tags / Amenities */}
                                {propiedad.etiquetas &&
                                    propiedad.etiquetas.length > 0 && (
                                        <div className="space-y-2 pt-1">
                                            <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                                Etiquetas & Categorías
                                            </p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {propiedad.etiquetas.map(
                                                    (etiqueta) => (
                                                        <Badge
                                                            key={etiqueta.id}
                                                            variant="secondary"
                                                            className="text-xs"
                                                        >
                                                            {
                                                                etiqueta
                                                                    .etiqueta
                                                                    ?.nombre
                                                            }
                                                        </Badge>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}

                                {/* Description */}
                                {propiedad.descripcion && (
                                    <div className="space-y-1.5 border-t border-border/60 pt-3">
                                        <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                            Descripción del Inmueble
                                        </p>
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
                                            {propiedad.descripcion}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Co-Agents Card */}
                        <Card className="shadow-2xs">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold">
                                    Agentes Responsables
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Equipo a cargo de la comercialización
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-2.5 pt-0">
                                {propiedad.agentes &&
                                propiedad.agentes.length > 0 ? (
                                    propiedad.agentes.map((coAgente) => (
                                        <div
                                            key={coAgente.id}
                                            className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/20 p-3"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Avatar className="size-9 border border-primary/20 bg-primary/10 text-primary">
                                                    <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                                                        {getInitials(
                                                            coAgente.agente
                                                                ?.name ??
                                                                'Agente',
                                                        )}
                                                    </AvatarFallback>
                                                </Avatar>

                                                <div>
                                                    <p className="text-sm font-semibold text-foreground">
                                                        {coAgente.agente?.name}
                                                    </p>
                                                    {coAgente.porcentaje_comision && (
                                                        <p className="text-xs text-muted-foreground">
                                                            Comisión:{' '}
                                                            {
                                                                coAgente.porcentaje_comision
                                                            }
                                                            %
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {coAgente.agente?.telefono && (
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        asChild
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8 text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
                                                        title="WhatsApp"
                                                    >
                                                        <a
                                                            href={`https://wa.me/${cleanPhoneForWhatsApp(coAgente.agente.telefono)}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <MessageCircle className="size-4" />
                                                        </a>
                                                    </Button>
                                                    <Button
                                                        asChild
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8 text-sky-600 hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-sky-950/40"
                                                        title="Llamar"
                                                    >
                                                        <a
                                                            href={`tel:${cleanPhoneForTel(coAgente.agente.telefono)}`}
                                                        >
                                                            <Phone className="size-4" />
                                                        </a>
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-muted-foreground">
                                        Sin co-agentes asignados.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Photo Gallery & Potential Client Matches */}
                    <div className="space-y-6 lg:col-span-7">
                        {/* Photos Card */}
                        <Card className="shadow-2xs">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <CardTitle className="text-base font-semibold">
                                                Galería de Fotos
                                            </CardTitle>
                                            {propiedad.fotos &&
                                                propiedad.fotos.length > 0 && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="text-xs"
                                                    >
                                                        {propiedad.fotos.length}
                                                    </Badge>
                                                )}
                                        </div>
                                        <CardDescription className="text-xs">
                                            Imágenes con marca de agua oficial
                                            de Nexo
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4 pt-0">
                                {/* Photo Grid */}
                                {propiedad.fotos &&
                                propiedad.fotos.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                        {propiedad.fotos.map((foto) => (
                                            <div
                                                key={foto.id}
                                                className="group relative aspect-4/3 overflow-hidden rounded-xl border border-border/70 bg-muted/40"
                                            >
                                                <img
                                                    src={
                                                        foto.url_con_marca_agua
                                                    }
                                                    alt={`Foto de ${propiedad.tipo}`}
                                                    className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    loading="lazy"
                                                />

                                                <div className="absolute inset-0 flex items-start justify-end bg-gradient-to-t from-black/40 via-transparent to-black/30 p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                                    <Form
                                                        {...PropiedadFotoController.destroy.form(
                                                            [
                                                                propiedad.id,
                                                                foto.id,
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
                                                                variant="destructive"
                                                                disabled={
                                                                    processing
                                                                }
                                                                className="size-7 shadow-md"
                                                                title="Eliminar foto"
                                                            >
                                                                <Trash2 className="size-3.5" />
                                                            </Button>
                                                        )}
                                                    </Form>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 p-8 text-center">
                                        <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                            <ImageIcon className="size-5" />
                                        </div>
                                        <p className="text-sm font-medium text-foreground">
                                            Sin fotos registradas
                                        </p>
                                        <p className="mt-0.5 max-w-sm text-xs text-muted-foreground">
                                            Sube fotos de la propiedad para
                                            generar la galería y aplicar marcas
                                            de agua automáticas.
                                        </p>
                                    </div>
                                )}

                                {/* Photo Uploader Box */}
                                <Form
                                    {...PropiedadFotoController.store.form(
                                        propiedad.id,
                                    )}
                                    options={{ preserveScroll: true }}
                                    className="space-y-3 rounded-xl border border-border/70 bg-muted/20 p-3.5"
                                >
                                    {({ processing, errors }) => (
                                        <div className="space-y-3">
                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                <label className="relative flex cursor-pointer items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-xs font-medium shadow-2xs transition-colors hover:bg-accent hover:text-accent-foreground">
                                                    <Upload className="size-3.5 text-muted-foreground" />
                                                    <span>
                                                        {selectedFilesCount > 0
                                                            ? `${selectedFilesCount} foto(s) seleccionada(s)`
                                                            : 'Seleccionar fotos...'}
                                                    </span>
                                                    <input
                                                        name="fotos[]"
                                                        type="file"
                                                        multiple
                                                        accept="image/*"
                                                        className="sr-only"
                                                        onChange={(e) =>
                                                            setSelectedFilesCount(
                                                                e.target.files
                                                                    ?.length ??
                                                                    0,
                                                            )
                                                        }
                                                    />
                                                </label>

                                                <Button
                                                    type="submit"
                                                    size="sm"
                                                    disabled={
                                                        processing ||
                                                        selectedFilesCount === 0
                                                    }
                                                    className="h-8 gap-1.5 text-xs shadow-2xs"
                                                >
                                                    <Plus className="size-3.5" />
                                                    Subir fotos
                                                </Button>
                                            </div>

                                            <InputError
                                                message={errors.fotos}
                                            />
                                        </div>
                                    )}
                                </Form>
                            </CardContent>
                        </Card>

                        {/* Potential Clients (Coincidencias) Card */}
                        <Card className="shadow-2xs">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <CardTitle className="text-base font-semibold">
                                                Clientes Potenciales
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
                                            Clientes con intereses que coinciden
                                            con este inmueble
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-3 pt-0">
                                {coincidencias.length > 0 ? (
                                    <div className="space-y-2.5">
                                        {coincidencias.map((coincidencia) => (
                                            <div
                                                key={coincidencia.id}
                                                className="group flex flex-col justify-between gap-3 rounded-xl border border-border/70 bg-card p-3.5 transition-all hover:border-primary/30 hover:shadow-xs sm:flex-row sm:items-center"
                                            >
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        {coincidencia.cliente ? (
                                                            <Link
                                                                href={
                                                                    ClienteController.show(
                                                                        coincidencia
                                                                            .cliente
                                                                            .id,
                                                                    ).url
                                                                }
                                                                className="group/link inline-flex items-center gap-1 text-sm font-semibold text-foreground transition-colors hover:text-primary"
                                                            >
                                                                <span>
                                                                    {
                                                                        coincidencia
                                                                            .cliente
                                                                            .nombre
                                                                    }
                                                                </span>
                                                                <ArrowUpRight className="size-3.5 opacity-60 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 group-hover/link:opacity-100" />
                                                            </Link>
                                                        ) : (
                                                            <span className="text-sm font-semibold">
                                                                Cliente
                                                            </span>
                                                        )}

                                                        <Badge
                                                            variant="secondary"
                                                            className="text-[11px] capitalize"
                                                        >
                                                            {
                                                                coincidencia.estado
                                                            }
                                                        </Badge>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                                                        {coincidencia.cliente
                                                            ?.telefono && (
                                                            <span>
                                                                Tel:{' '}
                                                                {
                                                                    coincidencia
                                                                        .cliente
                                                                        .telefono
                                                                }
                                                            </span>
                                                        )}

                                                        {coincidencia.cliente
                                                            ?.agente_registro && (
                                                            <span>
                                                                Agente:{' '}
                                                                {
                                                                    coincidencia
                                                                        .cliente
                                                                        .agente_registro
                                                                        .name
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {coincidencia.cliente
                                                    ?.telefono && (
                                                    <div className="flex items-center gap-1.5">
                                                        <Button
                                                            asChild
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 gap-1 border-emerald-300/80 bg-emerald-50/70 text-xs font-medium text-emerald-700 shadow-2xs hover:bg-emerald-100 hover:text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300"
                                                        >
                                                            <a
                                                                href={`https://wa.me/${cleanPhoneForWhatsApp(coincidencia.cliente.telefono)}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                title="WhatsApp"
                                                            >
                                                                <MessageCircle className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                                                                WhatsApp
                                                            </a>
                                                        </Button>

                                                        <Button
                                                            asChild
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 gap-1 border-sky-300/80 bg-sky-50/70 text-xs font-medium text-sky-700 shadow-2xs hover:bg-sky-100 hover:text-sky-800 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-300"
                                                        >
                                                            <a
                                                                href={`tel:${cleanPhoneForTel(coincidencia.cliente.telefono)}`}
                                                                title="Llamar"
                                                            >
                                                                <Phone className="size-3.5 text-sky-600 dark:text-sky-400" />
                                                                Llamar
                                                            </a>
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 p-8 text-center">
                                        <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                            <HeartHandshake className="size-5" />
                                        </div>
                                        <p className="text-sm font-medium text-foreground">
                                            Sin clientes coincidentes
                                        </p>
                                        <p className="mt-0.5 max-w-sm text-xs text-muted-foreground">
                                            Cuando se registren clientes cuyos
                                            intereses coincidan con esta
                                            propiedad, aparecerán aquí
                                            automáticamente.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

PropiedadShow.layout = (props: Props) => ({
    breadcrumbs: [
        { title: 'Propiedades', href: index() },
        {
            title: `${props.propiedad.tipo} en ${props.propiedad.zona}`,
            href: index(),
        },
    ],
});
