import { usePage } from '@inertiajs/react';

export default function AppLogo() {
    const { name } = usePage().props;

    return (
        <div className="flex items-center">
            <img
                src="/logo-nexo.png"
                alt={name || 'Nexo'}
                className="h-7 w-auto object-contain group-data-[collapsible=icon]:hidden dark:hidden"
            />
            <img
                src="/logo-nexo-blanco.png"
                alt={name || 'Nexo'}
                className="hidden h-7 w-auto object-contain group-data-[collapsible=icon]:hidden dark:block"
            />
            <img
                src="/favicon.png"
                alt={name || 'Nexo'}
                className="hidden size-6 object-contain group-data-[collapsible=icon]:block"
            />
        </div>
    );
}
