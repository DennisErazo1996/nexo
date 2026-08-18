import { Head, Link, router } from '@inertiajs/react';
import PropiedadController from '@/actions/App/Http/Controllers/Propiedad/PropiedadController';
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
import { index } from '@/routes/propiedades';
import type {
    EnumOption,
    Propiedad,
    PropiedadPaginado,
} from '@/types/propiedad';

type Props = {
    propiedades: PropiedadPaginado;
    filters: { estado?: string; tipo?: string };
    estados: EnumOption[];
    tipos: EnumOption[];
};

export default function PropiedadesIndex({
    propiedades,
    filters,
    estados,
    tipos,
}: Props) {
    function actualizarFiltros(cambios: Partial<Props['filters']>) {
        router.get(
            index().url,
            { ...filters, ...cambios },
            { preserveState: true, replace: true },
        );
    }

    return (
        <>
            <Head title="Propiedades" />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Propiedades"
                        description="Propiedades registradas por el equipo"
                    />
                    <Button asChild>
                        <Link href={PropiedadController.create()}>
                            Nueva propiedad
                        </Link>
                    </Button>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <select
                        value={filters.estado ?? ''}
                        onChange={(event) =>
                            actualizarFiltros({
                                estado: event.target.value || undefined,
                            })
                        }
                        className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                    >
                        <option value="">Todos los estados</option>
                        {estados.map((estado) => (
                            <option key={estado.value} value={estado.value}>
                                {estado.label}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filters.tipo ?? ''}
                        onChange={(event) =>
                            actualizarFiltros({
                                tipo: event.target.value || undefined,
                            })
                        }
                        className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                    >
                        <option value="">Todos los tipos</option>
                        {tipos.map((tipo) => (
                            <option key={tipo.value} value={tipo.value}>
                                {tipo.label}
                            </option>
                        ))}
                    </select>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Foto</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Zona</TableHead>
                            <TableHead>Precio</TableHead>
                            <TableHead>Estado</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {propiedades.data.map((propiedad: Propiedad) => (
                            <TableRow key={propiedad.id}>
                                <TableCell>
                                    {propiedad.fotos?.[0] ? (
                                        <img
                                            src={
                                                propiedad.fotos[0]
                                                    .url_con_marca_agua
                                            }
                                            alt=""
                                            className="h-12 w-12 rounded-md object-cover"
                                        />
                                    ) : (
                                        <div className="h-12 w-12 rounded-md bg-muted" />
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Link
                                        href={PropiedadController.show(
                                            propiedad.id,
                                        )}
                                        className="font-medium hover:underline"
                                    >
                                        {tipos.find(
                                            (t) => t.value === propiedad.tipo,
                                        )?.label ?? propiedad.tipo}
                                    </Link>
                                </TableCell>
                                <TableCell>{propiedad.zona}</TableCell>
                                <TableCell>
                                    {propiedad.moneda} {propiedad.precio}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary">
                                        {estados.find(
                                            (e) => e.value === propiedad.estado,
                                        )?.label ?? propiedad.estado}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {propiedades.data.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                        No hay propiedades que coincidan con los filtros.
                    </p>
                )}

                {propiedades.last_page > 1 && (
                    <div className="flex flex-wrap gap-2">
                        {propiedades.links.map((link, i) => (
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

PropiedadesIndex.layout = {
    breadcrumbs: [{ title: 'Propiedades', href: index() }],
};
