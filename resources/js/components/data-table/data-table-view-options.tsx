import type { Table } from '@tanstack/react-table';
import { RotateCcw, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const COLUMN_LABELS: Record<string, string> = {
    foto: 'Foto',
    tipo: 'Tipo / Inmueble',
    zona: 'Ubicación',
    precio: 'Precio',
    area_terreno: 'Dimensión / Área',
    tamano: 'Dimensión',
    estado: 'Estado',
    nombre: 'Nombre de Cliente',
    telefono: 'Teléfono',
    agente_registro: 'Agente Asignado',
    agente: 'Agente',
    ultimo_seguimiento: 'Último Seguimiento',
    cliente: 'Cliente',
    propiedad: 'Propiedad',
    created_at: 'Fecha',
};

interface DataTableViewOptionsProps<TData> {
    table: Table<TData>;
}

export function DataTableViewOptions<TData>({
    table,
}: DataTableViewOptionsProps<TData>) {
    const hideableColumns = table
        .getAllColumns()
        .filter(
            (column) =>
                typeof column.accessorFn !== 'undefined' && column.getCanHide(),
        );

    const hasHiddenColumns = hideableColumns.some((col) => !col.getIsVisible());

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto flex h-9 gap-1.5 text-xs shadow-2xs"
                >
                    <SlidersHorizontal className="size-3.5" />
                    Columnas
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
                <DropdownMenuLabel className="text-xs">
                    Alternar columnas
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {hideableColumns.map((column) => {
                    const label =
                        COLUMN_LABELS[column.id] ??
                        column.id.replace(/_/g, ' ');

                    return (
                        <DropdownMenuCheckboxItem
                            key={column.id}
                            className="cursor-pointer text-xs capitalize"
                            checked={column.getIsVisible()}
                            onCheckedChange={(value) =>
                                column.toggleVisibility(!!value)
                            }
                        >
                            {label}
                        </DropdownMenuCheckboxItem>
                    );
                })}
                {hasHiddenColumns && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="cursor-pointer justify-center gap-1.5 text-xs font-medium text-primary"
                            onClick={() => table.toggleAllColumnsVisible(true)}
                        >
                            <RotateCcw className="size-3" />
                            Mostrar todas
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
