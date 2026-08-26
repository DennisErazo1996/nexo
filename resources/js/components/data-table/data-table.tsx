import { flexRender  } from '@tanstack/react-table';
import type {Table as TableType} from '@tanstack/react-table';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface DataTableProps<TData> {
    table: TableType<TData>;
    emptyMessage?: string;
    emptyIcon?: React.ReactNode;
    className?: string;
}

export function DataTable<TData>({
    table,
    emptyMessage = 'No se encontraron resultados.',
    emptyIcon,
    className,
}: DataTableProps<TData>) {
    return (
        <div
            className={cn(
                'overflow-hidden rounded-xl border border-border/70 bg-card shadow-2xs',
                className,
            )}
        >
            <Table>
                <TableHeader className="bg-muted/40">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow
                            key={headerGroup.id}
                            className="hover:bg-transparent"
                        >
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead
                                        key={header.id}
                                        className="h-10 text-xs font-semibold tracking-wider text-muted-foreground uppercase"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext(),
                                              )}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && 'selected'}
                                className="transition-colors hover:bg-muted/30"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell
                                        key={cell.id}
                                        className="py-3 text-sm"
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={table.getAllColumns().length}
                                className="h-40 text-center"
                            >
                                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                    {emptyIcon}
                                    <p className="text-sm font-medium">
                                        {emptyMessage}
                                    </p>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
