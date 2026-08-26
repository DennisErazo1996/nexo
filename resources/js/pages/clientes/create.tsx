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

type Props = {
    step: 'telefono' | 'datos';
    telefono?: string;
    etiquetas: EtiquetaInteres[];
};

export default function ClienteCreate({ step, telefono, etiquetas }: Props) {
    return (
        <>
            <Head title="Nuevo cliente — Registro en el Equipo" />

            <div className="mx-auto max-w-2xl space-y-6 p-4 md:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-xs">
                            <UserPlus className="size-6" />
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                Registrar Nuevo Cliente
                            </h1>
                            <p className="text-xs text-muted-foreground">
                                Ingresa los datos y preferencias para vincular
                                coincidencias
                            </p>
                        </div>
                    </div>

                    <Button asChild variant="outline" size="sm">
                        <Link href={index()}>Cancelar</Link>
                    </Button>
                </div>

                {/* Stepper Indicator */}
                <div className="flex items-center justify-center gap-3">
                    <div
                        className={cn(
                            'flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors',
                            step === 'telefono'
                                ? 'bg-primary text-primary-foreground shadow-xs'
                                : 'bg-muted text-muted-foreground',
                        )}
                    >
                        <span className="flex size-5 items-center justify-center rounded-full bg-background/20 text-[11px]">
                            1
                        </span>
                        <span>Verificación de Teléfono</span>
                    </div>

                    <div className="h-0.5 w-6 bg-border" />

                    <div
                        className={cn(
                            'flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors',
                            step === 'datos'
                                ? 'bg-primary text-primary-foreground shadow-xs'
                                : 'bg-muted text-muted-foreground',
                        )}
                    >
                        <span className="flex size-5 items-center justify-center rounded-full bg-background/20 text-[11px]">
                            2
                        </span>
                        <span>Datos & Preferencias</span>
                    </div>
                </div>

                {/* Step 1: Telefono Verification */}
                {step === 'telefono' && (
                    <Card className="shadow-2xs">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <ShieldCheck className="size-4" />
                                </div>
                                <div>
                                    <CardTitle className="text-base font-semibold">
                                        Paso 1: Verificación de Contacto
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Comprobamos que el cliente no esté
                                        registrado por otro agente del equipo
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4 pt-0">
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
                                                    className="h-10 pl-9.5 text-sm"
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

                                        <div className="flex items-center justify-end gap-2 pt-2">
                                            <Button
                                                asChild
                                                variant="outline"
                                                size="sm"
                                            >
                                                <Link href={index()}>
                                                    Cancelar
                                                </Link>
                                            </Button>

                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="gap-2"
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
                                <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 dark:border-emerald-900/60 dark:bg-emerald-950/30">
                                    <div className="flex items-center gap-2.5">
                                        <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                                        <div>
                                            <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-300">
                                                Teléfono Verificado Disponible
                                            </p>
                                            <p className="font-mono text-xs text-emerald-700 dark:text-emerald-400">
                                                {telefono}
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        asChild
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 text-xs text-muted-foreground hover:text-foreground"
                                    >
                                        <Link href={ClienteController.create()}>
                                            Cambiar número
                                        </Link>
                                    </Button>
                                </div>

                                {/* Card 1: Contact Details */}
                                <Card className="shadow-2xs">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                <User className="size-4" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-base font-semibold">
                                                    Información del Cliente
                                                </CardTitle>
                                                <CardDescription className="text-xs">
                                                    Nombre completo y datos de
                                                    identificación
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-4 pt-0">
                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor="nombre"
                                                className="text-xs font-semibold"
                                            >
                                                Nombre Completo *
                                            </Label>
                                            <Input
                                                id="nombre"
                                                name="nombre"
                                                required
                                                autoFocus
                                                placeholder="Ej. Juan Carlos Pérez"
                                                className="h-10"
                                            />
                                            <InputError
                                                message={errors.nombre}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Card 2: Initial Search Interest */}
                                <Card className="shadow-2xs">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="flex size-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                                                    <Tag className="size-4" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-base font-semibold">
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
                                                className="gap-1 text-[11px]"
                                            >
                                                <Sparkles className="size-3 text-primary" />
                                                Auto-Matching
                                            </Badge>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-4 pt-0">
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div className="grid gap-2">
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
                                                    message={errors.etiqueta_id}
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label
                                                    htmlFor="zona"
                                                    className="text-xs font-semibold"
                                                >
                                                    Zona Geográfica Deseada
                                                </Label>
                                                <Input
                                                    id="zona"
                                                    name="zona"
                                                    placeholder="Ej. Col. Palmira, Santa Rosa..."
                                                />
                                                <InputError
                                                    message={errors.zona}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div className="grid gap-2">
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
                                                />
                                                <InputError
                                                    message={
                                                        errors.presupuesto_min
                                                    }
                                                />
                                            </div>

                                            <div className="grid gap-2">
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
                                <div className="flex items-center justify-between gap-3 pt-2">
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={ClienteController.create()}>
                                            <ArrowLeft className="mr-1.5 size-4" />
                                            Volver
                                        </Link>
                                    </Button>

                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="gap-2 px-6"
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
