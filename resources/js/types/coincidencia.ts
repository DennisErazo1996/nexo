export type EstadoCoincidencia = 'pendiente' | 'notificado' | 'descartado';

export type Coincidencia = {
    id: number;
    cliente_id: number;
    propiedad_id: number;
    estado: EstadoCoincidencia;
    created_at: string;
    cliente?: { id: number; nombre: string; telefono: string };
    propiedad?: {
        id: number;
        tipo: string;
        zona: string;
        precio: string;
        moneda: string;
    };
};

export type CoincidenciaPaginado = {
    data: Coincidencia[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};
