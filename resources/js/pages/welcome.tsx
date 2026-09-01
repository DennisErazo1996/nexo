import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    BadgeCheck,
    Building2,
    CheckCircle2,
    ChevronRight,
    Clock,
    FileSpreadsheet,
    MessageSquare,
    Search,
    Shield,
    Sparkles,
    TrendingUp,
    Users,
    Zap,
} from 'lucide-react';
import { dashboard, login, register } from '@/routes';

export default function Welcome() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Nexo - CRM Inmobiliario Inteligente para Equipos y Agentes" />

            <div className="min-h-screen bg-background text-foreground selection:bg-[#a3bd31]/30 selection:text-foreground">
                {/* 1. Header / Navbar */}
                <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <Link href="/" className="flex items-center gap-2">
                            <img
                                src="/logo-nexo.png"
                                alt="Nexo"
                                className="h-9 w-auto object-contain dark:hidden"
                            />
                            <img
                                src="/logo-nexo-blanco.png"
                                alt="Nexo"
                                className="hidden h-9 w-auto object-contain dark:block"
                            />
                        </Link>

                        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
                            <a
                                href="#caracteristicas"
                                className="transition-colors hover:text-foreground"
                            >
                                Características
                            </a>
                            <a
                                href="#coincidencias"
                                className="transition-colors hover:text-foreground"
                            >
                                Motor de Coincidencias
                            </a>
                            <a
                                href="#como-funciona"
                                className="transition-colors hover:text-foreground"
                            >
                                Cómo funciona
                            </a>
                            {/* <a href="#precios" className="transition-colors hover:text-foreground">
                                Planes
                            </a> */}
                        </nav>

                        <div className="flex items-center gap-3">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-xs transition-all hover:bg-primary/90"
                                >
                                    <span>Ir al Panel</span>
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        Iniciar sesión
                                    </Link>
                                    <Link
                                        href={register()}
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-xs transition-all hover:bg-primary/90 hover:shadow-md"
                                    >
                                        <span>Registrar mi equipo</span>
                                        <ChevronRight className="h-4 w-4" />
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                <main>
                    {/* 2. Hero Section */}
                    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
                        {/* Luces y degradados sutiles de fondo */}
                        <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-125 w-200 -translate-x-1/2 rounded-full bg-[#a3bd31]/10 blur-3xl" />
                        <div className="pointer-events-none absolute top-60 right-0 -z-10 h-100 w-100 rounded-full bg-sky-500/10 blur-3xl" />

                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="mx-auto max-w-3xl space-y-6 text-center">
                                <div className="inline-flex items-center gap-2 rounded-full border border-[#a3bd31]/30 bg-[#a3bd31]/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-[#1A2B44] uppercase dark:text-[#a3bd31]">
                                    <Sparkles className="h-3.5 w-3.5 text-[#a3bd31]" />
                                    <span>
                                        CRM Inmobiliario de Alto Rendimiento
                                    </span>
                                </div>

                                <h1 className="text-4xl leading-[1.15] font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                                    Centraliza tu inventario y{' '}
                                    <span className="text-[#1A2B44] dark:text-[#a3bd31]">
                                        multiplica tus ventas
                                    </span>{' '}
                                    en equipo.
                                </h1>

                                <p className="lg:text-md text-base leading-relaxed text-muted-foreground sm:text-sm">
                                    Nexo es la bitácora inteligente que conecta
                                    en tiempo real los clientes compradores con
                                    las propiedades disponibles de tus agentes,
                                    eliminando las oportunidades perdidas.
                                </p>

                                {/* <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
                                    <Link
                                        href={auth.user ? dashboard() : register()}
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:scale-[1.02]"
                                    >
                                        <span>{auth.user ? 'Entrar a mi panel' : 'Comenzar prueba gratis'}</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                    <a
                                        href="#coincidencias"
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-base font-medium text-foreground shadow-2xs transition-all hover:bg-muted"
                                    >
                                        <span>Conocer el motor de cruces</span>
                                    </a>
                                </div>

                                <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1.5">
                                        <CheckCircle2 className="h-4 w-4 text-[#a3bd31]" />
                                        <span>Sin tarjetas al registrarte</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <CheckCircle2 className="h-4 w-4 text-[#a3bd31]" />
                                        <span>Invitación ilimitada de agentes</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <CheckCircle2 className="h-4 w-4 text-[#a3bd31]" />
                                        <span>Configuración en 2 minutos</span>
                                    </div>
                                </div> */}
                            </div>

                            {/* Preview Mockup UI */}
                            <div className="relative mx-auto mt-14 max-w-5xl rounded-2xl border border-border/80 bg-card p-3 shadow-2xl md:p-4">
                                <div className="overflow-hidden rounded-xl border border-border/60 bg-muted/30">
                                    {/* Barra superior de ventana simulada */}
                                    <div className="flex items-center justify-between border-b border-border/50 bg-card px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="h-3 w-3 rounded-full bg-red-400/80" />
                                            <div className="h-3 w-3 rounded-full bg-amber-400/80" />
                                            <div className="h-3 w-3 rounded-full bg-emerald-400/80" />
                                            <span className="ml-2 text-xs font-medium text-muted-foreground">
                                                app.nexo.crm / dashboard
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                                            <span className="h-2 w-2 animate-pulse rounded-full bg-[#a3bd31]" />
                                            En vivo: Cruces de demanda activos
                                        </div>
                                    </div>

                                    {/* Dashboard Preview Cards Grid */}
                                    <div className="grid gap-4 p-4 sm:p-6 md:grid-cols-3">
                                        <div className="space-y-2 rounded-lg border border-border bg-card p-4 shadow-xs">
                                            <div className="flex items-center justify-between text-muted-foreground">
                                                <span className="text-xs font-medium">
                                                    Inventario Activo
                                                </span>
                                                <Building2 className="h-4 w-4 text-primary" />
                                            </div>
                                            <div className="text-2xl font-bold">
                                                148 Inmuebles
                                            </div>
                                            <p className="text-xs font-medium text-emerald-600">
                                                +12 nuevas esta semana
                                            </p>
                                        </div>

                                        <div className="space-y-2 rounded-lg border border-border bg-card p-4 shadow-xs">
                                            <div className="flex items-center justify-between text-muted-foreground">
                                                <span className="text-xs font-medium">
                                                    Clientes Registrados
                                                </span>
                                                <Users className="h-4 w-4 text-primary" />
                                            </div>
                                            <div className="text-2xl font-bold">
                                                384 Contactos
                                            </div>
                                            <p className="text-xs font-medium text-emerald-600">
                                                85 con presupuesto calificado
                                            </p>
                                        </div>

                                        <div className="space-y-2 rounded-lg border border-primary/20 bg-primary/5 p-4 shadow-xs">
                                            <div className="flex items-center justify-between text-primary">
                                                <span className="text-xs font-semibold tracking-wider uppercase">
                                                    Coincidencias Listas
                                                </span>
                                                <Zap className="h-4 w-4 text-[#a3bd31]" />
                                            </div>
                                            <div className="text-2xl font-bold text-foreground">
                                                42 Cruces Directos
                                            </div>
                                            <p className="text-xs font-medium text-muted-foreground">
                                                Compradores esperando visita
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 3. Problem vs Solution Banner */}
                    <section className="border-y border-border bg-muted/40 py-16">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
                                <div className="space-y-4">
                                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-destructive uppercase">
                                        <span>
                                            El problema clásico de las
                                            inmobiliarias
                                        </span>
                                    </div>
                                    <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                        ¿Tus agentes usan hojas de Excel y
                                        grupos de WhatsApp caóticos?
                                    </h2>
                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        Cuando un agente capta una propiedad y
                                        otro agente tiene al cliente perfecto,
                                        la venta no ocurre porque nadie sabe lo
                                        que el otro tiene registrado. Nexo
                                        soluciona este silo de información de
                                        inmediato.
                                    </p>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="space-y-2 rounded-xl border border-border bg-card p-4">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                                            <FileSpreadsheet className="h-4 w-4" />
                                        </div>
                                        <h3 className="text-sm font-semibold">
                                            Archivos desactualizados
                                        </h3>
                                        <p className="text-xs text-muted-foreground">
                                            Precios viejos y propiedades ya
                                            vendidas que confunden al equipo.
                                        </p>
                                    </div>

                                    <div className="space-y-2 rounded-xl border border-primary/20 bg-card p-4">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#a3bd31]/20 text-[#a3bd31]">
                                            <Zap className="h-4 w-4" />
                                        </div>
                                        <h3 className="text-sm font-semibold">
                                            Cruce instantáneo Nexo
                                        </h3>
                                        <p className="text-xs text-muted-foreground">
                                            Todo el inventario y demanda
                                            conectados y sincronizados en tiempo
                                            real.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 4. Features Section */}
                    <section id="caracteristicas" className="py-20">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="mx-auto mb-14 max-w-2xl space-y-3 text-center">
                                <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                    Funcionalidades
                                </div>
                                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                                    Todo lo que tu equipo necesita en un solo
                                    panel
                                </h2>
                                <p className="text-sm text-muted-foreground sm:text-base">
                                    Diseñado específicamente para el flujo real
                                    de agencias y corredores inmobiliarios.
                                </p>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {/* Feature 1 */}
                                <div className="space-y-3 rounded-2xl border border-border bg-card p-6 shadow-xs transition-all hover:border-primary/40 hover:shadow-md">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <Building2 className="h-5 w-5" />
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground">
                                        Catálogo de Propiedades
                                    </h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        Registra inmuebles con galerías
                                        fotográficas, especificaciones técnicas,
                                        precio, tipo de moneda, ubicación y
                                        agente responsable.
                                    </p>
                                </div>

                                {/* Feature 2 */}
                                <div className="space-y-3 rounded-2xl border border-border bg-card p-6 shadow-xs transition-all hover:border-primary/40 hover:shadow-md">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <Users className="h-5 w-5" />
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground">
                                        Gestión de Clientes
                                    </h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        Guarda los requerimientos exactos de
                                        cada comprador: presupuesto min/max,
                                        zonas deseadas, tipo de propiedad y
                                        estado de atención.
                                    </p>
                                </div>

                                {/* Feature 3 */}
                                <div className="space-y-3 rounded-2xl border border-[#a3bd31]/40 bg-[#a3bd31]/5 p-6 shadow-xs transition-all hover:shadow-md">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#a3bd31]/20 text-[#a3bd31]">
                                        <Sparkles className="h-5 w-5" />
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground">
                                        Motor de Coincidencias
                                    </h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        El sistema evalúa de forma automática el
                                        catálogo contra las solicitudes de
                                        clientes y te avisa cuando existe
                                        compatibilidad de compra/alquiler.
                                    </p>
                                </div>

                                {/* Feature 4 */}
                                <div className="space-y-3 rounded-2xl border border-border bg-card p-6 shadow-xs transition-all hover:border-primary/40 hover:shadow-md">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <MessageSquare className="h-5 w-5" />
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground">
                                        Notas de Seguimiento
                                    </h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        Registra llamadas, visitas y comentarios
                                        en el expediente de cada cliente para
                                        que ningún contacto se quede sin
                                        atender.
                                    </p>
                                </div>

                                {/* Feature 5 */}
                                <div className="space-y-3 rounded-2xl border border-border bg-card p-6 shadow-xs transition-all hover:border-primary/40 hover:shadow-md">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <Shield className="h-5 w-5" />
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground">
                                        Equipos y Roles
                                    </h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        Invita a tus agentes con enlaces
                                        firmados seguros. Administra qué agentes
                                        gestionan cada propiedad y cliente.
                                    </p>
                                </div>

                                {/* Feature 6 */}
                                <div className="space-y-3 rounded-2xl border border-border bg-card p-6 shadow-xs transition-all hover:border-primary/40 hover:shadow-md">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <TrendingUp className="h-5 w-5" />
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground">
                                        Métricas en Vivo
                                    </h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        Visualiza el embudo de clientes,
                                        propiedades más activas y desempeño del
                                        equipo desde el dashboard central.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 5. Deep Dive: Motor de Coincidencias */}
                    <section
                        id="coincidencias"
                        className="border-t border-border bg-muted/30 py-20"
                    >
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                                <div className="space-y-6">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-[#a3bd31]/30 bg-[#a3bd31]/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-primary uppercase dark:text-[#a3bd31]">
                                        <Zap className="h-3.5 w-3.5" />
                                        <span>El corazón de Nexo</span>
                                    </div>

                                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                                        ¿Cómo funciona el motor de coincidencias
                                        automáticas?
                                    </h2>

                                    <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                                        Cada vez que un agente da de alta un
                                        inmueble o registra los deseos de un
                                        nuevo prospecto, Nexo compara los
                                        parámetros y crea una relación directa:
                                    </p>

                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                                                1
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold">
                                                    Cruce por Presupuesto y
                                                    Moneda
                                                </h4>
                                                <p className="text-xs text-muted-foreground">
                                                    Filtra automáticamente si el
                                                    precio encaja dentro del
                                                    rango del cliente.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                                                2
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold">
                                                    Zona geográfica y Tipo de
                                                    Inmueble
                                                </h4>
                                                <p className="text-xs text-muted-foreground">
                                                    Casa, departamento, terreno
                                                    o local en la colonia o
                                                    sector buscado.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                                                3
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold">
                                                    Notificación y Acción
                                                    Inmediata
                                                </h4>
                                                <p className="text-xs text-muted-foreground">
                                                    El agente puede contactar al
                                                    cliente con la ficha exacta
                                                    sin perder horas buscando.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-xl">
                                    <div className="flex items-center justify-between border-b border-border pb-3">
                                        <span className="text-xs font-bold tracking-wider text-primary uppercase">
                                            Ejemplo de Coincidencia
                                        </span>
                                        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                            100% Compatible
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="space-y-1 rounded-lg bg-muted/60 p-3 text-xs">
                                            <p className="font-bold text-foreground">
                                                Requerimiento de Cliente: Carlos
                                                Mendoza
                                            </p>
                                            <p className="text-muted-foreground">
                                                Busca: Casa en Venta ·
                                                Presupuesto: $150,000 - $220,000
                                                USD
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-center py-1">
                                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#a3bd31]/20 text-[#a3bd31]">
                                                <Zap className="h-4 w-4" />
                                            </div>
                                        </div>

                                        <div className="space-y-1 rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs">
                                            <p className="font-bold text-foreground">
                                                Inmueble Captado: Residencia Las
                                                Cumbres
                                            </p>
                                            <p className="text-muted-foreground">
                                                Precio: $195,000 USD · Agente
                                                captador: Sofía R.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-2 text-center">
                                        <Link
                                            href={
                                                auth.user
                                                    ? dashboard()
                                                    : register()
                                            }
                                            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                                        >
                                            Probar con tu propio inventario{' '}
                                            <ArrowRight className="h-3 w-3" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 6. Pricing Plans (SaaS Model) */}
                    <section id="precios" className="py-20">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            {/* <div className="mx-auto max-w-2xl text-center space-y-3 mb-14">
                                <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Planes para Equipos
                                </div>
                                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                                    Precios simples que crecen con tu inmobiliaria
                                </h2>
                                <p className="text-sm text-muted-foreground sm:text-base">
                                    Elige el plan ideal para tu agencia. Cancela o cambia de plan cuando quieras.
                                </p>
                            </div> */}

                            <div className="grid gap-8 lg:grid-cols-3">
                                {/* Plan 1: Starter */}
                                {/* <div className="rounded-2xl border border-border bg-card p-8 shadow-xs flex flex-col justify-between space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-foreground">Agente Individual</h3>
                                        <p className="text-xs text-muted-foreground">Para corredores independientes que quieren ordenar su cartera.</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-bold">$19</span>
                                            <span className="text-xs text-muted-foreground">/ mes</span>
                                        </div>
                                        <ul className="space-y-2.5 text-xs text-muted-foreground pt-2">
                                            <li className="flex items-center gap-2">
                                                <CheckCircle2 className="h-4 w-4 text-[#a3bd31]" />
                                                <span>1 Agente / Usuario</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle2 className="h-4 w-4 text-[#a3bd31]" />
                                                <span>Hasta 50 Propiedades activas</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle2 className="h-4 w-4 text-[#a3bd31]" />
                                                <span>Hasta 100 Clientes y notas</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle2 className="h-4 w-4 text-[#a3bd31]" />
                                                <span>Motor de coincidencias</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <Link
                                        href={register()}
                                        className="w-full inline-flex items-center justify-center rounded-xl border border-border bg-card py-2.5 text-sm font-semibold hover:bg-muted transition-colors"
                                    >
                                        Comenzar con Starter
                                    </Link>
                                </div> */}

                                {/* Plan 2: Pro Inmobiliaria (Featured) */}
                                {/* <div className="relative rounded-2xl border-2 border-primary bg-card p-8 shadow-xl flex flex-col justify-between space-y-6">
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground">
                                        Más Popular
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-foreground">Inmobiliaria Pro</h3>
                                        <p className="text-xs text-muted-foreground">Para equipos y agencias que comparten cartera y clientes.</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-bold">$49</span>
                                            <span className="text-xs text-muted-foreground">/ mes</span>
                                        </div>
                                        <ul className="space-y-2.5 text-xs text-foreground pt-2">
                                            <li className="flex items-center gap-2">
                                                <CheckCircle2 className="h-4 w-4 text-[#a3bd31]" />
                                                <span className="font-medium">Hasta 5 Agentes incluidos</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle2 className="h-4 w-4 text-[#a3bd31]" />
                                                <span>Propiedades ilimitadas</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle2 className="h-4 w-4 text-[#a3bd31]" />
                                                <span>Clientes y notas ilimitados</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle2 className="h-4 w-4 text-[#a3bd31]" />
                                                <span>Coincidencias cruzadas en tiempo real</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle2 className="h-4 w-4 text-[#a3bd31]" />
                                                <span>Invitaciones de equipo con enlace seguro</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <Link
                                        href={register()}
                                        className="w-full inline-flex items-center justify-center rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all"
                                    >
                                        Probar 14 días gratis
                                    </Link>
                                </div> */}

                                {/* Plan 3: Brokerage */}
                                {/* <div className="rounded-2xl border border-border bg-card p-8 shadow-xs flex flex-col justify-between space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-foreground">Brokerage / Franquicia</h3>
                                        <p className="text-xs text-muted-foreground">Para agencias de alto volumen con múltiples sedes.</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-bold">$99</span>
                                            <span className="text-xs text-muted-foreground">/ mes</span>
                                        </div>
                                        <ul className="space-y-2.5 text-xs text-muted-foreground pt-2">
                                            <li className="flex items-center gap-2">
                                                <CheckCircle2 className="h-4 w-4 text-[#a3bd31]" />
                                                <span>Hasta 15 Agentes incluidos</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle2 className="h-4 w-4 text-[#a3bd31]" />
                                                <span>Todo lo de Pro ilimitado</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle2 className="h-4 w-4 text-[#a3bd31]" />
                                                <span>Reportes de rendimiento por agente</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle2 className="h-4 w-4 text-[#a3bd31]" />
                                                <span>Soporte prioritario por WhatsApp</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <Link
                                        href={register()}
                                        className="w-full inline-flex items-center justify-center rounded-xl border border-border bg-card py-2.5 text-sm font-semibold hover:bg-muted transition-colors"
                                    >
                                        Contactar para Enterprise
                                    </Link>
                                </div> */}
                            </div>
                        </div>
                    </section>

                    {/* 7. Call To Action Banner */}
                    <section className="bg-[#1A2B44] py-16 text-white">
                        <div className="mx-auto max-w-5xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                Empieza hoy a cruzar clientes y cerrar más
                                ventas
                            </h2>
                            <p className="mx-auto max-w-2xl text-sm text-slate-300 sm:text-base">
                                Únete a los equipos inmobiliarios que ya dejaron
                                atrás las hojas de cálculo y tienen su bitácora
                                sincronizada con Nexo.
                            </p>
                            <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
                                <Link
                                    href={auth.user ? dashboard() : register()}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#a3bd31] px-6 py-3.5 text-sm font-bold text-[#1A2B44] shadow-md transition-all hover:scale-[1.02] hover:bg-[#a3bd31]/90 sm:w-auto"
                                >
                                    <span>
                                        {auth.user
                                            ? 'Ir a mi panel'
                                            : 'Crear mi equipo gratis'}
                                    </span>
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                                {!auth.user && (
                                    <Link
                                        href={login()}
                                        className="inline-flex w-full items-center justify-center rounded-xl border border-white/20 px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/10 sm:w-auto"
                                    >
                                        Ya tengo cuenta
                                    </Link>
                                )}
                            </div>
                        </div>
                    </section>
                </main>

                {/* 8. Footer */}
                <footer className="border-t border-border bg-background py-10">
                    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3">
                            <img
                                src="/logo-nexo.png"
                                alt="Nexo"
                                className="h-7 w-auto object-contain dark:hidden"
                            />
                            <img
                                src="/logo-nexo-blanco.png"
                                alt="Nexo"
                                className="hidden h-7 w-auto object-contain dark:block"
                            />
                            <span>
                                &copy; {new Date().getFullYear()} Nexo CRM
                                Inmobiliario. Todos los derechos reservados.
                            </span>
                        </div>
                        <div className="flex items-center gap-6">
                            <Link
                                href={login()}
                                className="transition-colors hover:text-foreground"
                            >
                                Iniciar sesión
                            </Link>
                            <Link
                                href={register()}
                                className="transition-colors hover:text-foreground"
                            >
                                Registrar equipo
                            </Link>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
