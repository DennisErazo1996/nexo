import { Link } from '@inertiajs/react';
import { ArrowRight, TrendingUp, Users } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { index as indexClientes } from '@/routes/clientes';
import type { PipelineStage } from '@/types/dashboard';

type PipelineCardProps = {
    pipeline: PipelineStage[];
    totalClientes: number;
    clientesActivos: number;
};

const STAGE_CONFIG: Record<
    string,
    { color: string; bg: string; dot: string; border: string; bar: string }
> = {
    nuevo: {
        color: 'text-blue-600 dark:text-blue-400',
        bg: 'bg-blue-500/10 dark:bg-blue-500/15',
        dot: 'bg-blue-500',
        border: 'border-blue-200/60 dark:border-blue-900/40',
        bar: 'bg-blue-500',
    },
    contactado: {
        color: 'text-indigo-600 dark:text-indigo-400',
        bg: 'bg-indigo-500/10 dark:bg-indigo-500/15',
        dot: 'bg-indigo-500',
        border: 'border-indigo-200/60 dark:border-indigo-900/40',
        bar: 'bg-indigo-500',
    },
    visitando: {
        color: 'text-amber-600 dark:text-amber-400',
        bg: 'bg-amber-500/10 dark:bg-amber-500/15',
        dot: 'bg-amber-500',
        border: 'border-amber-200/60 dark:border-amber-900/40',
        bar: 'bg-amber-500',
    },
    negociando: {
        color: 'text-purple-600 dark:text-purple-400',
        bg: 'bg-purple-500/10 dark:bg-purple-500/15',
        dot: 'bg-purple-500',
        border: 'border-purple-200/60 dark:border-purple-900/40',
        bar: 'bg-purple-500',
    },
    cerrado: {
        color: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
        dot: 'bg-emerald-500',
        border: 'border-emerald-200/60 dark:border-emerald-900/40',
        bar: 'bg-emerald-500',
    },
    perdido: {
        color: 'text-rose-600 dark:text-rose-400',
        bg: 'bg-rose-500/10 dark:bg-rose-500/15',
        dot: 'bg-rose-500',
        border: 'border-rose-200/60 dark:border-rose-900/40',
        bar: 'bg-rose-400',
    },
};

export function PipelineCard({
    pipeline,
    totalClientes,
    clientesActivos,
}: PipelineCardProps) {
    const cerradosCount =
        pipeline.find((p) => p.estado === 'cerrado')?.count ?? 0;
    const tasaCierre =
        totalClientes > 0
            ? Math.round((cerradosCount / totalClientes) * 100)
            : 0;

    return (
        <Card className="flex flex-col justify-between py-5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <div className="flex items-center gap-2">
                        <Users className="size-4 text-primary" />
                        <CardTitle className="text-base font-semibold">
                            Pipeline de Clientes
                        </CardTitle>
                    </div>
                    <CardDescription className="text-xs">
                        Avance de prospectos en el embudo comercial (
                        {clientesActivos} activos de {totalClientes} totales)
                    </CardDescription>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg border bg-muted/40 px-2.5 py-1 text-xs">
                    <TrendingUp className="size-3.5 text-emerald-500" />
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {tasaCierre}%
                    </span>
                    <span className="text-muted-foreground">cierre</span>
                </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-2">
                {/* Visual Segmented Progress Bar */}
                <div className="flex h-3.5 w-full overflow-hidden rounded-full bg-muted p-0.5 shadow-inner">
                    {totalClientes === 0 ? (
                        <div className="h-full w-full rounded-full bg-muted" />
                    ) : (
                        pipeline.map((stage) => {
                            if (stage.count === 0) {
                                return null;
                            }

                            const config = STAGE_CONFIG[stage.estado] ?? {
                                bar: 'bg-muted-foreground',
                            };

                            return (
                                <div
                                    key={stage.estado}
                                    style={{ width: `${stage.porcentaje}%` }}
                                    title={`${stage.label}: ${stage.count} (${stage.porcentaje}%)`}
                                    className={cn(
                                        'h-full transition-all duration-300 first:rounded-l-full last:rounded-r-full',
                                        config.bar,
                                    )}
                                />
                            );
                        })
                    )}
                </div>

                {/* Stage Grid Cards */}
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
                    {pipeline.map((stage) => {
                        const config = STAGE_CONFIG[stage.estado] ?? {
                            color: 'text-foreground',
                            bg: 'bg-muted',
                            dot: 'bg-muted-foreground',
                            border: 'border-border',
                        };

                        return (
                            <Link
                                key={stage.estado}
                                href={`${indexClientes().url}?estado=${stage.estado}`}
                                className={cn(
                                    'group flex flex-col justify-between rounded-lg border p-2.5 transition-all duration-150 hover:shadow-sm',
                                    config.bg,
                                    config.border,
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                        <span
                                            className={cn(
                                                'size-2 rounded-full',
                                                config.dot,
                                            )}
                                        />
                                        {stage.label}
                                    </span>
                                    <ArrowRight className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                                </div>
                                <div className="mt-2 flex items-baseline justify-between">
                                    <span className="text-xl font-bold tracking-tight">
                                        {stage.count}
                                    </span>
                                    <span className="text-[11px] text-muted-foreground">
                                        {stage.porcentaje}%
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
