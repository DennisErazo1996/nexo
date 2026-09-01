import { formatMunicipio } from '@/lib/utils';
import type { EnumOption, Propiedad } from '@/types/propiedad';

function labelFor(options: EnumOption[], value: string): string {
    return options.find((option) => option.value === value)?.label ?? value;
}

/**
 * Build a ready-to-paste WhatsApp/social media description for a propiedad:
 * tipo, ubicación, precio, numbered puntos clave, and contacto (spec §5).
 */
export function buildTextoCompartir(
    propiedad: Propiedad,
    tipos: EnumOption[],
    unidadesMedida: EnumOption[],
    monedas: EnumOption[],
    formasPago: EnumOption[],
    condicionesLegales: EnumOption[],
): string {
    const puntos: string[] = [];

    const areaTerreno = propiedad.area_terreno ?? propiedad.tamano;

    if (areaTerreno) {
        puntos.push(
            `Área de terreno: ${areaTerreno} ${labelFor(unidadesMedida, propiedad.unidad_medida ?? '')}`,
        );
    }

    if (propiedad.area_construccion) {
        puntos.push(
            `Área de construcción: ${propiedad.area_construccion} ${labelFor(unidadesMedida, propiedad.unidad_medida ?? '')}`,
        );
    }

    puntos.push(`Forma de pago: ${labelFor(formasPago, propiedad.forma_pago)}`);

    if (propiedad.condicion_legal) {
        puntos.push(
            `Condición legal: ${labelFor(condicionesLegales, propiedad.condicion_legal)}`,
        );
    }

    if (propiedad.acceso) {
        puntos.push(`Acceso: ${propiedad.acceso}`);
    }

    if (propiedad.etiquetas && propiedad.etiquetas.length > 0) {
        const nombres = propiedad.etiquetas
            .map((etiqueta) => etiqueta.etiqueta?.nombre)
            .filter(Boolean)
            .join(', ');

        if (nombres) {
            puntos.push(`Ideal para: ${nombres}`);
        }
    }

    const contacto = propiedad.agentes?.[0]?.agente;

    const lineas = [
        `${labelFor(tipos, propiedad.tipo)} en ${formatMunicipio(propiedad.zona)}`,
        `Precio: ${labelFor(monedas, propiedad.moneda)} ${propiedad.precio}`,
        '',
        'Puntos clave:',
        ...puntos.map((punto, i) => `${i + 1}. ${punto}`),
    ];

    if (propiedad.descripcion) {
        lineas.push('', propiedad.descripcion);
    }

    if (contacto) {
        let nombreMostrar = contacto.name;
        const partes = contacto.name.trim().split(/\s+/);
        if (partes.length >= 4) {
            // Asumimos: Nombre1 Nombre2 Apellido1 Apellido2 -> Nombre1 Apellido1
            nombreMostrar = `${partes[0]} ${partes[2]}`;
        } else if (partes.length === 3) {
            // Asumimos: Nombre1 Apellido1 Apellido2 -> Nombre1 Apellido1
            // o Nombre1 Nombre2 Apellido1 -> Nombre1 Apellido1
            // En ambos casos el índice 1 suele ser aceptable, o podemos usar el índice 1 o 2.
            // Para "un nombre y un apellido" es común tomar el primero y el segundo, o primero y último.
            // Tomaremos el primero y el último para mayor seguridad.
            nombreMostrar = `${partes[0]} ${partes[2]}`;
        } else if (partes.length === 2) {
            nombreMostrar = `${partes[0]} ${partes[1]}`;
        }

        lineas.push(
            '',
            `Contacto: ${nombreMostrar}${contacto.telefono ? ` — ${contacto.telefono}` : ''}`,
        );
    }

    return lineas.join('\n');
}
