export type EstadoCoincidencia =
    | 'pendiente'
    | 'notificado'
    | 'visitando'
    | 'negociando'
    | 'cerrado'
    | 'descartado';

export type Coincidencia = {
    id: number;
    cliente_id: number;
    propiedad_id: number;
    estado: EstadoCoincidencia;
    created_at: string;
    cliente?: {
        id: number;
        nombre: string;
        telefono: string;
        agente_registro_id?: number;
        agente_registro?: {
            id: number;
            name: string;
        };
    };
    propiedad?: {
        id: number;
        tipo: string;
        zona: string;
        precio: string;
        moneda: string;
        agentes?: {
            id: number;
            agente_id: number;
            agente?: {
                id: number;
                name: string;
            };
        }[];
        fotos?: {
            id: number;
            url_con_marca_agua: string;
        }[];
    };
};

export type CoincidenciaPaginado = {
    data: Coincidencia[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from?: number | null;
    to?: number | null;
    links: { url: string | null; label: string; active: boolean }[];
};
