import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';
import ClienteInteresController from '@/actions/App/Http/Controllers/ClienteInteres/ClienteInteresController';
import CoincidenciaController from '@/actions/App/Http/Controllers/Coincidencia/CoincidenciaController';
import NotaSeguimientoController from '@/actions/App/Http/Controllers/NotaSeguimiento/NotaSeguimientoController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { index } from '@/routes/clientes';
import { Check, X } from 'lucide-react';
import type { Cliente, EstadoOption, EtiquetaInteres } from '@/types/cliente';
import type { Coincidencia, EstadoCoincidencia } from '@/types/coincidencia';

type Props = {
    cliente: Cliente;
    coincidencias: Coincidencia[];
    etiquetas: EtiquetaInteres[];
    estados: EstadoOption[];
    estadosCoincidencia: { value: EstadoCoincidencia; label: string }[];
};

export default function ClienteShow({
    cliente,
    coincidencias,
    etiquetas,
    estadosCoincidencia,
}: Props) {
    const [isInteresDialogOpen, setIsInteresDialogOpen] = useState(false);

    return (
        <>
            <Head title={cliente.nombre} />

            <div className="max-w-2xl space-y-8 p-4">
                <div className="flex items-start justify-between gap-4">
                    <Heading
                        title={cliente.nombre}
                        description={cliente.telefono}
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-medium">Intereses</h3>
                        <Dialog
                            open={isInteresDialogOpen}
                            onOpenChange={setIsInteresDialogOpen}
                        >
                            <DialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                    Agregar interés
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Agregar interés</DialogTitle>
                                </DialogHeader>
                                <Form
                                    {...ClienteInteresController.store.form(
                                        cliente.id,
                                    )}
                                    resetOnSuccess
                                    onSuccess={() =>
                                        setIsInteresDialogOpen(false)
                                    }
                                    className="space-y-4"
                                >
                                    {({ processing, errors }) => (
                                        <>
                                            <div className="grid gap-2">
                                                <Label htmlFor="etiqueta_id">
                                                    Interés
                                                </Label>
                                                <select
                                                    id="etiqueta_id"
                                                    name="etiqueta_id"
                                                    required
                                                    className="h-9 rounded-md border border-input bg-background px-3 text-sm"
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
                                                <Label htmlFor="zona">
                                                    Zona
                                                </Label>
                                                <Input id="zona" name="zona" />
                                                <InputError
                                                    message={errors.zona}
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="presupuesto_min">
                                                        Presupuesto mín.
                                                    </Label>
                                                    <Input
                                                        id="presupuesto_min"
                                                        name="presupuesto_min"
                                                        type="number"
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
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.presupuesto_max
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <DialogFooter>
                                                <Button
                                                    type="submit"
                                                    disabled={processing}
                                                >
                                                    Agregar
                                                </Button>
                                            </DialogFooter>
                                        </>
                                    )}
                                </Form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="space-y-2">
                        {cliente.intereses?.map((interes) => (
                            <div
                                key={interes.id}
                                className="flex flex-wrap items-center gap-2 rounded-lg border p-3"
                            >
                                <Badge>{interes.etiqueta?.nombre}</Badge>
                                {interes.zona && (
                                    <span className="text-sm text-muted-foreground">
                                        {interes.zona}
                                    </span>
                                )}
                                {(interes.presupuesto_min ||
                                    interes.presupuesto_max) && (
                                    <span className="text-sm text-muted-foreground">
                                        {interes.presupuesto_min ?? '?'} -{' '}
                                        {interes.presupuesto_max ?? '?'}
                                    </span>
                                )}
                                <Form
                                    {...ClienteInteresController.destroy.form([
                                        cliente.id,
                                        interes.id,
                                    ])}
                                    options={{ preserveScroll: true }}
                                    className="ml-auto"
                                >
                                    {({ processing }) => (
                                        <Button
                                            type="submit"
                                            size="sm"
                                            variant="ghost"
                                            disabled={processing}
                                        >
                                            Eliminar
                                        </Button>
                                    )}
                                </Form>
                            </div>
                        ))}
                        {cliente.intereses?.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                                Sin intereses registrados.
                            </p>
                        )}
                    </div>
                </div>

                {coincidencias.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="text-base font-medium">
                            Propiedades potenciales
                        </h3>
                        <ul className="space-y-2">
                            {coincidencias.map((coincidencia) => (
                                <li
                                    key={coincidencia.id}
                                    className="flex flex-col justify-between gap-3 rounded-lg border p-3 sm:flex-row sm:items-center"
                                >
                                    <div>
                                        <p className="font-medium text-sm">
                                            {coincidencia.propiedad?.tipo} en{' '}
                                            {coincidencia.propiedad?.zona} —{' '}
                                            {coincidencia.propiedad?.moneda}{' '}
                                            {coincidencia.propiedad?.precio}
                                        </p>
                                        {coincidencia.propiedad?.agentes &&
                                            coincidencia.propiedad.agentes
                                                .length > 0 && (
                                                <p className="text-xs text-muted-foreground">
                                                    {coincidencia.propiedad
                                                        .agentes.length > 1
                                                        ? 'Agentes:'
                                                        : 'Agente:'}{' '}
                                                    {coincidencia.propiedad.agentes
                                                        .map(
                                                            (a) =>
                                                                a.agente?.name,
                                                        )
                                                        .filter(Boolean)
                                                        .join(', ')}
                                                </p>
                                            )}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                        {coincidencia.estado === 'pendiente' ? (
                                            <>
                                                <Badge variant="secondary">
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
                                                    {({ processing }) => (
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
                                                                className="h-8 gap-1 px-2.5 text-xs"
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
                                                    {({ processing }) => (
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
                                                                className="h-8 gap-1 px-2 text-xs text-muted-foreground hover:text-destructive"
                                                                title="Descartar"
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
                                                {({ processing }) => (
                                                    <select
                                                        name="estado"
                                                        defaultValue={
                                                            coincidencia.estado
                                                        }
                                                        disabled={processing}
                                                        onChange={(event) =>
                                                            event.target.form?.requestSubmit()
                                                        }
                                                        className="h-8 rounded-md border border-input bg-background px-2.5 text-xs font-medium"
                                                    >
                                                        {estadosCoincidencia
                                                            .filter(
                                                                (e) =>
                                                                    e.value !==
                                                                    'pendiente',
                                                            )
                                                            .map((estado) => (
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
                                                            ))}
                                                    </select>
                                                )}
                                            </Form>
                                        )}

                                        <Form
                                            {...CoincidenciaController.destroy.form(
                                                coincidencia.id,
                                            )}
                                            options={{ preserveScroll: true }}
                                        >
                                            {({ processing }) => (
                                                <Button
                                                    type="submit"
                                                    size="sm"
                                                    variant="ghost"
                                                    disabled={processing}
                                                    className="h-8 text-xs text-muted-foreground hover:text-destructive"
                                                >
                                                    Eliminar
                                                </Button>
                                            )}
                                        </Form>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="space-y-4">
                    <h3 className="text-base font-medium">
                        Notas de seguimiento
                    </h3>

                    <Form
                        {...NotaSeguimientoController.store.form(cliente.id)}
                        resetOnSuccess
                        className="space-y-3"
                    >
                        {({ processing, errors }) => (
                            <div className="grid gap-2">
                                {coincidencias.length > 0 && (
                                    <div className="grid gap-1">
                                        <Label
                                            htmlFor="propiedad_id"
                                            className="text-xs text-muted-foreground"
                                        >
                                            Propiedad relacionada (opcional)
                                        </Label>
                                        <select
                                            id="propiedad_id"
                                            name="propiedad_id"
                                            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                                        >
                                            <option value="">
                                                General (sin propiedad
                                                específica)
                                            </option>
                                            {coincidencias.map(
                                                (c) =>
                                                    c.propiedad && (
                                                        <option
                                                            key={c.propiedad.id}
                                                            value={
                                                                c.propiedad.id
                                                            }
                                                        >
                                                            {c.propiedad.tipo}{' '}
                                                            en{' '}
                                                            {c.propiedad.zona} (
                                                            {
                                                                c.propiedad
                                                                    .moneda
                                                            }{' '}
                                                            {
                                                                c.propiedad
                                                                    .precio
                                                            }
                                                            )
                                                        </option>
                                                    ),
                                            )}
                                        </select>
                                    </div>
                                )}
                                <Textarea
                                    name="texto"
                                    placeholder="Nueva nota..."
                                    required
                                />
                                <InputError message={errors.texto} />
                                <Button
                                    type="submit"
                                    size="sm"
                                    disabled={processing}
                                    className="w-fit"
                                >
                                    Agregar nota
                                </Button>
                            </div>
                        )}
                    </Form>

                    <div className="space-y-3">
                        {cliente.notas?.map((nota) => (
                            <div
                                key={nota.id}
                                className="space-y-1.5 rounded-lg border p-3"
                            >
                                {nota.propiedad && (
                                    <Badge
                                        variant="outline"
                                        className="text-xs font-normal"
                                    >
                                        {nota.propiedad.tipo} en{' '}
                                        {nota.propiedad.zona}
                                    </Badge>
                                )}
                                <p className="text-sm">{nota.texto}</p>
                                <p className="text-xs text-muted-foreground">
                                    {nota.agente?.name} ·{' '}
                                    {new Date(
                                        nota.created_at,
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                        {cliente.notas?.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                                Sin notas de seguimiento.
                            </p>
                        )}
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
