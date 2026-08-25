import type { Cliente, EstadoCliente } from './cliente';
import type { Coincidencia } from './coincidencia';
import type { Propiedad } from './propiedad';

export type DashboardStats = {
    propiedades: {
        totales: number;
        disponibles: number;
        reservadas: number;
        vendidas: number;
        retiradas: number;
    };
    clientes: {
        totales: number;
        activos: number;
        nuevos_mes: number;
        cerrados: number;
        perdidos: number;
        sin_seguimiento: number;
    };
    coincidencias: {
        pendientes: number;
        notificadas: number;
    };
    valor_cartera: {
        HNL: number;
        USD: number;
    };
};

export type PipelineStage = {
    estado: EstadoCliente;
    label: string;
    count: number;
    porcentaje: number;
};

export type PropiedadPorTipo = {
    tipo: string;
    label: string;
    count: number;
    porcentaje: number;
};

export type ActividadItem = {
    id: number;
    texto: string;
    created_at: string;
    agente?: { id: number; name: string };
    cliente?: { id: number; nombre: string };
};

export type AgenteEquipo = {
    id: number;
    name: string;
    email: string;
    telefono: string | null;
    rol: 'admin' | 'agente';
    clientes_registrados_count?: number;
    propiedad_agentes_count?: number;
};

export type DashboardProps = {
    stats: DashboardStats;
    pipeline_clientes: PipelineStage[];
    propiedades_por_tipo: PropiedadPorTipo[];
    coincidencias_recientes: Coincidencia[];
    clientes_atencion: Cliente[];
    propiedades_recientes: Propiedad[];
    actividad_reciente: ActividadItem[];
    agentes_equipo: AgenteEquipo[];
};
