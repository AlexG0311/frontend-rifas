import type { EstadoEntrega } from './resultado.type';

export interface GanadorRifa {
  idGanador: string;
  nombreRecibido: string | null;
  telefonoConfirmado: string | null;
  fechaConfirmacion: string | null;
  observacion: string | null;
  estadoEntrega: {
    idEstadoEntrega: number;
    nombre: EstadoEntrega;
  };
  cliente: {
    idCliente: string;
    uuidPublico: string;
    nombre: string;
    apellido: string | null;
    correo: string;
    telefono: string;
  };
  numero: string;
  rifa: {
    idRifa: string;
    uuidPublico: string;
    titulo: string;
    premios: unknown[];
  };
}
