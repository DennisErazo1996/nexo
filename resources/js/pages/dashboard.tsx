import { Head, Link, usePage } from '@inertiajs/react';
import {
    Building2,
    Calendar,
    Clock,
    DollarSign,
    Plus,
    Sparkles,
    Users,
} from 'lucide-react';
import ClienteController from '@/actions/App/Http/Controllers/Cliente/ClienteController';
import CoincidenciaController from '@/actions/App/Http/Controllers/Coincidencia/CoincidenciaController';
import PropiedadController from '@/actions/App/Http/Controllers/Propiedad/PropiedadController';
import { ActividadCard } from '@/components/dashboard/actividad-card';
import { ClientesAtencionCard } from '@/components/dashboard/clientes-atencion-card';
import { CoincidenciasCard } from '@/components/dashboard/coincidencias-card';
import { EquipoCard } from '@/components/dashboard/equipo-card';
import { PipelineCard } from '@/components/dashboard/pipeline-card';
import { PortfolioCard } from '@/components/dashboard/portfolio-card';
import { PropiedadesRecientesCard } from '@/components/dashboard/propiedades-recientes-card';
import { StatCard } from '@/components/dashboard/stat-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import { index as indexClientes } from '@/routes/clientes';
import { index as indexCoincidencias } from '@/routes/coincidencias';
import { index as indexPropiedades } from '@/routes/propiedades';
import type { Auth } from '@/types';
import type { DashboardProps } from '@/types/dashboard';

type PageProps = {
    auth: Auth;
};

