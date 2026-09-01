export type FotoCompartible = {
    id: number;
    url_con_marca_agua: string;
};

export function isWebShareFotosSupported(): boolean {
    if (typeof navigator === 'undefined') {
        return false;
    }

    if (
        typeof navigator.share !== 'function' ||
        typeof navigator.canShare !== 'function'
    ) {
        return false;
    }

    const dummyFile = new File([], 'test.jpg', { type: 'image/jpeg' });

    return navigator.canShare({ files: [dummyFile] });
}

export async function compartirFotosPropiedad(
    fotos: FotoCompartible[],
    opciones: { propiedadId: number; titulo: string },
): Promise<'shared' | 'cancelled' | 'unsupported'> {
    const archivos = await Promise.all(
        fotos.map(async (foto, index) => {
            const response = await fetch(foto.url_con_marca_agua);
            const blob = await response.blob();
            const extension = blob.type.split('/')[1] ?? 'jpg';

            return new File(
                [blob],
                `propiedad-${opciones.propiedadId}-foto-${index + 1}.${extension}`,
                { type: blob.type },
            );
        }),
    );

    if (!navigator.canShare({ files: archivos })) {
        return 'unsupported';
    }

    try {
        await navigator.share({ files: archivos, title: opciones.titulo });

        return 'shared';
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            return 'cancelled';
        }

        throw error;
    }
}
