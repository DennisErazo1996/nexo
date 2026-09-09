import { Form, Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    DollarSign,
    MapPin,
    Phone,
    ShieldCheck,
    Sparkles,
    Tag,
    User,
    UserPlus,
} from 'lucide-react';
import ClienteController from '@/actions/App/Http/Controllers/Cliente/ClienteController';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { index } from '@/routes/clientes';
import type { EtiquetaInteres } from '@/types/cliente';
import type { MunicipioOption } from '@/types/propiedad';

type Props = {
    step: 'telefono' | 'datos';
    telefono?: string;
    etiquetas: EtiquetaInteres[];
    municipios?: MunicipioOption[];
};

export default function ClienteCreate({ step, telefono, etiquetas, municipios }: Props) {
    return (
        <>
            <Head title="Nuevo cliente — Registro en el Equipo" />

            <div className="mx-auto w-full max-w-2xl min-w-0 space-y-6 px-4 py-6 sm:px-6 md:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between sm:p-6">
                    <div className="flex items-center gap-4 min-w-0">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-xs">
                            <UserPlus className="size-6" />
                        </div>
                        <div className="space-y-1 min-w-0">
                            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                                Registrar Nuevo Cliente
                            </h1>
                            <p className="text-xs text-muted-foreground">
                                Ingresa los datos y preferencias para vincular
                                coincidencias
                            </p>
                        </div>
                    </div>

                    <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                        <Link href={index()}>Cancelar</Link>
                    </Button>
                </div>

                {/* Stepper Indicator */}
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                    <div
                        className={cn(
                            'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors sm:gap-2 sm:px-3.5',
                            step === 'telefono'
                                ? 'bg-primary text-primary-foreground shadow-xs'
                                : 'bg-muted text-muted-foreground',
                        )}
                    >
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-background/20 text-[11px]">
                            1
                        </span>
                        <span className="truncate">Verificación de Teléfono</span>
                    </div>

                    <div className="hidden h-0.5 w-6 bg-border sm:block" />

                    <div
                        className={cn(
                            'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors sm:gap-2 sm:px-3.5',
                            step === 'datos'
                                ? 'bg-primary text-primary-foreground shadow-xs'
                                : 'bg-muted text-muted-foreground',
                        )}
                    >
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-background/20 text-[11px]">
                            2
                        </span>
                        <span className="truncate">Datos & Preferencias</span>
                    </div>
                </div>

                {/* Step 1: Telefono Verification */}
                {step === 'telefono' && (
                    <Card className="w-full min-w-0 shadow-2xs">
                        <CardHeader className="px-4 pt-5 pb-3 sm:px-6">
                            <div className="flex items-center gap-2 min-w-0">
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <ShieldCheck className="size-4" />
                                </div>
                                <div className="min-w-0">
                                    <CardTitle className="text-base font-semibold truncate">
                                        Paso 1: Verificación de Contacto
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Comprobamos que el cliente no esté
                                        registrado por otro agente del equipo
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4 px-4 pt-0 pb-5 sm:px-6">
                            <Form
                                {...ClienteController.buscar.form()}
                                className="space-y-4"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="telefono"
                                                className="text-xs font-semibold"
                                            >
                                                Número de Teléfono / WhatsApp *
                                            </Label>
                                            <div className="relative">
                                                <Phone className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
                                                <Input
                                                    id="telefono"
                                                    name="telefono"
                                                    type="tel"
                                                    required
                                                    autoFocus
                                                    placeholder="Ej. 9988-7766 o +1 234 567 8900"
                                                    className="h-10 w-full pl-9.5 text-sm"
                                                />
                                            </div>
                                            <p className="text-[11px] text-muted-foreground">
                                                Puedes ingresar números locales
                                                o internacionales con código de
                                                país.
                                            </p>
                                            <InputError
                                                message={errors.telefono}
                                            />
                                        </div>

                                        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:items-center sm:justify-end">
                                            <Button
                                                asChild
                                                variant="outline"
                                                size="sm"
                                                className="w-full sm:w-auto"
                                            >
                                                <Link href={index()}>
                                                    Cancelar
                                                </Link>
                                            </Button>

                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="w-full gap-2 sm:w-auto"
                                            >
                                                <span>
                                                    {processing
                                                        ? 'Verificando...'
                                                        : 'Verificar y continuar'}
                                                </span>
                                                <ArrowRight className="size-4" />
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </CardContent>
                    </Card>
                )}

                {/* Step 2: Cliente Details & Initial Interest */}
                {step === 'datos' && (
                    <Form
                        {...ClienteController.store.form()}
                        className="space-y-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <input
                                    type="hidden"
                                    name="telefono"
                                    value={telefono}
                                />

                                {/* Phone Verified Badge Banner */}
                                <div className="flex flex-col gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 dark:border-emerald-900/60 dark:bg-emerald-950/30 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                        <div className="min-w-0">
                                            <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-300 truncate">
                                                Teléfono Verificado Disponible
                                            </p>
                                            <p className="font-mono text-xs text-emerald-700 dark:text-emerald-400 truncate">
                                                {telefono}
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        asChild
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 w-fit text-xs text-muted-foreground hover:text-foreground"
                                    >
                                        <Link href={ClienteController.create()}>
                                            Cambiar número
                                        </Link>
                                    </Button>
                                </div>

                                {/* Card 1: Contact Details */}
                                <Card className="w-full min-w-0 shadow-2xs">
                                    <CardHeader className="px-4 pt-5 pb-3 sm:px-6">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                <User className="size-4" />
                                            </div>
                                            <div className="min-w-0">
                                                <CardTitle className="text-base font-semibold truncate">
                                                    Información del Cliente
                                                </CardTitle>
                                                <CardDescription className="text-xs">
                                                    Nombre completo y datos de
                                                    identificación
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-4 px-4 pt-0 pb-5 sm:px-6">
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div className="grid gap-2 min-w-0">
                                                <Label
                                                    htmlFor="nombres"
                                                    className="text-xs font-semibold"
                                                >
                                                    Nombres *
                                                </Label>
                                                <Input
                                                    id="nombres"
                                                    name="nombres"
                                                    required
                                                    autoFocus
                                                    placeholder="Ej. Juan Carlos"
                                                    className="h-10 w-full"
                                                />
                                                <InputError
                                                    message={errors.nombres}
                                                />
                                            </div>
                                            <div className="grid gap-2 min-w-0">
                                                <Label
                                                    htmlFor="apellidos"
                                                    className="text-xs font-semibold"
                                                >
                                                    Apellidos *
                                                </Label>
                                                <Input
                                                    id="apellidos"
                                                    name="apellidos"
                                                    required
                                                    placeholder="Ej. Pérez"
                                                    className="h-10 w-full"
                                                />
                                                <InputError
                                                    message={errors.apellidos}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Card 2: Initial Search Interest */}
                                <Card className="w-full min-w-0 shadow-2xs">
                                    <CardHeader className="px-4 pt-5 pb-3 sm:px-6">
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                                                    <Tag className="size-4" />
                                                </div>
                                                <div className="min-w-0">
                                                    <CardTitle className="text-base font-semibold truncate">
                                                        Interés de Búsqueda
                                                        Inicial
                                                    </CardTitle>
                                                    <CardDescription className="text-xs">
                                                        Criterios para vincular
                                                        inmuebles
                                                        automáticamente
                                                    </CardDescription>
                                                </div>
                                            </div>

                                            <Badge
                                                variant="secondary"
                                                className="w-fit gap-1 text-[11px]"
                                            >
                                                <Sparkles className="size-3 text-primary" />
                                                Auto-Matching
                                            </Badge>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-4 px-4 pt-0 pb-5 sm:px-6">
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div className="grid gap-2 min-w-0">
                                                <Label
                                                    htmlFor="etiqueta_id"
                                                    className="text-xs font-semibold"
                                                >
                                                    Tipo de Inmueble / Interés *
                                                </Label>
                                                <select
                                                    id="etiqueta_id"
                                                    name="etiqueta_id"
                                                    required
                                                    className="h-9 w-full max-w-full rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring/40 focus:outline-hidden"
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
                                                    message={errors.etiqueta_id}
                                                />
                                            </div>

                                            <div className="grid gap-2 min-w-0">
                                                <Label
                                                    htmlFor="zona"
                                                    className="text-xs font-semibold"
                                                >
                                                    Municipio / Zona de Interés
                                                </Label>
                                                <select
                                                    id="zona"
                                                    name="zona"
                                                    className="h-9 w-full max-w-full rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring/40 focus:outline-hidden"
                                                >
                                                    <option value="">
                                                        Cualquier municipio (Sin
                                                        preferencia)
                                                    </option>
                                                    {municipios?.map((m) => (
                                                        <option
                                                            key={m.value}
                                                            value={m.value}
                                                        >
                                                            {m.label} ({m.departamento})
                                                        </option>
                                                    ))}
                                                </select>
                                                <InputError
                                                    message={errors.zona}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div className="grid gap-2 min-w-0">
                                                <Label
                                                    htmlFor="presupuesto_min"
                                                    className="text-xs font-semibold"
                                                >
                                                    Presupuesto Mínimo
                                                </Label>
                                                <Input
                                                    id="presupuesto_min"
                                                    name="presupuesto_min"
                                                    type="number"
                                                    placeholder="0"
                                                    className="w-full"
                                                />
                                                <InputError
                                                    message={
                                                        errors.presupuesto_min
                                                    }
                                                />
                                            </div>

                                            <div className="grid gap-2 min-w-0">
                                                <Label
                                                    htmlFor="presupuesto_max"
                                                    className="text-xs font-semibold"
                                                >
                                                    Presupuesto Máximo
                                                </Label>
                                                <Input
                                                    id="presupuesto_max"
                                                    name="presupuesto_max"
                                                    type="number"
                                                    placeholder="Sin límite"
                                                    className="w-full"
                                                />
                                                <InputError
                                                    message={
                                                        errors.presupuesto_max
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Action Buttons */}
                                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                                    <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                                        <Link href={ClienteController.create()}>
                                            <ArrowLeft className="mr-1.5 size-4" />
                                            Volver
                                        </Link>
                                    </Button>

                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full gap-2 px-6 sm:w-auto"
                                    >
                                        <Sparkles className="size-4" />
                                        {processing
                                            ? 'Guardando cliente...'
                                            : 'Guardar cliente y buscar coincidencias'}
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                )}
            </div>
        </>
    );
}

ClienteCreate.layout = {
    breadcrumbs: [
        { title: 'Clientes', href: index() },
        { title: 'Nuevo', href: ClienteController.create() },
    ],
};
