import { Form, Head, Link, router } from '@inertiajs/react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import type { ColumnDef, VisibilityState } from '@tanstack/react-table';
import {
    ArrowUpRight,
    Calendar,
    MessageCircle,
    Phone,
    Route,
    Search,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import ClienteController from '@/actions/App/Http/Controllers/Cliente/ClienteController';
import CoincidenciaController from '@/actions/App/Http/Controllers/Coincidencia/CoincidenciaController';
import PropiedadController from '@/actions/App/Http/Controllers/Propiedad/PropiedadController';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { DataTablePagination } from '@/components/data-table/data-table-pagination';
import { DataTableViewOptions } from '@/components/data-table/data-table-view-options';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { cn, formatMunicipio, formatTipoPropiedad } from '@/lib/utils';
import { index } from '@/routes/seguimientos';
import type {
    Coincidencia,
    CoincidenciaPaginado,
    EstadoCoincidencia,
} from '@/types/coincidencia';

type EstadoOption = { value: EstadoCoincidencia; label: string };

type Props = {
    coincidencias: CoincidenciaPaginado;
    filters: {
        search?: string;
        estado?: EstadoCoincidencia;
        sort?: string;
        direction?: string;
    };
    estados: EstadoOption[];
};

const ESTADO_COINCIDENCIA_STYLES: Record<
    EstadoCoincidencia,
    { bg: string; text: string; border: string }
> = {
    pendiente: {
        bg: 'bg-blue-500/10 dark:bg-blue-500/20',
        text: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-200 dark:border-blue-800/60',
    },
    notificado: {
        bg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
        text: 'text-indigo-700 dark:text-indigo-300',
        border: 'border-indigo-200 dark:border-indigo-800/60',
    },
    visitando: {
        bg: 'bg-amber-500/10 dark:bg-amber-500/20',
        text: 'text-amber-700 dark:text-amber-300',
        border: 'border-amber-200 dark:border-amber-800/60',
    },
    negociando: {
        bg: 'bg-purple-500/10 dark:bg-purple-500/20',
        text: 'text-purple-700 dark:text-purple-300',
        border: 'border-purple-200 dark:border-purple-800/60',
    },
    cerrado: {
        bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
        text: 'text-emerald-700 dark:text-emerald-300',
        border: 'border-emerald-200 dark:border-emerald-800/60',
    },
    descartado: {
        bg: 'bg-rose-500/10 dark:bg-rose-500/20',
        text: 'text-rose-700 dark:text-rose-300',
        border: 'border-rose-200 dark:border-rose-800/60',
    },
};

function getInitials(name: string): string {
    const parts = name.trim().split(/\s+/);

    if (parts.length === 0 || !parts[0]) {
        return 'CL';
    }

    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function cleanPhoneForWhatsApp(phone: string): string {
    return phone.replace(/\D/g, '');
}

function cleanPhoneForTel(phone: string): string {
    return phone.replace(/[^\d+]/g, '');
}

function formatCurrency(amount: string | number | null | undefined): string {
    if (!amount) {
        return '';
    }

    const num = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (isNaN(num)) {
        return String(amount);
    }

    return num.toLocaleString('es-HN');
}

export default function SeguimientosIndex({
    coincidencias,
    filters,
    estados,
}: Props) {
    const [searchValue, setSearchValue] = useState(filters.search ?? '');
    const debouncedSearch = useDebounce(searchValue, 350);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {},
    );

    function actualizarFiltros(cambios: Partial<Props['filters']>) {
        router.get(
            index().url,
            { ...filters, ...cambios },
            { preserveState: true, replace: true },
        );
    }

    // Synchronize debounced search with server
    useEffect(() => {
        if (debouncedSearch !== (filters.search ?? '')) {
            actualizarFiltros({
                search: debouncedSearch || undefined,
            });
        }
    }, [debouncedSearch]);

    const columns = useMemo<ColumnDef<Coincidencia>[]>(
        () => [
            {
                accessorKey: 'cliente',
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title="Cliente" />
                ),
                cell: ({ row }) => {
                    const cliente = row.original.cliente;

                    if (!cliente) {
                        return <span className="text-muted-foreground">—</span>;
                    }

                    return (
                        <div className="flex items-center gap-3">
                            <Avatar className="size-8 border border-primary/20 bg-primary/10 text-primary">
                                <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                                    {getInitials(cliente.nombre)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <Link
                                    href={ClienteController.show(cliente.id)}
                                    className="group inline-flex items-center gap-1 font-semibold text-foreground transition-colors hover:text-primary"
                                >
                                    <span>{cliente.nombre}</span>
                                    <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                                </Link>
                                <div className="flex items-center gap-2 pt-0.5">
                                    <span className="font-mono text-[11px] text-muted-foreground">
                                        {cliente.telefono}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            asChild
                                            variant="ghost"
                                            size="icon"
                                            className="size-5 text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
                                            title="WhatsApp"
                                        >
                                            <a
                                                href={`https://wa.me/${cleanPhoneForWhatsApp(cliente.telefono)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <MessageCircle className="size-3" />
                                            </a>
                                        </Button>
                                        <Button
                                            asChild
                                            variant="ghost"
                                            size="icon"
                                            className="size-5 text-sky-600 hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-sky-950/40"
                                            title="Llamar"
                                        >
                                            <a
                                                href={`tel:${cleanPhoneForTel(cliente.telefono)}`}
                                            >
                                                <Phone className="size-3" />
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'propiedad',
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title="Propiedad" />
                ),
                cell: ({ row }) => {
                    const propiedad = row.original.propiedad;

                    if (!propiedad) {
                        return <span className="text-muted-foreground">—</span>;
                    }

                    return (
                        <div>
                            <Link
                                href={PropiedadController.show(propiedad.id)}
                                className="group inline-flex items-center gap-1 font-semibold text-foreground transition-colors hover:text-primary"
                            >
                                <span>
                                    {formatTipoPropiedad(propiedad.tipo)} en {formatMunicipio(propiedad.zona)}
                                </span>
                                <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                            </Link>
                            <div className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                                <span className="font-semibold text-foreground">
                                    {propiedad.moneda}{' '}
                                    {formatCurrency(propiedad.precio)}
                                </span>
                                {propiedad.agentes &&
                                    propiedad.agentes.length > 0 && (
                                        <span>
                                            • Agente:{' '}
                                            {propiedad.agentes
                                                .map((a) => a.agente?.name)
                                                .filter(Boolean)
                                                .join(', ')}
                                        </span>
                                    )}
                            </div>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'estado',
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title="Estado" />
                ),
                cell: ({ row }) => {
                    const coincidencia = row.original;
                    const style =
                        ESTADO_COINCIDENCIA_STYLES[coincidencia.estado];

                    return (
                        <Form
                            {...CoincidenciaController.updateEstado.form(
                                coincidencia.id,
                            )}
                            options={{ preserveScroll: true }}
                        >
                            {({ processing }) => (
                                <select
                                    name="estado"
                                    defaultValue={coincidencia.estado}
                                    disabled={processing}
                                    onChange={(event) =>
                                        event.target.form?.requestSubmit()
                                    }
                                    className={cn(
                                        'h-7 cursor-pointer rounded-full border px-3 text-xs font-semibold tracking-wider uppercase transition-colors focus:ring-2 focus:ring-ring/40 focus:outline-hidden',
                                        style.bg,
                                        style.text,
                                        style.border,
                                    )}
                                >
                                    {estados.map((estado) => (
                                        <option
                                            key={estado.value}
                                            value={estado.value}
                                            className="bg-popover text-xs text-popover-foreground"
                                        >
                                            {estado.label}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </Form>
                    );
                },
            },
            {
                accessorKey: 'created_at',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title="Fecha Match"
                    />
                ),
                cell: ({ row }) => (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="size-3.5 text-muted-foreground/70" />
                        <span>
                            {new Date(
                                row.original.created_at,
                            ).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                            })}
                        </span>
                    </div>
                ),
            },
        ],
        [estados],
    );

    // Sorting state handler connected to server-side query
    const sorting = useMemo(() => {
        if (!filters.sort) {
            return [];
        }

        return [
            {
                id: filters.sort,
                desc: filters.direction === 'desc',
            },
        ];
    }, [filters.sort, filters.direction]);

    const table = useReactTable({
        data: coincidencias.data,
        columns,
        state: {
            sorting,
            columnVisibility,
        },
        onColumnVisibilityChange: setColumnVisibility,
        onSortingChange: (updater) => {
            const nextSorting =
                typeof updater === 'function' ? updater(sorting) : updater;

            if (nextSorting.length > 0 && nextSorting[0]) {
                actualizarFiltros({
                    sort: nextSorting[0].id,
                    direction: nextSorting[0].desc ? 'desc' : 'asc',
                });
            } else {
                actualizarFiltros({
                    sort: undefined,
                    direction: undefined,
                });
            }
        },
        manualSorting: true,
        getCoreRowModel: getCoreRowModel(),
    });

    const isFiltered = Boolean(filters.search || filters.estado);

    return (
        <>
            <Head title="Seguimientos — Pipeline de Coincidencias" />

            <div className="space-y-6 p-4 md:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-xs">
                            <Route className="size-6" />
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                    Seguimientos
                                </h1>
                                <Badge
                                    variant="secondary"
                                    className="text-xs font-semibold"
                                >
                                    {coincidencias.total}
                                </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Avance de tus coincidencias cliente-propiedad
                                por etapa
                            </p>
                        </div>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-1 flex-wrap items-center gap-2.5">
                        {/* Search Input */}
                        <div className="relative w-full sm:w-64 md:w-72">
                            <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por cliente o propiedad..."
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                className="h-9 bg-card pl-9 text-xs shadow-2xs"
                            />
                            {searchValue && (
                                <button
                                    type="button"
                                    onClick={() => setSearchValue('')}
                                    className="absolute top-2.5 right-2.5 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="size-4" />
                                </button>
                            )}
                        </div>

                        {/* Estado Filter */}
                        <select
                            value={filters.estado ?? ''}
                            onChange={(event) =>
                                actualizarFiltros({
                                    estado: (event.target.value ||
                                        undefined) as
                                        EstadoCoincidencia | undefined,
                                })
                            }
                            className="h-9 rounded-md border border-input bg-card px-3 text-xs font-medium shadow-2xs focus:ring-2 focus:ring-ring/40 focus:outline-hidden"
                        >
                            <option value="">Todos los estados</option>
                            {estados.map((estado) => (
                                <option key={estado.value} value={estado.value}>
                                    {estado.label}
                                </option>
                            ))}
                        </select>

                        {/* Reset Filters */}
                        {isFiltered && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setSearchValue('');
                                    router.get(
                                        index().url,
                                        {},
                                        { replace: true },
                                    );
                                }}
                                className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground"
                            >
                                <X className="mr-1 size-3.5" />
                                Limpiar filtros
                            </Button>
                        )}
                    </div>

                    <DataTableViewOptions table={table} />
                </div>

                {/* Modern TanStack DataTable */}
                <DataTable
                    table={table}
                    emptyMessage="No se encontraron coincidencias en seguimiento."
                    emptyIcon={
                        <Route className="size-8 text-muted-foreground/60" />
                    }
                />

                {/* Pagination */}
                <DataTablePagination
                    links={coincidencias.links}
                    currentPage={coincidencias.current_page}
                    lastPage={coincidencias.last_page}
                    total={coincidencias.total}
                    from={coincidencias.from ?? undefined}
                    to={coincidencias.to ?? undefined}
                    onPageChange={(url) =>
                        router.get(url, {}, { preserveState: true })
                    }
                />
            </div>
        </>
    );
}

SeguimientosIndex.layout = {
    breadcrumbs: [{ title: 'Seguimientos', href: index() }],
};