export default function Dashboard({
    stats,
    pipeline_clientes,
    propiedades_por_tipo,
    coincidencias_recientes,
    clientes_atencion,
    propiedades_recientes,
    actividad_reciente,
    agentes_equipo,
}: DashboardProps) {
    const { auth } = usePage<PageProps>().props;

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat('es-HN', {
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const fechaHoy = new Date().toLocaleDateString('es-HN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <>
            <Head title="Panel de Control" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header Welcome & Quick Actions Banner */}
                <div className="flex flex-col justify-between gap-4 rounded-xl border bg-gradient-to-r from-card via-card to-muted/30 p-5 shadow-sm sm:flex-row sm:items-center">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold tracking-tight md:text-2xl">
                                Hola,{' '}
                                {auth?.user?.name?.split(' ')[0] ?? 'Agente'} 👋
                            </h1>
                            {auth?.equipo?.nombre && (
                                <Badge
                                    variant="outline"
                                    className="bg-background/80 font-medium"
                                >
                                    {auth.equipo.nombre}
                                </Badge>
                            )}
                        </div>
                        <p className="flex items-center gap-1.5 text-xs text-muted-foreground capitalize">
                            <Calendar className="size-3.5" />
                            {fechaHoy}
                        </p>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            asChild
                            size="sm"
                            className="h-9 gap-1.5 text-xs shadow-xs"
                        >
                            <Link href={PropiedadController.create()}>
                                <Plus className="size-3.5" />
                                Nueva propiedad
                            </Link>
                        </Button>

                        <Button
                            asChild
                            variant="secondary"
                            size="sm"
                            className="h-9 gap-1.5 text-xs"
                        >
                            <Link href={ClienteController.create()}>
                                <Plus className="size-3.5" />
                                Nuevo cliente
                            </Link>
                        </Button>

                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-9 gap-1.5 text-xs"
                        >
                            <Link href={CoincidenciaController.index()}>
                                <Sparkles className="size-3.5 text-amber-500" />
                                Coincidencias ({stats.coincidencias.pendientes})
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Top Metrics Grid (5 KPI Cards) */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <StatCard
                        title="Propiedades Disponibles"
                        value={stats.propiedades.disponibles}
                        description={`${stats.propiedades.totales} en portafolio`}
                        icon={Building2}
                        iconColor="text-blue-600 dark:text-blue-400"
                        iconBg="bg-blue-500/10 dark:bg-blue-500/15"
                        href={`${indexPropiedades().url}?estado=disponible`}
                        badge={{
                            text: `${stats.propiedades.reservadas} res.`,
                            className:
                                'bg-amber-500/10 text-amber-700 dark:text-amber-400',
                        }}
                    />

                    <StatCard
                        title="Clientes Activos"
                        value={stats.clientes.activos}
                        description={`${stats.clientes.totales} totales en cartera`}
                        icon={Users}
                        iconColor="text-indigo-600 dark:text-indigo-400"
                        iconBg="bg-indigo-500/10 dark:bg-indigo-500/15"
                        href={indexClientes().url}
                        badge={{
                            text: `+${stats.clientes.nuevos_mes} mes`,
                            className:
                                'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
                        }}
                    />

                    <StatCard
                        title="Coincidencias"
                        value={stats.coincidencias.pendientes}
                        description="Oportunidades listas"
                        icon={Sparkles}
                        iconColor="text-amber-600 dark:text-amber-400"
                        iconBg="bg-amber-500/10 dark:bg-amber-500/15"
                        href={indexCoincidencias().url}
                        badge={{
                            text:
                                stats.coincidencias.pendientes > 0
                                    ? 'Atención'
                                    : 'Al día',
                            className:
                                stats.coincidencias.pendientes > 0
                                    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                                    : 'bg-muted text-muted-foreground',
                        }}
                    />

                    <StatCard
                        title="Sin Seguimiento"
                        value={stats.clientes.sin_seguimiento}
                        description={
                            stats.clientes.sin_seguimiento > 0
                                ? 'Dale seguimiento a tus clientes'
                                : 'No hay clientes pendientes'
                        }
                        icon={Clock}
                        iconColor={
                            stats.clientes.sin_seguimiento > 0
                                ? 'text-rose-600 dark:text-rose-400'
                                : 'text-emerald-600 dark:text-emerald-400'
                        }
                        iconBg={
                            stats.clientes.sin_seguimiento > 0
                                ? 'bg-rose-500/10 dark:bg-rose-500/15'
                                : 'bg-emerald-500/10 dark:bg-emerald-500/15'
                        }
                        href={`${indexClientes().url}?sin_seguimiento=1`}
                        badge={{
                            text:
                                stats.clientes.sin_seguimiento > 0
                                    ? 'Urgente'
                                    : 'Al día',
                            className:
                                stats.clientes.sin_seguimiento > 0
                                    ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400'
                                    : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
                        }}
                    />

                    <StatCard
                        title="Cartera Disponible"
                        value={`L ${formatMoney(stats.valor_cartera.HNL)}`}
                        description={
                            stats.valor_cartera.USD > 0
                                ? `+ $${formatMoney(stats.valor_cartera.USD)} USD`
                                : 'Valor total en Lempiras'
                        }
                        icon={DollarSign}
                        iconColor="text-emerald-600 dark:text-emerald-400"
                        iconBg="bg-emerald-500/10 dark:bg-emerald-500/15"
                        badge={{
                            text: 'HNL',
                            className:
                                'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
                        }}
                    />
                </div>

                {/* Client Pipeline Funnel Card */}
                <PipelineCard
                    pipeline={pipeline_clientes}
                    totalClientes={stats.clientes.totales}
                    clientesActivos={stats.clientes.activos}
                    clientesCerrados={stats.clientes.cerrados}
                />

                {/* Two Columns: Portfolio Breakdown & Pending Matches */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <PortfolioCard
                        stats={stats.propiedades}
                        valorCartera={stats.valor_cartera}
                        propiedadesPorTipo={propiedades_por_tipo}
                    />

                    <CoincidenciasCard
                        coincidencias={coincidencias_recientes}
                        pendientesCount={stats.coincidencias.pendientes}
                    />
                </div>

                {/* Two Columns: Attention Required & Recent Listings */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <ClientesAtencionCard
                        clientes={clientes_atencion}
                        totalSinSeguimiento={stats.clientes.sin_seguimiento}
                    />

                    <PropiedadesRecientesCard
                        propiedades={propiedades_recientes}
                    />
                </div>

                {/* Two Columns: Recent Follow-up Activity & Team Members */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <ActividadCard actividades={actividad_reciente} />

                    <EquipoCard
                        agentes={agentes_equipo}
                        isAdmin={auth?.isAdmin ?? false}
                    />
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Panel',
            href: dashboard(),
        },
    ],
};
