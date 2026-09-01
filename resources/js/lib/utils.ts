import type { InertiaLinkProps } from '@inertiajs/react';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

export const MUNICIPIOS_LABELS: Record<string, string> = {
    campamento: 'Campamento',
    catacamas: 'Catacamas',
    concordia: 'Concordia',
    dulce_nombre_de_culmi: 'Dulce Nombre de Culmí',
    el_rosario: 'El Rosario',
    esquipulas_del_norte: 'Esquipulas del Norte',
    gualaco: 'Gualaco',
    guarizama: 'Guarizama',
    guata: 'Guata',
    guayape: 'Guayape',
    jano: 'Jano',
    juticalpa: 'Juticalpa',
    la_union: 'La Unión',
    mangulile: 'Mangulile',
    manto: 'Manto',
    patuca: 'Patuca',
    salama: 'Salamá',
    san_esteban: 'San Esteban',
    san_francisco_de_becerra: 'San Francisco de Becerra',
    san_francisco_de_la_paz: 'San Francisco de la Paz',
    santa_maria_del_real: 'Santa María del Real',
    silca: 'Silca',
    yocon: 'Yocón',
};

export const CONDICIONES_LEGALES_LABELS: Record<string, string> = {
    escritura_publica: 'Escritura pública',
    dominio_pleno: 'Dominio pleno',
    cesion_derechos: 'Cesión de derechos',
    papeles_en_regla: 'Papeles en regla',
    en_tramite: 'En trámite',
    herencia: 'Herencia',
};

export const TIPOS_PROPIEDAD_LABELS: Record<string, string> = {
    terreno: 'Terreno',
    casa: 'Casa',
    apartamento: 'Apartamento',
    local_comercial: 'Local comercial',
    bodega: 'Bodega',
    carro: 'Carro',
};

export const FORMAS_PAGO_LABELS: Record<string, string> = {
    contado: 'Contado',
    financiable: 'Financiable',
    negociable: 'Negociable',
};

export function formatMunicipio(value?: string | null): string {
    if (!value) return '';
    const lower = value.trim().toLowerCase();
    if (MUNICIPIOS_LABELS[lower]) {
        return MUNICIPIOS_LABELS[lower];
    }
    return value
        .replace(/[_-]/g, ' ')
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export function formatCondicionLegal(value?: string | null): string {
    if (!value) return '';
    const lower = value.trim().toLowerCase();
    if (CONDICIONES_LEGALES_LABELS[lower]) {
        return CONDICIONES_LEGALES_LABELS[lower];
    }
    return value
        .replace(/[_-]/g, ' ')
        .replace(/^\w/, (c) => c.toUpperCase());
}

export function formatTipoPropiedad(value?: string | null): string {
    if (!value) return '';
    const lower = value.trim().toLowerCase();
    if (TIPOS_PROPIEDAD_LABELS[lower]) {
        return TIPOS_PROPIEDAD_LABELS[lower];
    }
    return value
        .replace(/[_-]/g, ' ')
        .replace(/^\w/, (c) => c.toUpperCase());
}

export function formatFormaPago(value?: string | null): string {
    if (!value) return '';
    const lower = value.trim().toLowerCase();
    if (FORMAS_PAGO_LABELS[lower]) {
        return FORMAS_PAGO_LABELS[lower];
    }
    return value
        .replace(/[_-]/g, ' ')
        .replace(/^\w/, (c) => c.toUpperCase());
}

/**
 * Copies text to the clipboard using navigator.clipboard when available,
 * with a fallback to document.execCommand for non-secure contexts (HTTP/IPs).
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    if (!text) {
        return false;
    }

    // Try modern Clipboard API if supported and in secure context
    if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch {
            // Fall through to fallback
        }
    }

    // Fallback using temporary textarea and execCommand
    try {
        if (typeof document === 'undefined') {
            return false;
        }
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.top = '-9999px';
        textArea.style.left = '-9999px';
        textArea.style.opacity = '0';
        textArea.setAttribute('readonly', '');
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        textArea.setSelectionRange(0, 99999);

        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        return successful;
    } catch {
        return false;
    }
}

