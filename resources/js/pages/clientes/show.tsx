import { Form, Head } from '@inertiajs/react';
import ClienteController from '@/actions/App/Http/Controllers/Cliente/ClienteController';
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
import type { Cliente, EstadoOption, EtiquetaInteres } from '@/types/cliente';
import type { Coincidencia } from '@/types/coincidencia';

type Props = {
    cliente: Cliente;
    coincidencias: Coincidencia[];
    etiquetas: EtiquetaInteres[];
    estados: EstadoOption[];
};

export default function ClienteShow({
    cliente,
    coincidencias,
    etiquetas,
    estados,
}: Props) {
    return (
        <>
            <Head title={cliente.nombre} />

            <div className="max-w-2xl space-y-8 p-4">
                <div className="flex items-start justify-between gap-4">
                    <Heading
                        title={cliente.nombre}
                        description={cliente.telefono}
                    />

                    <Form
                        {...ClienteController.updateEstado.form(cliente.id)}
                        options={{ preserveScroll: true }}
                    >
                        {({ processing }) => (
                            <select
                                name="estado"
                                defaultValue={cliente.estado}
                                disabled={processing}
                                onChange={(event) =>
                                    event.target.form?.requestSubmit()
                                }
                                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                            >
                                {estados.map((estado) => (
                                    <option
                                        key={estado.value}
                                        value={estado.value}
                                    >
                                        {estado.label}
                                    </option>
                                ))}
                            </select>
                        )}
                    </Form>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-medium">Intereses</h3>
                        <Dialog>
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
                    <div className="space-y-2">
                        <h3 className="text-base font-medium">
                            Propiedades potenciales
                        </h3>
                        <ul className="text-sm">
                            {coincidencias.map((coincidencia) => (
                                <li
                                    key={coincidencia.id}
                                    className="flex items-center gap-2"
                                >
                                    <span>
                                        {coincidencia.propiedad?.tipo} en{' '}
                                        {coincidencia.propiedad?.zona} —{' '}
                                        {coincidencia.propiedad?.moneda}{' '}
                                        {coincidencia.propiedad?.precio}
                                    </span>
                                    <Badge variant="secondary">
                                        {coincidencia.estado}
                                    </Badge>
                                    <Form
                                        {...CoincidenciaController.destroy.form(
                                            coincidencia.id,
                                        )}
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
                        className="space-y-2"
                    >
                        {({ processing, errors }) => (
                            <>
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
                                >
                                    Agregar nota
                                </Button>
                            </>
                        )}
                    </Form>

                    <div className="space-y-3">
                        {cliente.notas?.map((nota) => (
                            <div
                                key={nota.id}
                                className="rounded-lg border p-3"
                            >
                                <p className="text-sm">{nota.texto}</p>
                                <p className="mt-1 text-xs text-muted-foreground">
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
