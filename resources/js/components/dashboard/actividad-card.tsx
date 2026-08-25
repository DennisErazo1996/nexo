import { Link } from '@inertiajs/react';
import { Activity, MessageSquare } from 'lucide-react';
import ClienteController from '@/actions/App/Http/Controllers/Cliente/ClienteController';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import type { ActividadItem } from '@/types/dashboard';

type ActividadCardProps = {
    actividades: ActividadItem[];
};

export function ActividadCard({ actividades }: ActividadCardProps) {
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <Card className="flex flex-col justify-between py-5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <div className="flex items-center gap-2">
                        <Activity className="size-4 text-primary" />
                        <CardTitle className="text-base font-semibold">
                            Actividad Reciente
                        </CardTitle>
                    </div>
                    <CardDescription className="text-xs">
                        Últimas notas y seguimientos de clientes
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent className="space-y-3 pt-2">
                {actividades.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-center">
                        <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                            <MessageSquare className="size-5 text-muted-foreground" />
                        </div>
                        <p className="mt-2 text-xs font-medium text-foreground">
                            Sin actividad registrada
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                            Las notas de seguimiento del equipo aparecerán aquí.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {actividades.map((actividad) => (
                            <div
                                key={actividad.id}
                                className="flex items-start gap-3 rounded-lg border bg-card/60 p-2.5 transition-colors hover:bg-muted/40"
                            >
                                <Avatar className="size-8 text-xs font-semibold">
                                    <AvatarFallback className="bg-primary/10 text-primary">
                                        {actividad.agente?.name
                                            ? getInitials(actividad.agente.name)
                                            : 'AG'}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="truncate text-xs font-semibold text-foreground">
                                            {actividad.agente?.name ?? 'Agente'}{' '}
                                            <span className="font-normal text-muted-foreground">
                                                sobre
                                            </span>{' '}
                                            {actividad.cliente ? (
                                                <Link
                                                    href={ClienteController.show(
                                                        actividad.cliente.id,
                                                    )}
                                                    className="font-medium text-primary hover:underline"
                                                >
                                                    {actividad.cliente.nombre}
                                                </Link>
                                            ) : (
                                                'Cliente'
                                            )}
                                        </p>
                                        <span className="shrink-0 text-[11px] text-muted-foreground">
                                            {new Date(
                                                actividad.created_at,
                                            ).toLocaleDateString('es-HN', {
                                                day: 'numeric',
                                                month: 'short',
                                            })}
                                        </span>
                                    </div>
                                    <p className="mt-1 line-clamp-2 rounded bg-muted/40 p-1.5 text-xs text-muted-foreground">
                                        "{actividad.texto}"
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
