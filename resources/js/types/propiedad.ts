export type EnumOption = {
    value: string;
    label: string;
};

export type PropiedadFoto = {
    id: number;
    url: string;
    url_con_marca_agua: string;
    orden: number;
};

export type PropiedadEtiqueta = {
    id: number;
    etiqueta_id: number;
    etiqueta?: { id: number; nombre: string };
};

export type PropiedadAgente = {
    id: number;
    agente_id: number;
    porcentaje_comision: string | null;
    agente?: { id: number; name: string; telefono: string | null };
};

export type Propiedad = {
    id: number;
    equipo_id: number;
    tipo: string;
    zona: string;
    area_terreno: string;
    area_construccion: string | null;
    tamano?: string;
    unidad_medida: string;
    precio: string;
    moneda: string;
    forma_pago: string;
    condicion_legal: string | null;
    acceso: string | null;
    descripcion: string | null;
    estado: string;
    created_at: string;
    updated_at: string;
    fotos?: PropiedadFoto[];
    etiquetas?: PropiedadEtiqueta[];
    agentes?: PropiedadAgente[];
};

export type PropiedadPaginado = {
    data: Propiedad[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from?: number | null;
    to?: number | null;
    links: { url: string | null; label: string; active: boolean }[];
};
