import { Form, Link } from '@inertiajs/react';
import { Check, Eye, Sparkles, X } from 'lucide-react';
import ClienteController from '@/actions/App/Http/Controllers/Cliente/ClienteController';
import CoincidenciaController from '@/actions/App/Http/Controllers/Coincidencia/CoincidenciaController';
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
import { index as indexCoincidencias } from '@/routes/coincidencias';
import type { Coincidencia } from '@/types/coincidencia';

type CoincidenciasCardProps = {
    coincidencias: Coincidencia[];
    pendientesCount: number;
};

export function CoincidenciasCard({
    coincidencias,
    pendientesCount,
}: CoincidenciasCardProps) {
    return (
        <Card className="flex flex-col justify-between py-5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <div className="flex items-center gap-2">
                        <Sparkles className="size-4 text-amber-500" />
                        <CardTitle className="text-base font-semibold">
                            Coincidencias Pendientes
                        </CardTitle>
                        {pendientesCount > 0 && (
                            <Badge
                                variant="secondary"
                                className="bg-amber-500/10 text-amber-700 dark:text-amber-400"
                            >
                                {pendientesCount} nuevas
                            </Badge>
                        )}
                    </div>
                    <CardDescription className="text-xs">
                        Compradores potenciales para propiedades activas
                    </CardDescription>
                </div>

                <Link
                    href={indexCoincidencias().url}
                    className="text-xs font-medium text-primary hover:underline"
                >
                    Ver todas &rarr;
                </Link>
            </CardHeader>

            <CardContent className="space-y-3 pt-2">
                {coincidencias.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-center">
                        <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                            <Sparkles className="size-5 text-muted-foreground" />
                        </div>
                        <p className="mt-2 text-xs font-medium text-foreground">
                            Sin coincidencias pendientes
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                            El sistema sugerirá compradores cuando coincidan con
                            los inmuebles.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2.5">
                        {coincidencias.map((item) => (
                            <div
                                key={item.id}
                                className="flex flex-col justify-between gap-3 rounded-lg border bg-card/60 p-3 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center"
                            >
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        {item.cliente ? (
                                            <Link
                                                href={ClienteController.show(
                                                    item.cliente.id,
                                                )}
                                                className="text-sm font-semibold hover:underline"
                                            >
                                                {item.cliente.nombre}
                                            </Link>
                                        ) : (
                                            <span className="text-sm font-semibold">
                                                Cliente
                                            </span>
                                        )}
                                        {item.cliente?.telefono && (
                                            <span className="text-xs text-muted-foreground">
                                                ({item.cliente.telefono})
                                            </span>
                                        )}
                                    </div>

                                    {item.propiedad && (
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Link
                                                href={PropiedadController.show(
                                                    item.propiedad.id,
                                                )}
                                                className="flex items-center gap-1 font-medium text-foreground hover:text-primary hover:underline"
                                            >
                                                <Eye className="size-3" />
                                                <span className="capitalize">
                                                    {item.propiedad.tipo}
                                                </span>{' '}
                                                en {item.propiedad.zona}
                                            </Link>
                                            <span>•</span>
                                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                                {item.propiedad.moneda}{' '}
                                                {item.propiedad.precio}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-1.5 self-end sm:self-center">
                                    <Form
                                        {...CoincidenciaController.updateEstado.form(
                                            item.id,
                                        )}
                                        options={{ preserveScroll: true }}
                                    >
                                        {({ processing }) => (
                                            <>
                                                <input
                                                    type="hidden"
                                                    name="estado"
                                                    value="notificado"
                                                />
                                                <Button
                                                    type="submit"
                                                    size="sm"
                                                    variant="default"
                                                    className="h-8 gap-1 px-2.5 text-xs"
                                                    disabled={processing}
                                                >
                                                    <Check className="size-3.5" />
                                                    Notificado
                                                </Button>
                                            </>
                                        )}
                                    </Form>

                                    <Form
                                        {...CoincidenciaController.updateEstado.form(
                                            item.id,
                                        )}
                                        options={{ preserveScroll: true }}
                                    >
                                        {({ processing }) => (
                                            <>
                                                <input
                                                    type="hidden"
                                                    name="estado"
                                                    value="descartado"
                                                />
                                                <Button
                                                    type="submit"
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 gap-1 px-2 text-xs text-muted-foreground hover:text-destructive"
                                                    disabled={processing}
                                                    title="Descartar coincidencia"
                                                >
                                                    <X className="size-3.5" />
                                                </Button>
                                            </>
                                        )}
                                    </Form>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
