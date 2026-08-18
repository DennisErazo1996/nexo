import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';
import PropiedadController from '@/actions/App/Http/Controllers/Propiedad/PropiedadController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
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

    function onFotosChange(event: React.ChangeEvent<HTMLInputElement>) {
        const files = event.target.files ? Array.from(event.target.files) : [];
        setPreviews(files.map((file) => URL.createObjectURL(file)));
    }

    return (
        <>
            <Head title="Nueva propiedad" />

            <Form
                {...PropiedadController.store.form()}
                className="max-w-2xl space-y-6 p-4"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="tipo">Tipo</Label>
                                <select
                                    id="tipo"
                                    name="tipo"
                                    required
                                    className="h-9 rounded-md border border-input bg-background px-3 text-sm"
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
                                <Label htmlFor="zona">Zona</Label>
                                <Input id="zona" name="zona" required />
                                <InputError message={errors.zona} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="tamano">Tamaño</Label>
                                <Input
                                    id="tamano"
                                    name="tamano"
                                    type="number"
                                    step="0.01"
                                    required
                                />
                                <InputError message={errors.tamano} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="unidad_medida">
                                    Unidad de medida
                                </Label>
                                <select
                                    id="unidad_medida"
                                    name="unidad_medida"
                                    required
                                    className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                                >
                                    {unidadesMedida.map((unidad) => (
                                        <option
                                            key={unidad.value}
                                            value={unidad.value}
                                        >
                                            {unidad.label}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.unidad_medida} />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="precio">Precio</Label>
                                <Input
                                    id="precio"
                                    name="precio"
                                    type="number"
                                    step="0.01"
                                    required
                                />
                                <InputError message={errors.precio} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="moneda">Moneda</Label>
                                <select
                                    id="moneda"
                                    name="moneda"
                                    required
                                    className="h-9 rounded-md border border-input bg-background px-3 text-sm"
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
                                <InputError message={errors.moneda} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="forma_pago">
                                    Forma de pago
                                </Label>
                                <select
                                    id="forma_pago"
                                    name="forma_pago"
                                    required
                                    className="h-9 rounded-md border border-input bg-background px-3 text-sm"
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
                                <InputError message={errors.forma_pago} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="condicion_legal">
                                Condición legal
                            </Label>
                            <select
                                id="condicion_legal"
                                name="condicion_legal"
                                defaultValue=""
                                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                            >
                                <option value="">Sin especificar</option>
                                {condicionesLegales.map((condicion) => (
                                    <option
                                        key={condicion.value}
                                        value={condicion.value}
                                    >
                                        {condicion.label}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.condicion_legal} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="acceso">Acceso</Label>
                            <Textarea
                                id="acceso"
                                name="acceso"
                                placeholder="Distancia a pavimento, tiempo desde la ciudad, tipo de vía..."
                            />
                            <InputError message={errors.acceso} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="descripcion">Descripción</Label>
                            <Textarea id="descripcion" name="descripcion" />
                            <InputError message={errors.descripcion} />
                        </div>

                        <div className="grid gap-2">
                            <Label>Etiquetas de uso</Label>
                            <div className="flex flex-wrap gap-4">
                                {etiquetas.map((etiqueta) => (
                                    <label
                                        key={etiqueta.id}
                                        className="flex items-center gap-2 text-sm"
                                    >
                                        <Checkbox
                                            name="etiquetas[]"
                                            value={String(etiqueta.id)}
                                        />
                                        {etiqueta.nombre}
                                    </label>
                                ))}
                            </div>
                            <InputError message={errors.etiquetas} />
                        </div>

                        <div className="grid gap-2">
                            <Label>Co-listers</Label>
                            <div className="flex flex-wrap gap-4">
                                {agentes.map((agente) => (
                                    <label
                                        key={agente.id}
                                        className="flex items-center gap-2 text-sm"
                                    >
                                        <Checkbox
                                            name="agentes[]"
                                            value={String(agente.id)}
                                        />
                                        {agente.name}
                                    </label>
                                ))}
                            </div>
                            <InputError message={errors.agentes} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="fotos">Fotos</Label>
                            <input
                                id="fotos"
                                name="fotos[]"
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={onFotosChange}
                                className="text-sm"
                            />
                            <InputError message={errors.fotos} />
                            {Object.entries(errors)
                                .filter(([key]) => key.startsWith('fotos.'))
                                .map(([key, message]) => (
                                    <InputError key={key} message={message} />
                                ))}

                            {previews.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {previews.map((src, index) => (
                                        <img
                                            key={index}
                                            src={src}
                                            alt=""
                                            className="h-20 w-20 rounded-md object-cover"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        <Button type="submit" disabled={processing}>
                            Crear propiedad
                        </Button>
                    </>
                )}
            </Form>
        </>
    );
}

PropiedadCreate.layout = {
    breadcrumbs: [
        { title: 'Propiedades', href: index() },
        { title: 'Nueva', href: PropiedadController.create() },
    ],
};
