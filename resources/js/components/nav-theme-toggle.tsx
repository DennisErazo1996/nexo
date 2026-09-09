import { Moon, Sun } from 'lucide-react';
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useAppearance } from '@/hooks/use-appearance';

export function NavThemeToggle() {
    const { resolvedAppearance, updateAppearance } = useAppearance();

    const isDark = resolvedAppearance === 'dark';

    const toggleTheme = () => {
        updateAppearance(isDark ? 'light' : 'dark');
    };

    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                onClick={toggleTheme}
                tooltip={{
                    children: isDark
                        ? 'Cambiar a modo claro'
                        : 'Cambiar a modo oscuro',
                }}
                className="cursor-pointer"
            >
                {isDark ? (
                    <Sun className="size-4 text-amber-500" />
                ) : (
                    <Moon className="size-4 text-indigo-500" />
                )}
                <span>{isDark ? 'Modo claro' : 'Modo oscuro'}</span>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}
