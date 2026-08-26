import { Link } from '@inertiajs/react';
import { Building2, CheckCircle2, Sparkles, Users } from 'lucide-react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="relative grid min-h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-12 lg:px-0">
            {/* Lado izquierdo: Branding Nexo (Desktop) */}
            <div className="relative hidden h-full flex-col justify-between overflow-hidden bg-[#1A2B44] p-10 text-white lg:col-span-5 lg:flex xl:col-span-4 dark:border-r dark:border-border/40">
                {/* Patrones decorativos de fondo */}
                <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#a3bd31]/15 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:20px_20px]" />

                {/* Encabezado con Logo */}
                <div className="relative z-20">
                    <Link
                        href={home()}
                        className="inline-flex items-center gap-2 transition-opacity hover:opacity-90"
                    >
                        <img
                            src="/logo-nexo-blanco.png"
                            alt="Nexo"
                            className="h-9 w-auto object-contain"
                        />
                    </Link>
                </div>

                {/* Contenido Central: Propuesta de Valor */}
                <div className="relative z-20 my-auto py-10 space-y-6">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#a3bd31]/30 bg-[#a3bd31]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#a3bd31]">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>CRM Inmobiliario</span>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-2xl font-bold tracking-tight text-white xl:text-3xl">
                            Tu bitácora compartida de clientes y propiedades.
                        </h2>
                        <p className="text-sm text-slate-300/90 leading-relaxed">
                            Organiza el inventario inmobiliario, gestiona los requerimientos de tus clientes y genera coincidencias automáticas en un solo lugar.
                        </p>
                    </div>

                    <div className="space-y-3.5 pt-2">
                        <div className="flex items-start gap-3 text-sm text-slate-200">
                            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#a3bd31]/20 text-[#a3bd31]">
                                <Building2 className="h-3 w-3" />
                            </div>
                            <span>Inventario centralizado de inmuebles con fichas técnicas y fotos.</span>
                        </div>
                        <div className="flex items-start gap-3 text-sm text-slate-200">
                            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#a3bd31]/20 text-[#a3bd31]">
                                <Users className="h-3 w-3" />
                            </div>
                            <span>Registro de clientes con presupuesto, zonas y seguimiento.</span>
                        </div>
                        <div className="flex items-start gap-3 text-sm text-slate-200">
                            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#a3bd31]/20 text-[#a3bd31]">
                                <CheckCircle2 className="h-3 w-3" />
                            </div>
                            <span>Cruce inteligente entre oferta y demanda inmobiliaria.</span>
                        </div>
                    </div>
                </div>

                {/* Footer del panel izquierdo */}
                <div className="relative z-20 text-xs text-slate-400">
                    &copy; {new Date().getFullYear()} Nexo. Todos los derechos reservados.
                </div>
            </div>

            {/* Lado derecho: Formulario */}
            <div className="flex min-h-svh w-full flex-col justify-center px-6 py-10 sm:px-10 lg:col-span-7 lg:px-14 xl:col-span-8">
                <div className="mx-auto flex w-full max-w-[440px] flex-col justify-center space-y-6">
                    {/* Logo visible solo en pantallas móviles */}
                    <div className="flex flex-col items-center justify-center lg:hidden">
                        <Link href={home()} className="inline-flex items-center">
                            <img
                                src="/logo-nexo.png"
                                alt="Nexo"
                                className="h-10 w-auto object-contain dark:hidden"
                            />
                            <img
                                src="/logo-nexo-blanco.png"
                                alt="Nexo"
                                className="hidden h-10 w-auto object-contain dark:block"
                            />
                        </Link>
                    </div>

                    {/* Encabezado del Formulario */}
                    <div className="flex flex-col space-y-1.5 text-center lg:text-left">
                        {title && (
                            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                {title}
                            </h1>
                        )}
                        {description && (
                            <p className="text-sm text-muted-foreground">
                                {description}
                            </p>
                        )}
                    </div>

                    {/* Contenido del Formulario */}
                    <div className="w-full">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
