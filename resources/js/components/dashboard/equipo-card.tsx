import { Link } from '@inertiajs/react';
import { Settings, Shield, User as UserIcon, Users } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { edit as editEquipo } from '@/routes/equipo';
import type { AgenteEquipo } from '@/types/dashboard';

type EquipoCardProps = {
    agentes: AgenteEquipo[];
    isAdmin: boolean;
};

export function EquipoCard({ agentes, isAdmin }: EquipoCardProps) {
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
                        <Users className="size-4 text-primary" />
                        <CardTitle className="text-base font-semibold">
                            Equipo Comercial
                        </CardTitle>
                    </div>
                    <CardDescription className="text-xs">
                        {agentes.length} miembro
                        {agentes.length === 1 ? '' : 's'} en el equipo
                    </CardDescription>
                </div>

                {isAdmin && (
                    <Link
                        href={editEquipo().url}
                        className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    >
                        <Settings className="size-3" />
                        Gestionar &rarr;
                    </Link>
                )}
            </CardHeader>

            <CardContent className="space-y-3 pt-2">
                <div className="space-y-2.5">
                    {agentes.map((agente) => (
                        <div
                            key={agente.id}
                            className="flex items-center justify-between gap-3 rounded-lg border bg-card/60 p-2.5 transition-colors hover:bg-muted/40"
                        >
                            <div className="flex items-center gap-3">
                                <Avatar className="size-8 text-xs font-semibold">
                                    <AvatarFallback className="bg-primary/10 text-primary">
                                        {getInitials(agente.name)}
                                    </AvatarFallback>
                                </Avatar>

                                <div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-xs font-semibold text-foreground">
                                            {agente.name}
                                        </span>
                                        {agente.rol === 'admin' ? (
                                            <Badge
                                                variant="secondary"
                                                className="gap-0.5 bg-primary/10 px-1.5 py-0 text-[10px] text-primary"
                                            >
                                                <Shield className="size-2.5" />
                                                Admin
                                            </Badge>
                                        ) : (
                                            <Badge
                                                variant="outline"
                                                className="px-1.5 py-0 text-[10px] text-muted-foreground"
                                            >
                                                <UserIcon className="size-2.5" />
                                                Agente
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-[11px] text-muted-foreground">
                                        {agente.email}
                                        {agente.telefono &&
                                            ` • ${agente.telefono}`}
                                    </p>
                                </div>
                            </div>

                            <div className="text-right text-[11px] text-muted-foreground">
                                <span className="font-semibold text-foreground">
                                    {agente.clientes_registrados_count ?? 0}
                                </span>{' '}
                                clientes
                                <br />
                                <span className="font-semibold text-foreground">
                                    {agente.propiedad_agentes_count ?? 0}
                                </span>{' '}
                                propiedades
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
