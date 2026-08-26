import { Form, Head, Link, router } from '@inertiajs/react';
import {
    
    getCoreRowModel,
    useReactTable
    
} from '@tanstack/react-table';
import type {ColumnDef, VisibilityState} from '@tanstack/react-table';
import {
    ArrowUpRight,
    Building2,
    ImageIcon,
    MapPin,
    Maximize2,
    Plus,
    Search,
    Trash2,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import PropiedadController from '@/actions/App/Http/Controllers/Propiedad/PropiedadController';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { DataTablePagination } from '@/components/data-table/data-table-pagination';
import { DataTableViewOptions } from '@/components/data-table/data-table-view-options';
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
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';
import { index } from '@/routes/propiedades';
import type {
    EnumOption,
    Propiedad,
    PropiedadPaginado,
} from '@/types/propiedad';

type Props = {
    propiedades: PropiedadPaginado;
    filters: {
        search?: string;
        estado?: string;
        tipo?: string;
        sort?: string;
        direction?: string;
    };
    estados: EnumOption[];
    tipos: EnumOption[];
};

const ESTADO_PROPIEDAD_STYLES: Record<
    string,
    { bg: string; text: string; border: string }
> = {
    disponible: {
        bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
        text: 'text-emerald-700 dark:text-emerald-300',
        border: 'border-emerald-200 dark:border-emerald-800/60',
    },
    reservada: {
        bg: 'bg-amber-500/10 dark:bg-amber-500/20',
        text: 'text-amber-700 dark:text-amber-300',
        border: 'border-amber-200 dark:border-amber-800/60',
    },
    vendida: {
        bg: 'bg-blue-500/10 dark:bg-blue-500/20',
        text: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-200 dark:border-blue-800/60',
    },
    retirada: {
        bg: 'bg-zinc-500/10 dark:bg-zinc-500/20',
        text: 'text-zinc-700 dark:text-zinc-300',
        border: 'border-zinc-200 dark:border-zinc-800/60',
    },
};

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

export default function PropiedadesIndex({
    propiedades,
    filters,
    estados,
    tipos,
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

    const columns = useMemo<ColumnDef<Propiedad>[]>(
        () => [
            {
                accessorKey: 'foto',
                header: '',
                cell: ({ row }) => {
                    const propiedad = row.original;
                    const foto = propiedad.fotos?.[0];

                    return (
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-border/70 bg-muted/40">
                            {foto ? (
                                <img
                                    src={foto.url_con_marca_agua}
                                    alt=""
                                    className="size-full object-cover"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="flex size-full items-center justify-center text-muted-foreground/60">
                                    <ImageIcon className="size-5" />
                                </div>
                            )}
                        </div>
                    );
                },
            },
            {
                accessorKey: 'tipo',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title="Propiedad & Tipo"
                    />
                ),
                cell: ({ row }) => {
                    const propiedad = row.original;
                    const tipoLabel =
                        tipos.find((t) => t.value === propiedad.tipo)?.label ??
                        propiedad.tipo;

                    return (
                        <div>
                            <Link
                                href={PropiedadController.show(propiedad.id)}
                                className="group inline-flex items-center gap-1 font-semibold text-foreground transition-colors hover:text-primary"
                            >
                                <span>
                                    {tipoLabel} en {propiedad.zona}
                                </span>
                                <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                            </Link>
                            <p className="text-[11px] text-muted-foreground">
                                Publicada el{' '}
                                {new Date(
                                    propiedad.created_at,
                                ).toLocaleDateString()}
                            </p>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'zona',
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title="Ubicación" />
                ),
                cell: ({ row }) => {
                    return (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                            <MapPin className="size-3.5 text-muted-foreground/70" />
                            <span className="max-w-[180px] truncate">
                                {row.original.zona}
                            </span>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'precio',
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title="Precio" />
                ),
                cell: ({ row }) => {
                    const propiedad = row.original;

                    return (
                        <div className="text-xs font-semibold text-foreground">
                            {propiedad.moneda}{' '}
                            {formatCurrency(propiedad.precio)}
                        </div>
                    );
                },
            },
            {
                accessorKey: 'tamano',
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title="Dimensión" />
                ),
                cell: ({ row }) => {
                    const propiedad = row.original;

                    return (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Maximize2 className="size-3 text-muted-foreground/70" />
                            <span>
                                {propiedad.tamano} {propiedad.unidad_medida}
                            </span>
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
                    const estado = row.original.estado;
                    const style =
                        ESTADO_PROPIEDAD_STYLES[estado] ??
                        ESTADO_PROPIEDAD_STYLES['disponible'];
                    const label =
                        estados.find((e) => e.value === estado)?.label ??
                        estado;

                    return (
                        <Badge
                            variant="outline"
                            className={cn(
                                'text-[11px] font-semibold tracking-wider uppercase',
                                style.bg,
                                style.text,
                                style.border,
                            )}
                        >
                            {label}
                        </Badge>
                    );
                },
            },
            {
                id: 'actions',
                header: '',
                cell: ({ row }) => {
                    const propiedad = row.original;

                    return (
                        <div className="flex items-center justify-end gap-1">
                            <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="h-8 gap-1 text-xs text-muted-foreground hover:text-foreground"
                            >
                                <Link
                                    href={PropiedadController.show(
                                        propiedad.id,
                                    )}
                                >
                                    <span>Ver ficha</span>
                                    <ArrowUpRight className="size-3.5" />
                                </Link>
                            </Button>

                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-8 text-muted-foreground opacity-60 hover:text-destructive hover:opacity-100"
                                        title="Eliminar propiedad"
                                    >
                                        <Trash2 className="size-3.5" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            ¿Eliminar propiedad?
                                        </DialogTitle>
                                        <DialogDescription>
                                            Esta acción eliminará
                                            permanentemente la propiedad "
                                            {propiedad.tipo} en {propiedad.zona}
                                            ", todas sus fotos y coincidencias
                                            asociadas.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter className="gap-2 pt-2">
                                        <DialogClose asChild>
                                            <Button variant="secondary">
                                                Cancelar
                                            </Button>
                                        </DialogClose>
                                        <Form
                                            {...PropiedadController.destroy.form(
                                                propiedad.id,
                                            )}
                                        >
                                            {({ processing }) => (
                                                <Button
                                                    type="submit"
                                                    variant="destructive"
                                                    disabled={processing}
                                                >
                                                    Eliminar propiedad
                                                </Button>
                                            )}
                                        </Form>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    );
                },
            },
        ],
        [estados, tipos],
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
        data: propiedades.data,
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

    const isFiltered = Boolean(
        filters.search || filters.estado || filters.tipo,
    );

    return (
        <>
            <Head title="Propiedades — Catálogo Inmobiliario" />

            <div className="space-y-6 p-4 md:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-xs">
                            <Building2 className="size-6" />
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                    Propiedades
                                </h1>
                                <Badge
                                    variant="secondary"
                                    className="text-xs font-semibold"
                                >
                                    {propiedades.total}
                                </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Inventario y catálogo de propiedades del equipo
                            </p>
                        </div>
                    </div>

                    <Button asChild className="gap-1.5 shadow-2xs">
                        <Link href={PropiedadController.create()}>
                            <Plus className="size-4" />
                            Nueva propiedad
                        </Link>
                    </Button>
                </div>

                {/* Toolbar Filters */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-1 flex-wrap items-center gap-2.5">
                        {/* Search Input */}
                        <div className="relative w-full sm:w-64 md:w-72">
                            <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por zona, tipo o detalle..."
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
                                    estado: event.target.value || undefined,
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

                        {/* Tipo Filter */}
                        <select
                            value={filters.tipo ?? ''}
                            onChange={(event) =>
                                actualizarFiltros({
                                    tipo: event.target.value || undefined,
                                })
                            }
                            className="h-9 rounded-md border border-input bg-card px-3 text-xs font-medium shadow-2xs focus:ring-2 focus:ring-ring/40 focus:outline-hidden"
                        >
                            <option value="">Todos los tipos</option>
                            {tipos.map((tipo) => (
                                <option key={tipo.value} value={tipo.value}>
                                    {tipo.label}
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
                    emptyMessage="No se encontraron propiedades que coincidan con los filtros."
                    emptyIcon={
                        <Building2 className="size-8 text-muted-foreground/60" />
                    }
                />

                {/* Pagination */}
                <DataTablePagination
                    links={propiedades.links}
                    currentPage={propiedades.current_page}
                    lastPage={propiedades.last_page}
                    total={propiedades.total}
                    from={propiedades.from ?? undefined}
                    to={propiedades.to ?? undefined}
                    onPageChange={(url) =>
                        router.get(url, {}, { preserveState: true })
                    }
                />
            </div>
        </>
    );
}

PropiedadesIndex.layout = {
    breadcrumbs: [{ title: 'Propiedades', href: index() }],
};
