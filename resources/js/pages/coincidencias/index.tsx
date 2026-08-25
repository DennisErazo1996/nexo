import { Form, Head, Link } from '@inertiajs/react';
import CoincidenciaController from '@/actions/App/Http/Controllers/Coincidencia/CoincidenciaController';
import PropiedadController from '@/actions/App/Http/Controllers/Propiedad/PropiedadController';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { index } from '@/routes/coincidencias';
import type { Coincidencia, CoincidenciaPaginado } from '@/types/coincidencia';

type Props = {
    coincidencias: CoincidenciaPaginado;
};

export default function CoincidenciasIndex({ coincidencias }: Props) {
    return (
        <>
            <Head title="Coincidencias" />

            <div className="space-y-6 p-4">
                <Heading
                    title="Coincidencias"
                    description="Clientes potenciales pendientes de contactar"
                />

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Propiedad</TableHead>
                            <TableHead>Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {coincidencias.data.map(
                            (coincidencia: Coincidencia) => (
                                <TableRow key={coincidencia.id}>
                                    <TableCell>
                                        <p className="font-medium">
                                            {coincidencia.cliente?.nombre}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {coincidencia.cliente?.telefono}
                                        </p>
                                        {coincidencia.cliente
                                            ?.agente_registro && (
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                <span className="font-medium text-foreground/80">
                                                    Agente:
                                                </span>{' '}
                                                {
                                                    coincidencia.cliente
                                                        .agente_registro.name
                                                }
                                            </p>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {coincidencia.propiedad && (
                                            <>
                                                <Link
                                                    href={PropiedadController.show(
                                                        coincidencia.propiedad
                                                            .id,
                                                    )}
                                                    className="font-medium hover:underline"
                                                >
                                                    {
                                                        coincidencia.propiedad
                                                            .tipo
                                                    }{' '}
                                                    en{' '}
                                                    {
                                                        coincidencia.propiedad
                                                            .zona
                                                    }{' '}
                                                    —{' '}
                                                    {
                                                        coincidencia.propiedad
                                                            .moneda
                                                    }{' '}
                                                    {
                                                        coincidencia.propiedad
                                                            .precio
                                                    }
                                                </Link>
                                                {coincidencia.propiedad
                                                    .agentes &&
                                                    coincidencia.propiedad
                                                        .agentes.length >
                                                        0 && (
                                                        <p className="mt-1 text-xs text-muted-foreground">
                                                            <span className="font-medium text-foreground/80">
                                                                {coincidencia
                                                                    .propiedad
                                                                    .agentes
                                                                    .length > 1
                                                                    ? 'Agentes:'
                                                                    : 'Agente:'}
                                                            </span>{' '}
                                                            {coincidencia.propiedad.agentes
                                                                .map(
                                                                    (a) =>
                                                                        a.agente
                                                                            ?.name,
                                                                )
                                                                .filter(Boolean)
                                                                .join(', ')}
                                                        </p>
                                                    )}
                                            </>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
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
                                                        >
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
                                                        >
                                                            Descartar
                                                        </Button>
                                                    </>
                                                )}
                                            </Form>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ),
                        )}
                    </TableBody>
                </Table>

                {coincidencias.data.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                        No hay coincidencias pendientes.
                    </p>
                )}
            </div>
        </>
    );
}

CoincidenciasIndex.layout = {
    breadcrumbs: [{ title: 'Coincidencias', href: index() }],
};
