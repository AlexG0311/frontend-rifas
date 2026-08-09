// types/resultado.type.ts

// ── Union type para estados de entrega ──
export type EstadoEntrega = 'PENDIENTE' | 'CONTACTADO' | 'ENTREGADO' | 'NO_RECLAMADO' | 'CANCELADO';

// ── Payloads (request bodies) ──

/** POST /rifas/:uuid/sorteo */
export interface RegistrarSorteoPayload {
  idLoteria: number;
  fechaSorteo: string;
  numeroGanador: string;
  serie?: string;
  numeroManual?: string;
}

/** POST /loterias/resultados/procesar */
export interface ProcesarResultadoPayload {
  idLoteria: number;
  fechaSorteo: string;
  numeroGanador: string;
  serie?: string;
}

/** PATCH /rifas/:uuid/ganador/entrega */
export interface ActualizarEntregaPayload {
  estadoEntrega: EstadoEntrega;
  nombreRecibido?: string;
  telefonoConfirmado?: string;
  observacion?: string;
}

// ── Responses ──

/** POST /rifas/:uuid/sorteo — response.data */
export interface RegistrarSorteoResponse {
  idSorteo: number;
  idLoteria: number;
  fechaSorteo: string;
  numeroGanador: string;
  serie?: string;
  numeroCalculado?: string;
  rifaSorteada: boolean;
}

/** POST /loterias/resultados/procesar — response.data */
export interface ProcesarResultadoResponse {
  totalRifasProcesadas: number;
  idLoteria: number;
  fechaSorteo: string;
  numeroGanador: string;
  serie?: string;
}

/** POST /rifas/:uuid/declarar-ganador — response.data */
export interface DeclararGanadorResponse {
  idGanador: number;
  numeroGanador: string;
  cliente: {
    nombre: string;
    telefono: string;
  };
  estadoEntrega: EstadoEntrega;
}

/** PATCH /rifas/:uuid/ganador/entrega — response.data */
export interface ActualizarEntregaResponse {
  idGanador: number;
  estadoEntrega: { idEstadoEntrega: number; nombre: string };
  nombreRecibido?: string;
  telefonoConfirmado?: string;
  observacion?: string;
}

/** GET /rifas/:uuid/ganador — response.data */
export interface GanadorPublicoResponse {
  idGanador: number;
  nombreRecibido: string | null;
  telefonoConfirmado: string | null;
  fechaConfirmacion: string | null;
  observacion: string | null;
  numeroGanador: string;
  nombreCliente: string;
  estadoEntrega: {
    idEstadoEntrega: number;
    nombre: EstadoEntrega;
  };
  cliente: {
    idCliente: number;
    uuidPublico: string;
    nombre: string;
    apellido: string;
    correo: string;
    telefono: string;
  };
  numero: string;
  rifa: {
    idRifa: number;
    uuidPublico: string;
    titulo: string;
}
}
/** GET /rifas/:uuid/resultado — response.data */
export interface ResultadoRifaResponse {
  idResultadoRifa?: number;
  nombreLoteria?: string;
  fechaRegistro?: string;
  numeroGanador?: string | number | null;
  serie?: string | number | null;
  loteria?: {
    idResultadoLoteria?: string | number;
    fechaSorteo?: string | Date | null;
    numeroGanador?: string | number | null;
    serie?: string | number | null;
  } | null;
}
