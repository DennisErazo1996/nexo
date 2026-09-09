import { Link } from '@inertiajs/react';
import {
    Building2,
    LayoutGrid,
    Route as RouteIcon,
    Sparkles,
    UserRound,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavThemeToggle } from '@/components/nav-theme-toggle';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as indexClientes } from '@/routes/clientes';
import { index as indexCoincidencias } from '@/routes/coincidencias';
import { edit as editEquipo } from '@/routes/equipo';
import { index as indexPropiedades } from '@/routes/propiedades';
import { index as indexSeguimientos } from '@/routes/seguimientos';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Panel',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Clientes',
        href: indexClientes(),
        icon: UserRound,
    },
    {
        title: 'Propiedades',
        href: indexPropiedades(),
        icon: Building2,
    },
    {
        title: 'Coincidencias',
        href: indexCoincidencias(),
        icon: Sparkles,
    },
    {
        title: 'Seguimientos',
        href: indexSeguimientos(),
        icon: RouteIcon,
    },
    {
        title: 'Equipo',
        href: editEquipo(),
        icon: Users,
    },
];

export function AppSidebar() {
    const { setOpenMobile } = useSidebar();

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link
                                href={dashboard()}
                                prefetch
                                onClick={() => setOpenMobile(false)}
                            >
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <NavThemeToggle />
                </SidebarMenu>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
