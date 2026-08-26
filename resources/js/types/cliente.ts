export type EstadoCliente = 'nuevo' | 'contactado';

export type EstadoOption = {
    value: EstadoCliente;
    label: string;
};

export type EtiquetaInteres = {
    id: number;
    nombre: string;
};

export type ClienteInteres = {
    id: number;
    etiqueta_id: number;
    zona: string | null;
    presupuesto_min: string | null;
    presupuesto_max: string | null;
    agente_id: number;
    created_at: string;
    etiqueta?: EtiquetaInteres;
    agente?: { id: number; name: string };
};

export type NotaSeguimiento = {
    id: number;
    texto: string;
    agente_id: number;
    propiedad_id?: number | null;
    created_at: string;
    agente?: { id: number; name: string };
    propiedad?: {
        id: number;
        tipo: string;
        zona: string;
        precio?: string;
        moneda?: string;
    } | null;
};

export type Cliente = {
    id: number;
    equipo_id: number;
    nombre: string;
    telefono: string;
    estado: EstadoCliente;
    agente_registro_id: number;
    created_at: string;
    updated_at: string;
    agente_registro?: { id: number; name: string };
    intereses?: ClienteInteres[];
    notas?: NotaSeguimiento[];
    notas_max_created_at?: string | null;
};

export type ClientePaginado = {
    data: Cliente[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from?: number | null;
    to?: number | null;
    links: { url: string | null; label: string; active: boolean }[];
};
