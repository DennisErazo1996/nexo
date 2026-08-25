import { Link } from '@inertiajs/react';
import { Building2, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { index as indexPropiedades } from '@/routes/propiedades';
import type { DashboardStats, PropiedadPorTipo } from '@/types/dashboard';

type PortfolioCardProps = {
    stats: DashboardStats['propiedades'];
    valorCartera: DashboardStats['valor_cartera'];
    propiedadesPorTipo: PropiedadPorTipo[];
};

export function PortfolioCard({
    stats,
    valorCartera,
    propiedadesPorTipo,
}: PortfolioCardProps) {
    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat('es-HN', {
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <Card className="flex flex-col justify-between py-5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <div className="flex items-center gap-2">
                        <Building2 className="size-4 text-primary" />
                        <CardTitle className="text-base font-semibold">
                            Portafolio Inmobiliario
                        </CardTitle>
                    </div>
                    <CardDescription className="text-xs">
                        {stats.disponibles} disponibles de {stats.totales}{' '}
                        registradas
                    </CardDescription>
                </div>

                <Link
                    href={indexPropiedades().url}
                    className="text-xs font-medium text-primary hover:underline"
                >
                    Ver todas &rarr;
                </Link>
            </CardHeader>

            <CardContent className="space-y-4 pt-2">
                {/* Status Badges Row */}
                <div className="flex flex-wrap gap-2">
                    <Link href={`${indexPropiedades().url}?estado=disponible`}>
                        <Badge
                            variant="secondary"
                            className="bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-400"
                        >
                            <span className="mr-1 size-1.5 rounded-full bg-emerald-500" />
                            {stats.disponibles} Disponibles
                        </Badge>
                    </Link>
                    <Link href={`${indexPropiedades().url}?estado=reservada`}>
                        <Badge
                            variant="secondary"
                            className="bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 dark:text-amber-400"
                        >
                            <span className="mr-1 size-1.5 rounded-full bg-amber-500" />
                            {stats.reservadas} Reservadas
                        </Badge>
                    </Link>
                    <Link href={`${indexPropiedades().url}?estado=vendida`}>
                        <Badge
                            variant="secondary"
                            className="bg-blue-500/10 text-blue-700 hover:bg-blue-500/20 dark:text-blue-400"
                        >
                            <span className="mr-1 size-1.5 rounded-full bg-blue-500" />
                            {stats.vendidas} Vendidas
                        </Badge>
                    </Link>
                    {stats.retiradas > 0 && (
                        <Link
                            href={`${indexPropiedades().url}?estado=retirada`}
                        >
                            <Badge
                                variant="secondary"
                                className="bg-muted text-muted-foreground hover:bg-muted/80"
                            >
                                <span className="mr-1 size-1.5 rounded-full bg-muted-foreground" />
                                {stats.retiradas} Retiradas
                            </Badge>
                        </Link>
                    )}
                </div>

                {/* Portfolio Value Highlight Cardlet */}
                <div className="rounded-lg border bg-muted/30 p-3">
                    <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 font-medium">
                            <DollarSign className="size-3.5 text-emerald-500" />
                            Valor en Cartera Disponible
                        </span>
                        <span className="text-[11px]">
                            {stats.disponibles} propiedades
                        </span>
                    </div>
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                        <div>
                            <span className="text-xs font-semibold text-muted-foreground">
                                HNL{' '}
                            </span>
                            <span className="text-lg font-bold text-foreground">
                                L {formatMoney(valorCartera.HNL)}
                            </span>
                        </div>
                        {valorCartera.USD > 0 && (
                            <div>
                                <span className="text-xs font-semibold text-muted-foreground">
                                    USD{' '}
                                </span>
                                <span className="text-lg font-bold text-foreground">
                                    ${formatMoney(valorCartera.USD)}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Distribution by Property Type */}
                <div className="space-y-2">
                    <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        Por Tipo de Inmueble
                    </span>
                    {propiedadesPorTipo.length === 0 ? (
                        <p className="text-xs text-muted-foreground">
                            No hay propiedades registradas.
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {propiedadesPorTipo.map((item) => (
                                <Link
                                    key={item.tipo}
                                    href={`${indexPropiedades().url}?tipo=${item.tipo}`}
                                    className="group block"
                                >
                                    <div className="mb-1 flex items-center justify-between text-xs">
                                        <span className="font-medium group-hover:text-primary">
                                            {item.label}
                                        </span>
                                        <span className="text-muted-foreground">
                                            {item.count}{' '}
                                            <span className="text-[11px]">
                                                ({item.porcentaje}%)
                                            </span>
                                        </span>
                                    </div>
                                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                                        <div
                                            style={{
                                                width: `${item.porcentaje}%`,
                                            }}
                                            className="h-full rounded-full bg-primary/80 transition-all duration-300 group-hover:bg-primary"
                                        />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
