import { Link } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type StatCardProps = {
    title: string;
    value: string | number;
    description?: string;
    icon: LucideIcon;
    badge?: {
        text: string;
        className?: string;
    };
    href?: string;
    iconColor?: string;
    iconBg?: string;
};

export function StatCard({
    title,
    value,
    description,
    icon: Icon,
    badge,
    href,
    iconColor = 'text-primary',
    iconBg = 'bg-primary/10',
}: StatCardProps) {
    const content = (
        <Card
            className={cn(
                'group relative overflow-hidden py-4 transition-all duration-200 hover:border-primary/40 hover:shadow-md',
                href && 'cursor-pointer',
            )}
        >
            <CardContent className="flex flex-col justify-between gap-3 px-5 py-1">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        {title}
                    </span>
                    <div
                        className={cn(
                            'flex size-9 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-105',
                            iconBg,
                        )}
                    >
                        <Icon className={cn('size-5', iconColor)} />
                    </div>
                </div>

                <div className="flex items-baseline justify-between gap-2">
                    <span className="text-2xl font-bold tracking-tight md:text-3xl">
                        {value}
                    </span>
                    {badge && (
                        <span
                            className={cn(
                                'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                                badge.className ??
                                    'bg-muted text-muted-foreground',
                            )}
                        >
                            {badge.text}
                        </span>
                    )}
                </div>

                {description && (
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="truncate">{description}</span>
                        {href && (
                            <ArrowUpRight className="size-3.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );

    if (href) {
        return (
            <Link href={href} className="block">
                {content}
            </Link>
        );
    }

    return content;
}
