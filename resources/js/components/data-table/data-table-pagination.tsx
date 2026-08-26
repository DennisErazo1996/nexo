import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type PaginationProps = {
    links?: { url: string | null; label: string; active: boolean }[];
    currentPage: number;
    lastPage: number;
    total: number;
    from?: number;
    to?: number;
    onPageChange: (url: string) => void;
};

export function DataTablePagination({
    links = [],
    currentPage,
    lastPage,
    total,
    from,
    to,
    onPageChange,
}: PaginationProps) {
    const firstLink = links[1]?.url ?? null;
    const prevLink = links[0]?.url ?? null;
    const nextLink = links[links.length - 1]?.url ?? null;
    const lastPageLink = links[links.length - 2]?.url ?? null;

    return (
        <div className="flex flex-col gap-4 px-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-muted-foreground">
                {total > 0 ? (
                    <span>
                        Mostrando{' '}
                        <strong className="font-semibold text-foreground">
                            {from ?? (currentPage - 1) * 20 + 1}
                        </strong>{' '}
                        a{' '}
                        <strong className="font-semibold text-foreground">
                            {to ?? Math.min(currentPage * 20, total)}
                        </strong>{' '}
                        de{' '}
                        <strong className="font-semibold text-foreground">
                            {total}
                        </strong>{' '}
                        resultados
                    </span>
                ) : (
                    <span>Sin resultados</span>
                )}
            </div>

            {lastPage > 1 && (
                <div className="flex items-center gap-2">
                    <div className="flex items-center space-x-1">
                        {/* Page Numbers */}
                        {links
                            .filter(
                                (link, idx) =>
                                    idx > 0 && idx < links.length - 1,
                            )
                            .map((link, index) => {
                                const isNumber = !isNaN(Number(link.label));

                                if (!isNumber && link.label !== '...') {
return null;
}

                                return (
                                    <Button
                                        key={index}
                                        variant={
                                            link.active ? 'default' : 'outline'
                                        }
                                        size="sm"
                                        disabled={!link.url || link.active}
                                        onClick={() =>
                                            link.url && onPageChange(link.url)
                                        }
                                        className="size-8 p-0 text-xs font-medium"
                                    >
                                        {link.label}
                                    </Button>
                                );
                            })}
                    </div>

                    <div className="flex items-center space-x-1">
                        <Button
                            variant="outline"
                            size="icon"
                            className="size-8"
                            onClick={() => prevLink && onPageChange(prevLink)}
                            disabled={!prevLink || currentPage <= 1}
                            title="Página anterior"
                        >
                            <ChevronLeft className="size-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="size-8"
                            onClick={() => nextLink && onPageChange(nextLink)}
                            disabled={!nextLink || currentPage >= lastPage}
                            title="Página siguiente"
                        >
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
