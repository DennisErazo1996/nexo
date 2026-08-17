import { Form, Head } from '@inertiajs/react';
import ClienteController from '@/actions/App/Http/Controllers/Cliente/ClienteController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
            <Head title="Nuevo cliente" />

            <div className="max-w-md space-y-6 p-4">
                {step === 'telefono' ? (
                    <Form
                        {...ClienteController.buscar.form()}
                        className="space-y-4"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="telefono">Teléfono</Label>
                                    <Input
                                        id="telefono"
                                        name="telefono"
                                        type="tel"
                                        required
                                        autoFocus
                                        placeholder="9988-7766"
                                    />
                                    <InputError message={errors.telefono} />
                                </div>
                                <Button type="submit" disabled={processing}>
                                    Buscar
                                </Button>
                            </>
                        )}
                    </Form>
                ) : (
                    <Form
                        {...ClienteController.store.form()}
                        className="space-y-4"
                    >
                        {({ processing, errors }) => (
                            <>
                                <input
                                    type="hidden"
                                    name="telefono"
                                    value={telefono}
                                />

                                <p className="text-sm text-muted-foreground">
                                    Teléfono:{' '}
                                    <span className="font-medium text-foreground">
                                        {telefono}
                                    </span>
                                </p>

                                <div className="grid gap-2">
                                    <Label htmlFor="nombre">Nombre</Label>
                                    <Input
                                        id="nombre"
                                        name="nombre"
                                        required
                                        autoFocus
                                    />
                                    <InputError message={errors.nombre} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="etiqueta_id">Interés</Label>
                                    <select
                                        id="etiqueta_id"
                                        name="etiqueta_id"
                                        required
                                        className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                                    >
                                        {etiquetas.map((etiqueta) => (
                                            <option
                                                key={etiqueta.id}
                                                value={etiqueta.id}
                                            >
                                                {etiqueta.nombre}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.etiqueta_id} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="zona">Zona</Label>
                                    <Input id="zona" name="zona" />
                                    <InputError message={errors.zona} />
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
                                            message={errors.presupuesto_min}
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
                                            message={errors.presupuesto_max}
                                        />
                                    </div>
                                </div>

                                <Button type="submit" disabled={processing}>
                                    Crear cliente
                                </Button>
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
