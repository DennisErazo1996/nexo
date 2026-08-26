import { Form, Head, Link } from '@inertiajs/react';
import {
    Building2,
    Check,
    CreditCard,
    FileText,
    ImageIcon,
    MapPin,
    Maximize2,
    Plus,
    Tag,
    Upload,
    Users,
} from 'lucide-react';
import { useState } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { index } from '@/routes/propiedades';
import type { EnumOption } from '@/types/propiedad';

type Agente = {
    id: number;
    name: string;
};

type EtiquetaInteres = {
    id: number;
    nombre: string;
};

type Props = {
    etiquetas: EtiquetaInteres[];
    agentes: Agente[];
    tipos: EnumOption[];
    unidadesMedida: EnumOption[];
    monedas: EnumOption[];
    formasPago: EnumOption[];
    condicionesLegales: EnumOption[];
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

export default function PropiedadCreate({
    etiquetas,
    agentes,
    tipos,
    unidadesMedida,
    monedas,
    formasPago,
    condicionesLegales,
}: Props) {
    const [previews, setPreviews] = useState<string[]>([]);
    const [selectedFilesCount, setSelectedFilesCount] = useState<number>(0);
    const [tieneConstruccion, setTieneConstruccion] = useState(false);

    function onFotosChange(event: React.ChangeEvent<HTMLInputElement>) {
        const files = event.target.files ? Array.from(event.target.files) : [];
        setSelectedFilesCount(files.length);
        setPreviews(files.map((file) => URL.createObjectURL(file)));
    }

    return (
        <>
            <Head title="Nueva propiedad — Registrar Inmueble" />

            <div className="mx-auto max-w-4xl space-y-6 p-4 md:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-xs">
                            <Building2 className="size-6" />
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                Registrar Nueva Propiedad
                            </h1>
                            <p className="text-xs text-muted-foreground">
                                Publica un nuevo inmueble en el catálogo del
                                equipo
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button asChild variant="outline" size="sm">
                            <Link href={index()}>Cancelar</Link>
                        </Button>
                    </div>
                </div>

                {/* Form */}
                <Form
                    {...PropiedadController.store.form()}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            {/* Card 1: Main details & Location */}
                            <Card className="shadow-2xs">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                            <MapPin className="size-4" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-base font-semibold">
                                                Datos Principales & Ubicación
                                            </CardTitle>
                                            <CardDescription className="text-xs">
                                                Tipo de inmueble, zona
                                                geográfica y dimensiones
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4 pt-0">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="tipo">
                                                Tipo de Propiedad *
                                            </Label>
                                            <select
                                                id="tipo"
                                                name="tipo"
                                                required
                                                className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring/40 focus:outline-hidden"
                                            >
                                                {tipos.map((tipo) => (
                                                    <option
                                                        key={tipo.value}
                                                        value={tipo.value}
                                                    >
                                                        {tipo.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError message={errors.tipo} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="zona">
                                                Zona / Ubicación *
                                            </Label>
                                            <Input
                                                id="zona"
                                                name="zona"
                                                required
                                                placeholder="Ej. Col. Palmira, Santa Rosa de Copán..."
                                            />
                                            <InputError message={errors.zona} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="area_terreno">
                                                Área de Terreno *
                                            </Label>
                                            <Input
                                                id="area_terreno"
                                                name="area_terreno"
                                                type="number"
                                                step="0.01"
                                                required
                                                placeholder="Ej. 250.00"
                                            />
                                            <InputError
                                                message={errors.area_terreno}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="unidad_medida">
                                                Unidad de Medida *
                                            </Label>
                                            <select
                                                id="unidad_medida"
                                                name="unidad_medida"
                                                required
                                                className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring/40 focus:outline-hidden"
                                            >
                                                {unidadesMedida.map(
                                                    (unidad) => (
                                                        <option
                                                            key={unidad.value}
                                                            value={unidad.value}
                                                        >
                                                            {unidad.label}
                                                        </option>
                                                    ),
                                                )}
                                            </select>
                                            <InputError
                                                message={errors.unidad_medida}
                                            />
                                        </div>
                                    </div>

                                    {/* Optional Construction Area Toggle */}
                                    <div className="rounded-xl border border-border/70 bg-muted/20 p-3.5 transition-colors hover:bg-muted/30">
                                        <div className="flex items-center gap-3">
                                            <Checkbox
                                                id="tiene_construccion"
                                                checked={tieneConstruccion}
                                                onCheckedChange={(checked) =>
                                                    setTieneConstruccion(
                                                        Boolean(checked),
                                                    )
                                                }
                                            />
                                            <Label
                                                htmlFor="tiene_construccion"
                                                className="cursor-pointer text-xs font-medium leading-none text-foreground"
                                            >
                                                Incluye construcción / casa dentro de la propiedad
                                            </Label>
                                        </div>

                                        {tieneConstruccion && (
                                            <div className="mt-3.5 pt-3.5 border-t border-border/50 grid gap-2">
                                                <Label htmlFor="area_construccion">
                                                    Área de Construcción
                                                </Label>
                                                <Input
                                                    id="area_construccion"
                                                    name="area_construccion"
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="Ej. 120.00"
                                                />
                                                <InputError
                                                    message={errors.area_construccion}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Card 2: Commercial & Legal conditions */}
                            <Card className="shadow-2xs">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                            <CreditCard className="size-4" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-base font-semibold">
                                                Condiciones Comerciales &
                                                Legales
                                            </CardTitle>
                                            <CardDescription className="text-xs">
                                                Precio de venta, formas de pago
                                                y estatus legal
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4 pt-0">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                        <div className="grid gap-2 sm:col-span-2">
                                            <Label htmlFor="precio">
                                                Precio de Venta *
                                            </Label>
                                            <Input
                                                id="precio"
                                                name="precio"
                                                type="number"
                                                step="0.01"
                                                required
                                                placeholder="0.00"
                                            />
                                            <InputError
                                                message={errors.precio}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="moneda">
                                                Moneda *
                                            </Label>
                                            <select
                                                id="moneda"
                                                name="moneda"
                                                required
                                                className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring/40 focus:outline-hidden"
                                            >
                                                {monedas.map((moneda) => (
                                                    <option
                                                        key={moneda.value}
                                                        value={moneda.value}
                                                    >
                                                        {moneda.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError
                                                message={errors.moneda}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="forma_pago">
                                                Forma de Pago *
                                            </Label>
                                            <select
                                                id="forma_pago"
                                                name="forma_pago"
                                                required
                                                className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring/40 focus:outline-hidden"
                                            >
                                                {formasPago.map((forma) => (
                                                    <option
                                                        key={forma.value}
                                                        value={forma.value}
                                                    >
                                                        {forma.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError
                                                message={errors.forma_pago}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="condicion_legal">
                                                Condición Legal
                                            </Label>
                                            <select
                                                id="condicion_legal"
                                                name="condicion_legal"
                                                defaultValue=""
                                                className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring/40 focus:outline-hidden"
                                            >
                                                <option value="">
                                                    Sin especificar
                                                </option>
                                                {condicionesLegales.map(
                                                    (condicion) => (
                                                        <option
                                                            key={
                                                                condicion.value
                                                            }
                                                            value={
                                                                condicion.value
                                                            }
                                                        >
                                                            {condicion.label}
                                                        </option>
                                                    ),
                                                )}
                                            </select>
                                            <InputError
                                                message={errors.condicion_legal}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Card 3: Access & Description */}
                            <Card className="shadow-2xs">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="flex size-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
                                            <FileText className="size-4" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-base font-semibold">
                                                Acceso & Descripción Detallada
                                            </CardTitle>
                                            <CardDescription className="text-xs">
                                                Facilidades de llegada y
                                                características comerciales
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4 pt-0">
                                    <div className="grid gap-2">
                                        <Label htmlFor="acceso">
                                            Vías de Acceso y Cercanías
                                        </Label>
                                        <Input
                                            id="acceso"
                                            name="acceso"
                                            placeholder="Distancia a pavimento, tiempo desde la ciudad, tipo de vía..."
                                        />
                                        <InputError message={errors.acceso} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="descripcion">
                                            Descripción del Inmueble
                                        </Label>
                                        <Textarea
                                            id="descripcion"
                                            name="descripcion"
                                            rows={4}
                                            placeholder="Escribe una descripción atractiva destacando las mejores cualidades del inmueble..."
                                            className="min-h-[100px] resize-y"
                                        />
                                        <InputError
                                            message={errors.descripcion}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Card 4: Tags & Co-Agents */}
                            <Card className="shadow-2xs">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="flex size-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                                            <Tag className="size-4" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-base font-semibold">
                                                Etiquetas de Uso & Co-Agentes
                                            </CardTitle>
                                            <CardDescription className="text-xs">
                                                Categorización y compañeros de
                                                equipo asignados
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-6 pt-0">
                                    {/* Tags */}
                                    <div className="space-y-2.5">
                                        <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                            Etiquetas de Uso / Vocación
                                        </Label>
                                        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
                                            {etiquetas.map((etiqueta) => (
                                                <label
                                                    key={etiqueta.id}
                                                    className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-border/60 bg-muted/20 p-2.5 text-xs font-medium transition-colors select-none hover:border-border hover:bg-muted/50"
                                                >
                                                    <Checkbox
                                                        name="etiquetas[]"
                                                        value={String(
                                                            etiqueta.id,
                                                        )}
                                                    />
                                                    <span>
                                                        {etiqueta.nombre}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                        <InputError
                                            message={errors.etiquetas}
                                        />
                                    </div>

                                    {/* Co-Agents */}
                                    {agentes.length > 0 && (
                                        <div className="space-y-2.5 border-t border-border/60 pt-4">
                                            <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                                Co-Agentes Asignados
                                            </Label>
                                            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-3">
                                                {agentes.map((agente) => (
                                                    <label
                                                        key={agente.id}
                                                        className="flex cursor-pointer items-center gap-3 rounded-xl border border-border/60 bg-muted/20 p-2.5 text-xs font-medium transition-colors select-none hover:border-border hover:bg-muted/50"
                                                    >
                                                        <Checkbox
                                                            name="agentes[]"
                                                            value={String(
                                                                agente.id,
                                                            )}
                                                        />
                                                        <Avatar className="size-6 border border-primary/20 bg-primary/10 text-primary">
                                                            <AvatarFallback className="bg-primary/10 text-[10px] font-bold text-primary">
                                                                {getInitials(
                                                                    agente.name,
                                                                )}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span className="truncate">
                                                            {agente.name}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                            <InputError
                                                message={errors.agentes}
                                            />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Card 5: Photo Upload & Gallery */}
                            <Card className="shadow-2xs">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                                <ImageIcon className="size-4" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-base font-semibold">
                                                    Fotografías de la Propiedad
                                                </CardTitle>
                                                <CardDescription className="text-xs">
                                                    Sube imágenes claras del
                                                    inmueble (se aplicará marca
                                                    de agua oficial)
                                                </CardDescription>
                                            </div>
                                        </div>

                                        {selectedFilesCount > 0 && (
                                            <Badge
                                                variant="secondary"
                                                className="text-xs font-semibold"
                                            >
                                                {selectedFilesCount} foto(s)
                                                seleccionada(s)
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4 pt-0">
                                    {/* Upload Box */}
                                    <label className="relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border/80 bg-muted/20 p-8 text-center transition-all hover:border-primary/50 hover:bg-muted/40">
                                        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <Upload className="size-6" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold text-foreground">
                                                Haz clic para seleccionar fotos
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Formatos JPG, PNG, WEBP. Puedes
                                                seleccionar múltiples fotos a la
                                                vez.
                                            </p>
                                        </div>
                                        <input
                                            id="fotos"
                                            name="fotos[]"
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={onFotosChange}
                                            className="sr-only"
                                        />
                                    </label>

                                    <InputError message={errors.fotos} />
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

                                    {/* Previews Grid */}
                                    {previews.length > 0 && (
                                        <div className="space-y-2 pt-2">
                                            <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                                Vista Previa ({previews.length}{' '}
                                                fotos)
                                            </p>
                                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
                                                {previews.map((src, index) => (
                                                    <div
                                                        key={index}
                                                        className="group relative aspect-4/3 overflow-hidden rounded-xl border border-border/70 bg-muted/40"
                                                    >
                                                        <img
                                                            src={src}
                                                            alt={`Preview ${index + 1}`}
                                                            className="size-full object-cover"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Submit Button Bar */}
                            <div className="flex items-center justify-end gap-3 pt-2">
                                <Button asChild variant="outline">
                                    <Link href={index()}>Cancelar</Link>
                                </Button>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="h-10 gap-2 px-6"
                                >
                                    <Plus className="size-4" />
                                    {processing
                                        ? 'Guardando...'
                                        : 'Guardar e ingresar propiedad'}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

PropiedadCreate.layout = {
    breadcrumbs: [
        { title: 'Propiedades', href: index() },
        { title: 'Nueva', href: PropiedadController.create() },
    ],
};
