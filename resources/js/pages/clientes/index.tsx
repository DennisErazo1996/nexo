import { Head, Link, router } from '@inertiajs/react';
import ClienteController from '@/actions/App/Http/Controllers/Cliente/ClienteController';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { index } from '@/routes/clientes';
import type {
    Cliente,
    ClientePaginado,
    EstadoCliente,
    EstadoOption,
} from '@/types/cliente';

type Props = {
    clientes: ClientePaginado;
    filters: { estado?: EstadoCliente; sin_seguimiento?: string };
    estados: EstadoOption[];
};

export default function ClientesIndex({ clientes, filters, estados }: Props) {
    function actualizarFiltros(cambios: Partial<Props['filters']>) {
        router.get(
            index().url,
            { ...filters, ...cambios },
            { preserveState: true, replace: true },
        );
    }

    return (
        <>
            <Head title="Clientes" />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Clientes"
                        description="Clientes potenciales del equipo"
                    />
                    <Button asChild>
                        <Link href={ClienteController.create()}>
                            Nuevo cliente
                        </Link>
                    </Button>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <select
                        value={filters.estado ?? ''}
                        onChange={(event) =>
                            actualizarFiltros({
                                estado: (event.target.value || undefined) as
                                    EstadoCliente | undefined,
                            })
                        }
                        className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                    >
                        <option value="">Todos los estados</option>
                        {estados.map((estado) => (
                            <option key={estado.value} value={estado.value}>
                                {estado.label}
                            </option>
                        ))}
                    </select>

                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={filters.sin_seguimiento === '1'}
                            onChange={(event) =>
                                actualizarFiltros({
                                    sin_seguimiento: event.target.checked
                                        ? '1'
                                        : undefined,
                                })
                            }
                        />
                        Sin seguimiento reciente
                    </label>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Teléfono</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Registrado por</TableHead>
                            <TableHead>Última nota</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clientes.data.map((cliente: Cliente) => (
                            <TableRow key={cliente.id}>
                                <TableCell>
                                    <Link
                                        href={ClienteController.show(
                                            cliente.id,
                                        )}
                                        className="font-medium hover:underline"
                                    >
                                        {cliente.nombre}
                                    </Link>
                                </TableCell>
                                <TableCell>{cliente.telefono}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary">
                                        {estados.find(
                                            (e) => e.value === cliente.estado,
                                        )?.label ?? cliente.estado}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {cliente.agenteRegistro?.name}
                                </TableCell>
                                <TableCell>
                                    {cliente.notas_max_created_at
                                        ? new Date(
                                              cliente.notas_max_created_at,
                                          ).toLocaleDateString()
                                        : '—'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {clientes.data.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                        No hay clientes que coincidan con los filtros.
                    </p>
                )}

                {clientes.last_page > 1 && (
                    <div className="flex flex-wrap gap-2">
                        {clientes.links.map((link, i) => (
                            <Button
                                key={i}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url)}
                            >
                                {link.label
                                    .replace(/&laquo;|&raquo;/g, '')
                                    .trim()}
                            </Button>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

ClientesIndex.layout = {
    breadcrumbs: [{ title: 'Clientes', href: index() }],
};
