import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';
import PropiedadController from '@/actions/App/Http/Controllers/Propiedad/PropiedadController';
import PropiedadFotoController from '@/actions/App/Http/Controllers/PropiedadFoto/PropiedadFotoController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

    function generarTextoCompartir() {
        setTextoCompartir(
            buildTextoCompartir(
                propiedad,
                tipos,
                unidadesMedida,
                monedas,
                formasPago,
                condicionesLegales,
            ),
        );
    }

    function copiarTextoCompartir() {
        if (textoCompartir) {
            void navigator.clipboard.writeText(textoCompartir);
        }
    }

    return (
        <>
            <Head title={`${propiedad.tipo} — ${propiedad.zona}`} />

            <div className="max-w-2xl space-y-8 p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <Heading
                        title={`${propiedad.tipo} en ${propiedad.zona}`}
                        description={`${propiedad.moneda} ${propiedad.precio}`}
                    />

                    <div className="flex items-center gap-2">
                        {propiedad.estado !== 'vendida' && (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="default"
                                        size="sm"
                                        className="h-9 bg-emerald-600 text-xs text-white hover:bg-emerald-700"
                                    >
                                        Marcar como vendida
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            ¿Marcar propiedad como vendida?
                                        </DialogTitle>
                                        <DialogDescription>
                                            El estado de la propiedad cambiará a
                                            "Vendida".
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter className="gap-2">
                                        <DialogClose asChild>
                                            <Button variant="secondary">
                                                Cancelar
                                            </Button>
                                        </DialogClose>
                                        <Form
                                            {...PropiedadController.updateEstado.form(
                                                propiedad.id,
                                            )}
                                            options={{ preserveScroll: true }}
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

                        <Form
                            {...PropiedadController.updateEstado.form(
                                propiedad.id,
                            )}
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
                        <h3 className="text-base font-medium">Co-agentes</h3>
                        <ul className="text-sm text-muted-foreground">
                            {propiedad.agentes.map((agente) => (
                                <li key={agente.id}>{agente.agente?.name}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {coincidencias.length > 0 && (
                    <div className="space-y-2">
                        <h3 className="text-base font-medium">
                            Clientes potenciales
                        </h3>
                        <ul className="text-sm">
                            {coincidencias.map((coincidencia) => (
                                <li
                                    key={coincidencia.id}
                                    className="flex items-center gap-2"
                                >
                                    <div>
                                        <span>{coincidencia.cliente?.nombre}</span>
                                        {coincidencia.cliente?.agente_registro && (
                                            <p className="text-xs text-muted-foreground">
                                                Agente: {coincidencia.cliente.agente_registro.name}
                                            </p>
                                        )}
                                    </div>
                                    <Badge variant="secondary">
                                        {coincidencia.estado}
                                    </Badge>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="space-y-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={generarTextoCompartir}
                    >
                        Generar texto para compartir
                    </Button>

                    {textoCompartir && (
                        <div className="grid gap-2">
                            <Textarea
                                readOnly
                                rows={10}
                                value={textoCompartir}
                            />
                            <Button
                                type="button"
                                size="sm"
                                className="w-fit"
                                onClick={copiarTextoCompartir}
                            >
                                Copiar
                            </Button>
                        </div>
                    )}
                </div>

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
