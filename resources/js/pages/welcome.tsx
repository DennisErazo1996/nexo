import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login } from '@/routes';
import { register } from '@/routes';

export default function Welcome() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Bienvenido" />
            <div className="flex min-h-screen flex-col items-center bg-background p-6 text-foreground lg:justify-center lg:p-8">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="inline-block rounded-md border border-border px-5 py-1.5 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
                            >
                                Panel
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="inline-block rounded-md border border-transparent px-5 py-1.5 text-sm font-medium transition-colors hover:text-primary"
                                >
                                    Iniciar sesión
                                </Link>
                                <Link
                                    href={register()}
                                    className="inline-block rounded-md border border-border px-5 py-1.5 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
                                >
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </nav>
                </header>
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[335px] flex-col-reverse shadow-xl rounded-lg border border-border/80 lg:max-w-4xl lg:flex-row">
                        <div className="flex-1 rounded-br-lg rounded-bl-lg bg-card p-6 pb-12 text-[13px] leading-[20px] lg:rounded-tl-lg lg:rounded-br-none lg:p-16">
                            <h1 className="mb-1 text-lg font-semibold text-foreground">Empecemos</h1>
                            <p className="mb-4 text-muted-foreground">
                                Nexo es tu bitácora compartida de clientes y
                                propiedades.
                                <br />
                                Inicia sesión o crea una cuenta para empezar.
                            </p>
                            <ul className="flex gap-3 text-sm leading-normal">
                                <li>
                                    <Link
                                        href={auth.user ? dashboard() : login()}
                                        className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                        {auth.user
                                            ? 'Ir al panel'
                                            : 'Iniciar sesión'}
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="relative -mb-px flex aspect-[335/364] w-full shrink-0 items-center justify-center overflow-hidden rounded-t-lg bg-muted/40 p-12 lg:mb-0 lg:-ml-px lg:aspect-auto lg:w-[438px] lg:rounded-t-none lg:rounded-r-lg dark:bg-muted/10">
                            <img
                                src="/logo-nexo.png"
                                alt="Nexo"
                                className="max-h-24 w-auto max-w-[280px] object-contain transition-transform duration-300 hover:scale-105 dark:hidden"
                            />
                            <img
                                src="/logo-nexo-blanco.png"
                                alt="Nexo"
                                className="hidden max-h-24 w-auto max-w-[280px] object-contain transition-transform duration-300 hover:scale-105 dark:block"
                            />
                            <div className="absolute inset-0 rounded-t-lg shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-t-none lg:rounded-r-lg dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]"></div>
                        </div>
                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
