import { Link } from '@inertiajs/react';
import { Building2, Plus } from 'lucide-react';
import PropiedadController from '@/actions/App/Http/Controllers/Propiedad/PropiedadController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { index as indexPropiedades } from '@/routes/propiedades';
import type { Propiedad } from '@/types/propiedad';

type PropiedadesRecientesCardProps = {
    propiedades: Propiedad[];
};

export function PropiedadesRecientesCard({
    propiedades,
}: PropiedadesRecientesCardProps) {
    const formatMoney = (amount: string | number) => {
        return new Intl.NumberFormat('es-HN', {
            maximumFractionDigits: 0,
        }).format(Number(amount));
    };

    return (
        <Card className="flex flex-col justify-between py-5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <div className="flex items-center gap-2">
                        <Building2 className="size-4 text-primary" />
                        <CardTitle className="text-base font-semibold">
                            Propiedades Recientes
                        </CardTitle>
                    </div>
                    <CardDescription className="text-xs">
                        Últimos inmuebles ingresados al portafolio
                    </CardDescription>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                    >
                        <Link href={PropiedadController.create()}>
                            <Plus className="mr-1 size-3" />
                            Nueva
                        </Link>
                    </Button>
                    <Link
                        href={indexPropiedades().url}
                        className="text-xs font-medium text-primary hover:underline"
                    >
                        Ver todas &rarr;
                    </Link>
                </div>
            </CardHeader>

            <CardContent className="space-y-3 pt-2">
                {propiedades.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-center">
                        <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                            <Building2 className="size-5 text-muted-foreground" />
                        </div>
                        <p className="mt-2 text-xs font-medium text-foreground">
                            Sin propiedades registradas
                        </p>
                        <Button asChild size="sm" className="mt-3 text-xs">
                            <Link href={PropiedadController.create()}>
                                Registrar primera propiedad
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-2.5">
                        {propiedades.map((propiedad) => {
                            const foto = propiedad.fotos?.[0];
                            const statusColor =
                                propiedad.estado === 'disponible'
                                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                    : propiedad.estado === 'reservada'
                                      ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                                      : propiedad.estado === 'vendida'
                                        ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
                                        : 'bg-muted text-muted-foreground';

                            return (
                                <Link
                                    key={propiedad.id}
                                    href={PropiedadController.show(
                                        propiedad.id,
                                    )}
                                    className="group flex items-center justify-between gap-3 rounded-lg border bg-card/60 p-2.5 transition-colors hover:bg-muted/40"
                                >
                                    <div className="flex items-center gap-3">
                                        {foto ? (
                                            <img
                                                src={
                                                    foto.url_con_marca_agua ||
                                                    foto.url
                                                }
                                                alt=""
                                                className="size-11 rounded-md object-cover"
                                            />
                                        ) : (
                                            <div className="flex size-11 items-center justify-center rounded-md bg-muted text-muted-foreground">
                                                <Building2 className="size-5" />
                                            </div>
                                        )}

                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-semibold capitalize group-hover:text-primary group-hover:underline">
                                                    {propiedad.tipo}
                                                </span>
                                                <Badge
                                                    variant="secondary"
                                                    className={`text-[10px] capitalize ${statusColor}`}
                                                >
                                                    {propiedad.estado}
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {propiedad.zona} •{' '}
                                                {propiedad.tamano}{' '}
                                                {propiedad.unidad_medida}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-sm font-bold text-foreground">
                                            {propiedad.moneda}{' '}
                                            {formatMoney(propiedad.precio)}
                                        </p>
                                        <p className="text-[11px] text-muted-foreground">
                                            {new Date(
                                                propiedad.created_at,
                                            ).toLocaleDateString('es-HN', {
                                                day: 'numeric',
                                                month: 'short',
                                            })}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
