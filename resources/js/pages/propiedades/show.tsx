import { Form, Head, Link } from '@inertiajs/react';
import {
    ArrowUpRight,
    Building2,
    Calendar,
    Check,
    Copy,
    CreditCard,
    Eye,
    HeartHandshake,
    ImageIcon,
    Loader2,
    Maximize2,
    MessageCircle,
    Navigation,
    Pencil,
    Phone,
    Plus,
    Scale,
    Share2,
    Tag,
    Trash2,
    Upload,
    Users,
    X,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import ClienteController from '@/actions/App/Http/Controllers/Cliente/ClienteController';
import PropiedadController from '@/actions/App/Http/Controllers/Propiedad/PropiedadController';
import PropiedadFotoController from '@/actions/App/Http/Controllers/PropiedadFoto/PropiedadFotoController';
import { ImageLightbox } from '@/components/image-lightbox';
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
import { buildTextoCompartir } from '@/lib/texto-compartir';
import {
    cn,
    copyToClipboard,
    formatCondicionLegal,
    formatFormaPago,
    formatMunicipio,
    formatTipoPropiedad,
} from '@/lib/utils';
import {
    compartirFotosPropiedad,
    isWebShareFotosSupported,
} from '@/lib/web-share-fotos';
import { index } from '@/routes/propiedades';
import type { Coincidencia } from '@/types/coincidencia';
import type { EnumOption, MunicipioOption, Propiedad } from '@/types/propiedad';

type Agente = {
    id: number;
    name: string;
};

type EtiquetaInteres = {
    id: number;
    nombre: string;
};

type Props = {
    propiedad: Propiedad;
    coincidencias: Coincidencia[];
    creadorId?: number;
    etiquetas?: EtiquetaInteres[];
    agentes?: Agente[];
    estados: EnumOption[];
    tipos: EnumOption[];
    unidadesMedida: EnumOption[];
    monedas: EnumOption[];
    formasPago: EnumOption[];
    condicionesLegales: EnumOption[];
    municipios: MunicipioOption[];
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
    const cleaned = phone.replace(/[^0-9]/g, '');

    if (cleaned.length === 8) {
        return `504${cleaned}`;
    }

    return cleaned;
}

function cleanPhoneForTel(phone: string): string {
    return phone.replace(/[^0-9+]/g, '');
}

function formatCurrency(amount: string | number): string {
    const num = Number(amount);

    if (isNaN(num)) {
        return `${amount}`;
    }

    return num.toLocaleString('es-HN');
}

export default function PropiedadShow({
    propiedad,
    coincidencias,
    creadorId,
    etiquetas = [],
    agentes = [],
    estados,
    tipos,
    unidadesMedida,
    monedas,
    formasPago,
    condicionesLegales,
    municipios,
}: Props) {
    const [textoCompartir, setTextoCompartir] = useState<string | null>(null);
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
    const [webShareFotosSupported] = useState(isWebShareFotosSupported);
    const [isSharingFotos, setIsSharingFotos] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [copiedShareText, setCopiedShareText] = useState(false);
    const fotosInputRef = useRef<HTMLInputElement>(null);
    const [fotos, setFotos] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [editTipo, setEditTipo] = useState<string>(propiedad.tipo);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    function onFotosChange(event: React.ChangeEvent<HTMLInputElement>) {
        const files = event.target.files ? Array.from(event.target.files) : [];
        previews.forEach((src) => URL.revokeObjectURL(src));
        setFotos(files);
        setPreviews(files.map((file) => URL.createObjectURL(file)));
    }

    function removeFoto(index: number) {
        const nextFotos = fotos.filter((_, i) => i !== index);
        URL.revokeObjectURL(previews[index]);
        const nextPreviews = previews.filter((_, i) => i !== index);

        const dataTransfer = new DataTransfer();
        nextFotos.forEach((file) => dataTransfer.items.add(file));
        if (fotosInputRef.current) {
            fotosInputRef.current.files = dataTransfer.files;
        }

        setFotos(nextFotos);
        setPreviews(nextPreviews);
    }

    function clearFotos() {
        previews.forEach((src) => URL.revokeObjectURL(src));
        setFotos([]);
        setPreviews([]);
        if (fotosInputRef.current) {
            fotosInputRef.current.value = '';
        }
    }

    const esCarroEdit = editTipo === 'carro';
    const areaTerreno = propiedad.area_terreno ?? propiedad.tamano;

    const resolvedCreadorId = creadorId ?? propiedad.agentes?.[0]?.agente_id;
    const creadorAgente =
        propiedad.agentes?.find((a) => a.agente_id === resolvedCreadorId)
            ?.agente ?? propiedad.agentes?.[0]?.agente;

    const initialEtiquetas =
        propiedad.etiquetas?.map((e) => e.etiqueta_id) ?? [];
    const initialAgentes =
        propiedad.agentes
            ?.filter((a) => a.agente_id !== resolvedCreadorId)
            .map((a) => a.agente_id) ?? [];

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

    async function copiarTextoCompartir() {
        if (textoCompartir) {
            const success = await copyToClipboard(textoCompartir);
            if (success) {
                setCopiedShareText(true);
                setTimeout(() => setCopiedShareText(false), 2000);
            }
        }
    }

    async function compartirFotos() {
        if (!propiedad.fotos || propiedad.fotos.length === 0) {
            return;
        }

        setIsSharingFotos(true);

        try {
            const resultado = await compartirFotosPropiedad(propiedad.fotos, {
                propiedadId: propiedad.id,
                titulo: `${formatTipoPropiedad(propiedad.tipo)} en ${formatMunicipio(propiedad.zona)}`,
            });

            if (resultado === 'unsupported') {
                toast.error('Este navegador no puede compartir estas fotos');
            }
        } catch {
            toast.error('No se pudieron compartir las fotos');
        } finally {
            setIsSharingFotos(false);
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
            <Head
                title={`${formatTipoPropiedad(propiedad.tipo)} en ${formatMunicipio(propiedad.zona)}`}
            />

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
                                    {formatTipoPropiedad(propiedad.tipo)} en{' '}
                                    {formatMunicipio(propiedad.zona)}
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
                        {/* Edit Property Modal Trigger */}
                        <Dialog
                            open={isEditDialogOpen}
                            onOpenChange={setIsEditDialogOpen}
                        >
                            <DialogTrigger asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-9 gap-1.5 border-border bg-background text-xs font-medium shadow-xs hover:bg-muted"
                                >
                                    <Pencil className="size-3.5 text-primary" />
                                    <span>Editar propiedad</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>
                                        Editar Ficha de la Propiedad
                                    </DialogTitle>
                                    <DialogDescription>
                                        Modifica los datos principales,
                                        especificaciones técnicas,
                                        características y agentes responsables.
                                    </DialogDescription>
                                </DialogHeader>

                                <Form
                                    {...PropiedadController.update.form(
                                        propiedad.id,
                                    )}
                                    options={{
                                        preserveScroll: true,
                                    }}
                                    onSuccess={() => setIsEditDialogOpen(false)}
                                    className="space-y-5 pt-2"
                                >
                                    {({ processing, errors }) => (
                                        <>
                                            {/* Section 1: Datos Principales */}
                                            <div className="space-y-3">
                                                <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                                    1. Datos Principales &
                                                    Ubicación
                                                </h3>
                                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                    <div className="grid gap-1.5">
                                                        <Label
                                                            htmlFor="edit-tipo"
                                                            className="text-xs font-medium"
                                                        >
                                                            Tipo de Propiedad *
                                                        </Label>
                                                        <select
                                                            id="edit-tipo"
                                                            name="tipo"
                                                            value={editTipo}
                                                            onChange={(event) =>
                                                                setEditTipo(
                                                                    event.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="h-9 rounded-md border border-input bg-card px-3 text-xs shadow-2xs focus:ring-2 focus:ring-ring/40 focus:outline-hidden"
                                                        >
                                                            {tipos.map(
                                                                (tipo) => (
                                                                    <option
                                                                        key={
                                                                            tipo.value
                                                                        }
                                                                        value={
                                                                            tipo.value
                                                                        }
                                                                    >
                                                                        {
                                                                            tipo.label
                                                                        }
                                                                    </option>
                                                                ),
                                                            )}
                                                        </select>
                                                        <InputError
                                                            message={
                                                                errors.tipo
                                                            }
                                                        />
                                                    </div>

                                                    <div className="grid gap-1.5">
                                                        <Label
                                                            htmlFor="edit-zona"
                                                            className="text-xs font-medium"
                                                        >
                                                            Municipio /
                                                            Ubicación *
                                                        </Label>
                                                        <select
                                                            id="edit-zona"
                                                            name="zona"
                                                            defaultValue={
                                                                propiedad.zona
                                                            }
                                                            required
                                                            className="h-9 rounded-md border border-input bg-background px-3 text-xs shadow-2xs focus:ring-2 focus:ring-ring/40 focus:outline-hidden"
                                                        >
                                                            {municipios.map(
                                                                (m) => (
                                                                    <option
                                                                        key={
                                                                            m.value
                                                                        }
                                                                        value={
                                                                            m.value
                                                                        }
                                                                    >
                                                                        {
                                                                            m.label
                                                                        }{' '}
                                                                        (
                                                                        {
                                                                            m.departamento
                                                                        }
                                                                        )
                                                                    </option>
                                                                ),
                                                            )}
                                                        </select>
                                                        <InputError
                                                            message={
                                                                errors.zona
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                    <div className="grid gap-1.5">
                                                        <Label
                                                            htmlFor="edit-precio"
                                                            className="text-xs font-medium"
                                                        >
                                                            Precio *
                                                        </Label>
                                                        <Input
                                                            id="edit-precio"
                                                            name="precio"
                                                            type="number"
                                                            step="any"
                                                            defaultValue={
                                                                propiedad.precio
                                                            }
                                                            className="h-9 text-xs shadow-2xs"
                                                            required
                                                        />
                                                        <InputError
                                                            message={
                                                                errors.precio
                                                            }
                                                        />
                                                    </div>

                                                    <div className="grid gap-1.5">
                                                        <Label
                                                            htmlFor="edit-moneda"
                                                            className="text-xs font-medium"
                                                        >
                                                            Moneda *
                                                        </Label>
                                                        <select
                                                            id="edit-moneda"
                                                            name="moneda"
                                                            defaultValue={
                                                                propiedad.moneda
                                                            }
                                                            className="h-9 rounded-md border border-input bg-card px-3 text-xs shadow-2xs focus:ring-2 focus:ring-ring/40 focus:outline-hidden"
                                                        >
                                                            {monedas.map(
                                                                (moneda) => (
                                                                    <option
                                                                        key={
                                                                            moneda.value
                                                                        }
                                                                        value={
                                                                            moneda.value
                                                                        }
                                                                    >
                                                                        {
                                                                            moneda.label
                                                                        }{' '}
                                                                        (
                                                                        {
                                                                            moneda.value
                                                                        }
                                                                        )
                                                                    </option>
                                                                ),
                                                            )}
                                                        </select>
                                                        <InputError
                                                            message={
                                                                errors.moneda
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Section 2: Dimensiones & Ficha Técnica */}
                                            <div className="space-y-3 border-t border-border/60 pt-3">
                                                <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                                    2. Ficha Técnica &
                                                    Dimensiones
                                                </h3>
                                                {!esCarroEdit && (
                                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                                        <div className="grid gap-1.5">
                                                            <Label
                                                                htmlFor="edit-area-terreno"
                                                                className="text-xs font-medium"
                                                            >
                                                                Área de Terreno
                                                                *
                                                            </Label>
                                                            <Input
                                                                id="edit-area-terreno"
                                                                name="area_terreno"
                                                                type="number"
                                                                step="any"
                                                                defaultValue={
                                                                    propiedad.area_terreno ??
                                                                    propiedad.tamano
                                                                }
                                                                className="h-9 text-xs shadow-2xs"
                                                                required
                                                            />
                                                            <InputError
                                                                message={
                                                                    errors.area_terreno
                                                                }
                                                            />
                                                        </div>

                                                        <div className="grid gap-1.5">
                                                            <Label
                                                                htmlFor="edit-area-construccion"
                                                                className="text-xs font-medium"
                                                            >
                                                                Área de
                                                                Construcción
                                                            </Label>
                                                            <Input
                                                                id="edit-area-construccion"
                                                                name="area_construccion"
                                                                type="number"
                                                                step="any"
                                                                defaultValue={
                                                                    propiedad.area_construccion ??
                                                                    ''
                                                                }
                                                                placeholder="Opcional"
                                                                className="h-9 text-xs shadow-2xs"
                                                            />
                                                            <InputError
                                                                message={
                                                                    errors.area_construccion
                                                                }
                                                            />
                                                        </div>

                                                        <div className="grid gap-1.5">
                                                            <Label
                                                                htmlFor="edit-unidad"
                                                                className="text-xs font-medium"
                                                            >
                                                                Unidad de Medida
                                                                *
                                                            </Label>
                                                            <select
                                                                id="edit-unidad"
                                                                name="unidad_medida"
                                                                defaultValue={
                                                                    propiedad.unidad_medida ??
                                                                    ''
                                                                }
                                                                className="h-9 rounded-md border border-input bg-card px-3 text-xs shadow-2xs focus:ring-2 focus:ring-ring/40 focus:outline-hidden"
                                                            >
                                                                {unidadesMedida.map(
                                                                    (u) => (
                                                                        <option
                                                                            key={
                                                                                u.value
                                                                            }
                                                                            value={
                                                                                u.value
                                                                            }
                                                                        >
                                                                            {
                                                                                u.label
                                                                            }
                                                                        </option>
                                                                    ),
                                                                )}
                                                            </select>
                                                            <InputError
                                                                message={
                                                                    errors.unidad_medida
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                    <div className="grid gap-1.5">
                                                        <Label
                                                            htmlFor="edit-forma-pago"
                                                            className="text-xs font-medium"
                                                        >
                                                            Forma de Pago *
                                                        </Label>
                                                        <select
                                                            id="edit-forma-pago"
                                                            name="forma_pago"
                                                            defaultValue={
                                                                propiedad.forma_pago
                                                            }
                                                            className="h-9 rounded-md border border-input bg-card px-3 text-xs shadow-2xs focus:ring-2 focus:ring-ring/40 focus:outline-hidden"
                                                        >
                                                            {formasPago.map(
                                                                (fp) => (
                                                                    <option
                                                                        key={
                                                                            fp.value
                                                                        }
                                                                        value={
                                                                            fp.value
                                                                        }
                                                                    >
                                                                        {
                                                                            fp.label
                                                                        }
                                                                    </option>
                                                                ),
                                                            )}
                                                        </select>
                                                        <InputError
                                                            message={
                                                                errors.forma_pago
                                                            }
                                                        />
                                                    </div>

                                                    <div className="grid gap-1.5">
                                                        <Label
                                                            htmlFor="edit-condicion-legal"
                                                            className="text-xs font-medium"
                                                        >
                                                            Condición Legal
                                                        </Label>
                                                        <select
                                                            id="edit-condicion-legal"
                                                            name="condicion_legal"
                                                            defaultValue={
                                                                propiedad.condicion_legal ??
                                                                ''
                                                            }
                                                            className="h-9 rounded-md border border-input bg-card px-3 text-xs shadow-2xs focus:ring-2 focus:ring-ring/40 focus:outline-hidden"
                                                        >
                                                            <option value="">
                                                                No especificada
                                                            </option>
                                                            {condicionesLegales.map(
                                                                (cl) => (
                                                                    <option
                                                                        key={
                                                                            cl.value
                                                                        }
                                                                        value={
                                                                            cl.value
                                                                        }
                                                                    >
                                                                        {
                                                                            cl.label
                                                                        }
                                                                    </option>
                                                                ),
                                                            )}
                                                        </select>
                                                        <InputError
                                                            message={
                                                                errors.condicion_legal
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                {!esCarroEdit && (
                                                    <div className="grid gap-1.5">
                                                        <Label
                                                            htmlFor="edit-acceso"
                                                            className="text-xs font-medium"
                                                        >
                                                            Tipo de Acceso
                                                        </Label>
                                                        <Input
                                                            id="edit-acceso"
                                                            name="acceso"
                                                            defaultValue={
                                                                propiedad.acceso ??
                                                                ''
                                                            }
                                                            placeholder="Ej: Calle pavimentada principal, calle de tierra 200m..."
                                                            className="h-9 text-xs shadow-2xs"
                                                        />
                                                        <InputError
                                                            message={
                                                                errors.acceso
                                                            }
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Section 3: Descripción */}
                                            <div className="space-y-3 border-t border-border/60 pt-3">
                                                <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                                    3. Descripción del Inmueble
                                                </h3>
                                                <div className="grid gap-1.5">
                                                    <Textarea
                                                        id="edit-descripcion"
                                                        name="descripcion"
                                                        rows={3}
                                                        defaultValue={
                                                            propiedad.descripcion ??
                                                            ''
                                                        }
                                                        placeholder="Detalles adicionales, distribución de espacios, cercanías..."
                                                        className="text-xs leading-relaxed"
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.descripcion
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            {/* Section 4: Etiquetas / Características */}
                                            {!esCarroEdit &&
                                                etiquetas &&
                                                etiquetas.length > 0 && (
                                                    <div className="space-y-3 border-t border-border/60 pt-3">
                                                        <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                                            4. Etiquetas &
                                                            Amenidades
                                                        </h3>
                                                        <div className="grid max-h-36 grid-cols-2 gap-2 overflow-y-auto rounded-lg border bg-muted/20 p-2.5 sm:grid-cols-3">
                                                            {etiquetas.map(
                                                                (etiqueta) => (
                                                                    <label
                                                                        key={
                                                                            etiqueta.id
                                                                        }
                                                                        className="flex cursor-pointer items-center gap-2 text-xs font-medium text-foreground"
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            name="etiquetas[]"
                                                                            value={
                                                                                etiqueta.id
                                                                            }
                                                                            defaultChecked={initialEtiquetas.includes(
                                                                                etiqueta.id,
                                                                            )}
                                                                            className="size-3.5 rounded-sm border-input text-primary focus:ring-primary"
                                                                        />
                                                                        <span>
                                                                            {
                                                                                etiqueta.nombre
                                                                            }
                                                                        </span>
                                                                    </label>
                                                                ),
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                            {/* Section 5: Agentes Responsables */}
                                            <div className="space-y-3 border-t border-border/60 pt-3">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                                        5. Agentes Responsables
                                                    </h3>
                                                </div>

                                                {creadorAgente && (
                                                    <div className="flex items-center justify-between gap-3 rounded-lg border border-primary/20 bg-primary/5 p-2.5">
                                                        <div className="flex items-center gap-2.5">
                                                            <Avatar className="size-7 text-[10px]">
                                                                <AvatarFallback className="bg-primary font-bold text-primary-foreground">
                                                                    {getInitials(
                                                                        creadorAgente.name,
                                                                    )}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <p className="text-xs font-semibold text-foreground">
                                                                    {
                                                                        creadorAgente.name
                                                                    }
                                                                </p>
                                                                <p className="text-[10px] text-muted-foreground">
                                                                    Agente
                                                                    creador
                                                                    (permanente)
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Badge
                                                            variant="outline"
                                                            className="border-primary/30 bg-background text-[10px] font-medium text-primary"
                                                        >
                                                            Creador
                                                        </Badge>
                                                    </div>
                                                )}

                                                {agentes &&
                                                    agentes.length > 0 && (
                                                        <div className="space-y-1.5 pt-1">
                                                            <p className="text-[11px] font-medium text-muted-foreground">
                                                                Co-agentes
                                                                adicionales
                                                                (opcional):
                                                            </p>
                                                            <div className="grid max-h-40 grid-cols-1 gap-2 overflow-y-auto rounded-lg border bg-muted/20 p-2.5 sm:grid-cols-2">
                                                                {agentes.map(
                                                                    (
                                                                        agente,
                                                                    ) => (
                                                                        <label
                                                                            key={
                                                                                agente.id
                                                                            }
                                                                            className="flex cursor-pointer items-center gap-2.5 rounded-md p-1.5 hover:bg-background/80"
                                                                        >
                                                                            <input
                                                                                type="checkbox"
                                                                                name="agentes[]"
                                                                                value={
                                                                                    agente.id
                                                                                }
                                                                                defaultChecked={initialAgentes.includes(
                                                                                    agente.id,
                                                                                )}
                                                                                className="size-4 rounded-sm border-input text-primary focus:ring-primary"
                                                                            />
                                                                            <Avatar className="size-6 text-[10px]">
                                                                                <AvatarFallback className="bg-primary/10 font-bold text-primary">
                                                                                    {getInitials(
                                                                                        agente.name,
                                                                                    )}
                                                                                </AvatarFallback>
                                                                            </Avatar>
                                                                            <span className="text-xs font-medium text-foreground">
                                                                                {
                                                                                    agente.name
                                                                                }
                                                                            </span>
                                                                        </label>
                                                                    ),
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                            </div>

                                            <DialogFooter className="gap-2 border-t border-border/60 pt-3">
                                                <DialogClose asChild>
                                                    <Button
                                                        variant="secondary"
                                                        type="button"
                                                    >
                                                        Cancelar
                                                    </Button>
                                                </DialogClose>
                                                <Button
                                                    type="submit"
                                                    disabled={processing}
                                                >
                                                    Guardar cambios
                                                </Button>
                                            </DialogFooter>
                                        </>
                                    )}
                                </Form>
                            </DialogContent>
                        </Dialog>

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

                    {areaTerreno && (
                        <Card className="py-4 shadow-2xs">
                            <CardContent className="flex items-center justify-between px-5 py-0">
                                <div>
                                    <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                        Área de Terreno
                                    </p>
                                    <p className="text-xl font-bold tracking-tight">
                                        {areaTerreno} {propiedad.unidad_medida}
                                    </p>
                                    {propiedad.area_construccion && (
                                        <p className="text-xs text-muted-foreground">
                                            + {propiedad.area_construccion}{' '}
                                            {propiedad.unidad_medida}{' '}
                                            construcción
                                        </p>
                                    )}
                                </div>
                                <div className="flex size-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                                    <Maximize2 className="size-5" />
                                </div>
                            </CardContent>
                        </Card>
                    )}

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
                    <div className="min-w-0 space-y-6 lg:col-span-5">
                        {/* Characteristics & Technical Sheet */}
                        <Card className="min-w-0 shadow-2xs">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold">
                                    Ficha Técnica & Atributos
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Detalles y especificaciones del inmueble
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="min-w-0 space-y-4 pt-0">
                                <div className="grid grid-cols-2 gap-3">
                                    {areaTerreno && (
                                        <div className="min-w-0 rounded-xl border border-border/60 bg-muted/20 p-3">
                                            <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                                                <Maximize2 className="size-3 shrink-0" />
                                                <span className="truncate">
                                                    Área de Terreno
                                                </span>
                                            </span>
                                            <p className="mt-1 text-sm font-semibold break-words text-foreground">
                                                {areaTerreno}{' '}
                                                {propiedad.unidad_medida}
                                            </p>
                                        </div>
                                    )}

                                    {propiedad.area_construccion && (
                                        <div className="min-w-0 rounded-xl border border-border/60 bg-muted/20 p-3">
                                            <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                                                <Building2 className="size-3 shrink-0" />
                                                <span className="truncate">
                                                    Área de Construcción
                                                </span>
                                            </span>
                                            <p className="mt-1 text-sm font-semibold break-words text-foreground">
                                                {propiedad.area_construccion}{' '}
                                                {propiedad.unidad_medida}
                                            </p>
                                        </div>
                                    )}

                                    <div className="min-w-0 rounded-xl border border-border/60 bg-muted/20 p-3">
                                        <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                                            <CreditCard className="size-3 shrink-0" />
                                            <span className="truncate">
                                                Forma de Pago
                                            </span>
                                        </span>
                                        <p className="mt-1 text-sm font-semibold break-words text-foreground">
                                            {formatFormaPago(
                                                propiedad.forma_pago,
                                            )}
                                        </p>
                                    </div>

                                    {propiedad.condicion_legal && (
                                        <div className="col-span-2 min-w-0 rounded-xl border border-border/60 bg-muted/20 p-3 sm:col-span-1">
                                            <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                                                <Scale className="size-3 shrink-0" />
                                                <span className="truncate">
                                                    Condición Legal
                                                </span>
                                            </span>
                                            <p className="mt-1 text-sm font-semibold [overflow-wrap:anywhere] break-words text-foreground">
                                                {formatCondicionLegal(
                                                    propiedad.condicion_legal,
                                                )}
                                            </p>
                                        </div>
                                    )}

                                    {propiedad.acceso && (
                                        <div className="col-span-2 min-w-0 rounded-xl border border-border/60 bg-muted/20 p-3">
                                            <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                                                <Navigation className="size-3 shrink-0" />
                                                <span>Tipo de Acceso</span>
                                            </span>
                                            <p className="mt-1 text-sm font-semibold [overflow-wrap:anywhere] break-words text-foreground">
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
                                    <div className="min-w-0 space-y-1.5 border-t border-border/60 pt-3">
                                        <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                            Descripción del Inmueble
                                        </p>
                                        <p className="text-sm leading-relaxed [overflow-wrap:anywhere] break-words whitespace-pre-wrap text-foreground/90">
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
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-semibold text-foreground">
                                                            {
                                                                coAgente.agente
                                                                    ?.name
                                                            }
                                                        </p>
                                                        {coAgente.agente_id ===
                                                        resolvedCreadorId ? (
                                                            <Badge className="border-primary/20 bg-primary/10 text-[10px] text-primary hover:bg-primary/20">
                                                                Creador
                                                            </Badge>
                                                        ) : (
                                                            <Badge
                                                                variant="outline"
                                                                className="text-[10px] text-muted-foreground"
                                                            >
                                                                Co-agente
                                                            </Badge>
                                                        )}
                                                    </div>
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

                                    {webShareFotosSupported &&
                                        propiedad.fotos &&
                                        propiedad.fotos.length > 0 && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={compartirFotos}
                                                disabled={isSharingFotos}
                                                className="h-8 gap-1.5 text-xs"
                                            >
                                                {isSharingFotos ? (
                                                    <Loader2 className="size-3.5 animate-spin" />
                                                ) : (
                                                    <Share2 className="size-3.5" />
                                                )}
                                                Compartir fotos
                                            </Button>
                                        )}
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4 pt-0">
                                {/* Photo Grid */}
                                {propiedad.fotos &&
                                propiedad.fotos.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                        {propiedad.fotos.map((foto, index) => (
                                            <div
                                                key={foto.id}
                                                onClick={() =>
                                                    setLightboxIndex(index)
                                                }
                                                className="group relative aspect-4/3 cursor-pointer overflow-hidden rounded-xl border border-border/70 bg-muted/40"
                                            >
                                                <img
                                                    src={
                                                        foto.url_con_marca_agua
                                                    }
                                                    alt={`Foto de ${propiedad.tipo}`}
                                                    className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    loading="lazy"
                                                />

                                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                                    <div className="flex size-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm">
                                                        <Eye className="size-5" />
                                                    </div>
                                                </div>

                                                <div className="pointer-events-none absolute inset-0 flex items-start justify-end bg-gradient-to-t from-black/40 via-transparent to-black/30 p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
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
                                                                onClick={(e) =>
                                                                    e.stopPropagation()
                                                                }
                                                                className="pointer-events-auto size-7 shadow-md"
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
                                    options={{
                                        preserveScroll: true,
                                        onSuccess: () => clearFotos(),
                                    }}
                                    className="space-y-3 rounded-xl border border-border/70 bg-muted/20 p-3.5"
                                >
                                    {({ processing, errors }) => (
                                        <div className="space-y-3">
                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                <label className="relative flex cursor-pointer items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-xs font-medium shadow-2xs transition-colors hover:bg-accent hover:text-accent-foreground">
                                                    <Upload className="size-3.5 text-muted-foreground" />
                                                    <span>
                                                        {fotos.length > 0
                                                            ? `${fotos.length} foto(s) seleccionada(s)`
                                                            : 'Seleccionar fotos...'}
                                                    </span>
                                                    <input
                                                        ref={fotosInputRef}
                                                        name="fotos[]"
                                                        type="file"
                                                        multiple
                                                        accept="image/*"
                                                        className="sr-only"
                                                        onChange={onFotosChange}
                                                    />
                                                </label>

                                                <Button
                                                    type="submit"
                                                    size="sm"
                                                    disabled={
                                                        processing ||
                                                        fotos.length === 0
                                                    }
                                                    className="h-8 gap-1.5 text-xs shadow-2xs"
                                                >
                                                    <Plus className="size-3.5" />
                                                    {processing
                                                        ? 'Subiendo...'
                                                        : 'Subir fotos'}
                                                </Button>
                                            </div>

                                            <InputError
                                                message={errors.fotos}
                                            />
                                            {Object.entries(errors)
                                                .filter(([key]) =>
                                                    key.startsWith('fotos.'),
                                                )
                                                .map(([key, message]) => (
                                                    <InputError
                                                        key={key}
                                                        message={message}
                                                    />
                                                ))}

                                            {/* Previews Grid for Selected Photos */}
                                            {previews.length > 0 && (
                                                <div className="space-y-2 pt-2">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                                            Fotos listas para
                                                            subir (
                                                            {previews.length})
                                                        </p>
                                                        <button
                                                            type="button"
                                                            onClick={clearFotos}
                                                            className="text-[11px] text-muted-foreground hover:text-destructive hover:underline"
                                                        >
                                                            Limpiar selección
                                                        </button>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 md:grid-cols-6">
                                                        {previews.map(
                                                            (src, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="group relative aspect-4/3 overflow-hidden rounded-xl border border-border/70 bg-muted/40 shadow-2xs"
                                                                >
                                                                    <img
                                                                        src={
                                                                            src
                                                                        }
                                                                        alt={`Preview ${index + 1}`}
                                                                        className="size-full object-cover"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            removeFoto(
                                                                                index,
                                                                            )
                                                                        }
                                                                        aria-label="Eliminar foto seleccionada"
                                                                        className="absolute top-1.5 right-1.5 flex size-5 items-center justify-center rounded-full bg-red-600 text-white shadow-xs transition-colors hover:bg-red-700"
                                                                    >
                                                                        <X className="size-3" />
                                                                    </button>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            )}
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

            <ImageLightbox
                images={propiedad.fotos ?? []}
                currentIndex={lightboxIndex ?? 0}
                isOpen={lightboxIndex !== null}
                onClose={() => setLightboxIndex(null)}
                onNavigate={(idx) => setLightboxIndex(idx)}
                title={`${formatTipoPropiedad(propiedad.tipo)} en ${formatMunicipio(propiedad.zona)}`}
            />
        </>
    );
}

PropiedadShow.layout = (props: Props) => ({
    breadcrumbs: [
        { title: 'Propiedades', href: index() },
        {
            title: `${formatTipoPropiedad(props.propiedad.tipo)} en ${formatMunicipio(props.propiedad.zona)}`,
            href: index(),
        },
    ],
});
