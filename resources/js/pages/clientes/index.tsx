import { Form, Head, Link, router } from '@inertiajs/react';
import {
    
    getCoreRowModel,
    useReactTable
    
} from '@tanstack/react-table';
import type {ColumnDef, VisibilityState} from '@tanstack/react-table';
import {
    ArrowUpRight,
    Calendar,
    MessageCircle,
    Phone,
    Plus,
    Search,
    Trash2,
    User,
    UserCheck,
    Users,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import ClienteController from '@/actions/App/Http/Controllers/Cliente/ClienteController';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { DataTablePagination } from '@/components/data-table/data-table-pagination';
import { DataTableViewOptions } from '@/components/data-table/data-table-view-options';
import Heading from '@/components/heading';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { index } from '@/routes/clientes';
import type {
    Cliente,
    ClientePaginado,
    EstadoCliente,
    EstadoOption,
} from '@/types/cliente';

type Props = {
    clientes: ClientePaginado;
    filters: {
        search?: string;
        estado?: EstadoCliente;
        sin_seguimiento?: string;
        sort?: string;
        direction?: string;
    };
    estados: EstadoOption[];
};

const ESTADO_CLIENTE_STYLES: Record<
    EstadoCliente,
    { bg: string; text: string; border: string }
> = {
    nuevo: {
        bg: 'bg-blue-500/10 dark:bg-blue-500/20',
        text: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-200 dark:border-blue-800/60',
    },
    contactado: {
        bg: 'bg-amber-500/10 dark:bg-amber-500/20',
        text: 'text-amber-700 dark:text-amber-300',
        border: 'border-amber-200 dark:border-amber-800/60',
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

function DeleteClienteDialog({ cliente }: { cliente: Cliente }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground opacity-60 hover:text-destructive hover:opacity-100"
                    title="Eliminar cliente"
                >
                    <Trash2 className="size-3.5" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>¿Eliminar cliente?</DialogTitle>
                    <DialogDescription>
                        Esta acción eliminará permanentemente al cliente "
                        {cliente.nombre}", incluyendo sus intereses, notas de
                        seguimiento y coincidencias asociadas.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 pt-2">
                    <DialogClose asChild>
                        <Button variant="secondary">Cancelar</Button>
                    </DialogClose>
                    <Form
                        {...ClienteController.destroy.form(cliente.id)}
                        onSuccess={() => setOpen(false)}
                    >
                        {({ processing }) => (
                            <Button
                                type="submit"
                                variant="destructive"
                                disabled={processing}
                            >
                                Eliminar cliente
                            </Button>
                        )}
                    </Form>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function ClientesIndex({ clientes, filters, estados }: Props) {
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

    const columns = useMemo<ColumnDef<Cliente>[]>(
        () => [
            {
                accessorKey: 'nombre',
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title="Cliente" />
                ),
                cell: ({ row }) => {
                    const cliente = row.original;

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
                                <p className="text-[11px] text-muted-foreground">
                                    Registrado el{' '}
                                    {new Date(
                                        cliente.created_at,
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'telefono',
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title="Teléfono" />
                ),
                cell: ({ row }) => {
                    const telefono = row.original.telefono;

                    if (!telefono) {
return <span className="text-muted-foreground">—</span>;
}

                    return (
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-medium text-foreground/90">
                                {telefono}
                            </span>
                            <div className="flex items-center gap-1">
                                <Button
                                    asChild
                                    variant="ghost"
                                    size="icon"
                                    className="size-6 text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
                                    title="WhatsApp"
                                >
                                    <a
                                        href={`https://wa.me/${cleanPhoneForWhatsApp(telefono)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <MessageCircle className="size-3.5" />
                                    </a>
                                </Button>
                                <Button
                                    asChild
                                    variant="ghost"
                                    size="icon"
                                    className="size-6 text-sky-600 hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-sky-950/40"
                                    title="Llamar"
                                >
                                    <a
                                        href={`tel:${cleanPhoneForTel(telefono)}`}
                                    >
                                        <Phone className="size-3.5" />
                                    </a>
                                </Button>
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
                    const estado = row.original.estado;
                    const style =
                        ESTADO_CLIENTE_STYLES[estado] ??
                        ESTADO_CLIENTE_STYLES['nuevo'];
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
                accessorKey: 'agenteRegistro',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title="Registrado por"
                    />
                ),
                cell: ({ row }) => {
                    const agente = row.original.agente_registro;

                    return (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <User className="size-3.5 text-muted-foreground/70" />
                            <span>{agente?.name ?? '—'}</span>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'notas_max_created_at',
                header: ({ column }) => (
                    <DataTableColumnHeader
                        column={column}
                        title="Último Seguimiento"
                    />
                ),
                cell: ({ row }) => {
                    const fecha = row.original.notas_max_created_at;

                    if (!fecha) {
                        return (
                            <span className="inline-flex items-center rounded-md bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:text-amber-400">
                                Sin seguimiento
                            </span>
                        );
                    }

                    return (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Calendar className="size-3.5 text-muted-foreground/70" />
                            <span>
                                {new Date(fecha).toLocaleDateString('es-ES', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                })}
                            </span>
                        </div>
                    );
                },
            },
            {
                id: 'actions',
                header: '',
                cell: ({ row }) => {
                    const cliente = row.original;

                    return (
                        <div className="flex items-center justify-end gap-1">
                            <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="h-8 gap-1 text-xs text-muted-foreground hover:text-foreground"
                            >
                                <Link href={ClienteController.show(cliente.id)}>
                                    <span>Ver perfil</span>
                                    <ArrowUpRight className="size-3.5" />
                                </Link>
                            </Button>

                            <DeleteClienteDialog cliente={cliente} />
                        </div>
                    );
                },
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
        data: clientes.data,
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
        filters.search || filters.estado || filters.sin_seguimiento,
    );

    return (
        <>
            <Head title="Clientes — Directorio del Equipo" />

            <div className="space-y-6 p-4 md:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-xs">
                            <Users className="size-6" />
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                    Clientes
                                </h1>
                                <Badge
                                    variant="secondary"
                                    className="text-xs font-semibold"
                                >
                                    {clientes.total}
                                </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Directorio y pipeline comercial del equipo
                            </p>
                        </div>
                    </div>

                    <Button asChild className="gap-1.5 shadow-2xs">
                        <Link href={ClienteController.create()}>
                            <Plus className="size-4" />
                            Nuevo cliente
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
                                placeholder="Buscar por nombre o teléfono..."
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
                                        undefined) as EstadoCliente | undefined,
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

                        {/* Sin seguimiento Toggle */}
                        <label className="flex cursor-pointer items-center gap-2 rounded-md border border-input bg-card px-3 py-1.5 text-xs font-medium shadow-2xs transition-colors select-none hover:bg-muted/40">
                            <Checkbox
                                checked={filters.sin_seguimiento === '1'}
                                onCheckedChange={(checked) =>
                                    actualizarFiltros({
                                        sin_seguimiento: checked
                                            ? '1'
                                            : undefined,
                                    })
                                }
                            />
                            <span className="text-muted-foreground">
                                Sin seguimiento reciente
                            </span>
                        </label>

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
                    emptyMessage="No se encontraron clientes que coincidan con la búsqueda."
                    emptyIcon={
                        <Users className="size-8 text-muted-foreground/60" />
                    }
                />

                {/* Pagination */}
                <DataTablePagination
                    links={clientes.links}
                    currentPage={clientes.current_page}
                    lastPage={clientes.last_page}
                    total={clientes.total}
                    from={clientes.from ?? undefined}
                    to={clientes.to ?? undefined}
                    onPageChange={(url) =>
                        router.get(url, {}, { preserveState: true })
                    }
                />
            </div>
        </>
    );
}

ClientesIndex.layout = {
    breadcrumbs: [{ title: 'Clientes', href: index() }],
};
