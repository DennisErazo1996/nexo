import { Form, Head } from '@inertiajs/react';
import PropiedadController from '@/actions/App/Http/Controllers/Propiedad/PropiedadController';
import PropiedadFotoController from '@/actions/App/Http/Controllers/PropiedadFoto/PropiedadFotoController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { index } from '@/routes/propiedades';
import type { EnumOption, Propiedad } from '@/types/propiedad';

type Props = {
    propiedad: Propiedad;
    estados: EnumOption[];
};

export default function PropiedadShow({ propiedad, estados }: Props) {
    return (
        <>
            <Head title={`${propiedad.tipo} — ${propiedad.zona}`} />

            <div className="max-w-2xl space-y-8 p-4">
                <div className="flex items-start justify-between gap-4">
                    <Heading
                        title={`${propiedad.tipo} en ${propiedad.zona}`}
                        description={`${propiedad.moneda} ${propiedad.precio}`}
                    />

                    <Form
                        {...PropiedadController.updateEstado.form(propiedad.id)}
                        options={{ preserveScroll: true }}
                    >
                        {({ processing }) => (
                            <select
                                name="estado"
                                defaultValue={propiedad.estado}
                                disabled={processing}
                                onChange={(event) =>
                                    event.target.form?.requestSubmit()
                                }
                                className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
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

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-muted-foreground">Tamaño</p>
                        <p>
                            {propiedad.tamano} {propiedad.unidad_medida}
                        </p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Forma de pago</p>
                        <p>{propiedad.forma_pago}</p>
                    </div>
                    {propiedad.condicion_legal && (
                        <div>
                            <p className="text-muted-foreground">
                                Condición legal
                            </p>
                            <p>{propiedad.condicion_legal}</p>
                        </div>
                    )}
                    {propiedad.acceso && (
                        <div className="col-span-2">
                            <p className="text-muted-foreground">Acceso</p>
                            <p>{propiedad.acceso}</p>
                        </div>
                    )}
                    {propiedad.descripcion && (
                        <div className="col-span-2">
                            <p className="text-muted-foreground">Descripción</p>
                            <p>{propiedad.descripcion}</p>
                        </div>
                    )}
                </div>

                {propiedad.etiquetas && propiedad.etiquetas.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {propiedad.etiquetas.map((etiqueta) => (
                            <Badge key={etiqueta.id}>
                                {etiqueta.etiqueta?.nombre}
                            </Badge>
                        ))}
                    </div>
                )}

                {propiedad.agentes && propiedad.agentes.length > 0 && (
                    <div className="space-y-2">
                        <h3 className="text-base font-medium">Co-listers</h3>
                        <ul className="text-sm text-muted-foreground">
                            {propiedad.agentes.map((agente) => (
                                <li key={agente.id}>{agente.agente?.name}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="space-y-4">
                    <h3 className="text-base font-medium">Fotos</h3>

                    <div className="grid grid-cols-3 gap-3">
                        {propiedad.fotos?.map((foto) => (
                            <div key={foto.id} className="relative">
                                <img
                                    src={foto.url_con_marca_agua}
                                    alt=""
                                    className="aspect-square w-full rounded-md object-cover"
                                />
                                <Form
                                    {...PropiedadFotoController.destroy.form([
                                        propiedad.id,
                                        foto.id,
                                    ])}
                                    options={{ preserveScroll: true }}
                                >
                                    {({ processing }) => (
                                        <Button
                                            type="submit"
                                            variant="destructive"
                                            size="sm"
                                            disabled={processing}
                                            className="absolute top-1 right-1"
                                        >
                                            Eliminar
                                        </Button>
                                    )}
                                </Form>
                            </div>
                        ))}
                        {propiedad.fotos?.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                                Sin fotos.
                            </p>
                        )}
                    </div>

                    <Form
                        {...PropiedadFotoController.store.form(propiedad.id)}
                        options={{ preserveScroll: true }}
                    >
                        {({ processing, errors }) => (
                            <div className="grid gap-2">
                                <input
                                    name="fotos[]"
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="text-sm"
                                />
                                <InputError message={errors.fotos} />
                                <Button
                                    type="submit"
                                    size="sm"
                                    disabled={processing}
                                    className="w-fit"
                                >
                                    Agregar fotos
                                </Button>
                            </div>
                        )}
                    </Form>
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
