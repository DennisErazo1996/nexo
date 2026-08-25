import { Link } from '@inertiajs/react';
import { AlertCircle, Clock, ExternalLink, MessageCircle } from 'lucide-react';
import ClienteController from '@/actions/App/Http/Controllers/Cliente/ClienteController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { index as indexClientes } from '@/routes/clientes';
import type { Cliente } from '@/types/cliente';

type ClientesAtencionCardProps = {
    clientes: Cliente[];
    totalSinSeguimiento: number;
};

export function ClientesAtencionCard({
    clientes,
    totalSinSeguimiento,
}: ClientesAtencionCardProps) {
    const getWhatsAppUrl = (telefono: string) => {
        const digits = telefono.replace(/[^\d]/g, '');

        return `https://wa.me/${digits}`;
    };

    return (
        <Card className="flex flex-col justify-between py-5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <div className="flex items-center gap-2">
                        <Clock className="size-4 text-amber-500" />
                        <CardTitle className="text-base font-semibold">
                            Seguimiento Prioritario
                        </CardTitle>
                        {totalSinSeguimiento > 0 && (
                            <Badge
                                variant="secondary"
                                className="bg-amber-500/10 text-amber-700 dark:text-amber-400"
                            >
                                {totalSinSeguimiento} desatendidos
                            </Badge>
                        )}
                    </div>
                    <CardDescription className="text-xs">
                        Clientes activos con más de 14 días sin registro de
                        notas
                    </CardDescription>
                </div>

                <Link
                    href={`${indexClientes().url}?sin_seguimiento=1`}
                    className="text-xs font-medium text-primary hover:underline"
                >
                    Ver todos &rarr;
                </Link>
            </CardHeader>

            <CardContent className="space-y-3 pt-2">
                {clientes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-center">
                        <div className="flex size-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                            <AlertCircle className="size-5" />
                        </div>
                        <p className="mt-2 text-xs font-medium text-foreground">
                            ¡Excelente trabajo!
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                            Todos los clientes activos cuentan con seguimiento
                            reciente.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2.5">
                        {clientes.map((cliente) => (
                            <div
                                key={cliente.id}
                                className="flex flex-col justify-between gap-2.5 rounded-lg border bg-card/60 p-3 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center"
                            >
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={ClienteController.show(
                                                cliente.id,
                                            )}
                                            className="text-sm font-semibold hover:underline"
                                        >
                                            {cliente.nombre}
                                        </Link>
                                        <Badge
                                            variant="outline"
                                            className="text-[10px] capitalize"
                                        >
                                            {cliente.estado}
                                        </Badge>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                        <span>Tel: {cliente.telefono}</span>
                                        {cliente.agente_registro && (
                                            <>
                                                <span>•</span>
                                                <span>
                                                    Agente:{' '}
                                                    {
                                                        cliente.agente_registro
                                                            .name
                                                    }
                                                </span>
                                            </>
                                        )}
                                        <span>•</span>
                                        <span className="text-amber-600 dark:text-amber-400">
                                            {cliente.notas_max_created_at
                                                ? `Última nota: ${new Date(
                                                      cliente.notas_max_created_at,
                                                  ).toLocaleDateString(
                                                      'es-HN',
                                                      {
                                                          day: 'numeric',
                                                          month: 'short',
                                                      },
                                                  )}`
                                                : 'Sin notas registradas'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 self-end sm:self-center">
                                    {cliente.telefono && (
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="sm"
                                            className="h-8 gap-1 px-2.5 text-xs text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                                        >
                                            <a
                                                href={getWhatsAppUrl(
                                                    cliente.telefono,
                                                )}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <MessageCircle className="size-3.5" />
                                                WhatsApp
                                            </a>
                                        </Button>
                                    )}

                                    <Button
                                        asChild
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 gap-1 px-2 text-xs"
                                    >
                                        <Link
                                            href={ClienteController.show(
                                                cliente.id,
                                            )}
                                        >
                                            Detalle
                                            <ExternalLink className="size-3" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
