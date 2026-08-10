export interface Rifa {
  idRifa: string;
  uuidPublico: string;
  titulo: string;
  descripcion: string;
  precioNumero: number;
  imagenPrincipal?: string,
  numeroInicial: number;
  numeroFinal: number;
  fechaInicio: string;
  fechaCierre: string;
  fechaSorteo: string;
  fechaCreacion: string;
  fechaActualizacion: string | null;

  estado: {
    idEstadoRifa: number;
    nombre: string;
  };

  loteria: {
    idLoteria: number;
    nombre: string;
  };

  productos: {
    idDetalleRifa: string;
    idProducto: string;
    cantidad: number;
  }[];
}

export interface NumeroRifa {
  numero: number;
  estado: "DISPONIBLE" | "RESERVADO" | "VENDIDO";
}

export const ESTADO_NUM_CONFIG = {
  DISPONIBLE: {
    label: "Disponible",
    base: "bg-base-300 border border-base-content/10 text-base-content/70 hover:border-primary hover:text-primary hover:bg-primary/10 hover:scale-105 cursor-pointer",
  },
  RESERVADO: {
    label: "Reservado",
    base: "bg-warning/10 border border-warning/50 text-warning/70 cursor-not-allowed opacity-60",
  },
  VENDIDO: {
    label: "Vendido",
    base: "bg-error/10 border border-error/30 text-error/50 line-through cursor-not-allowed opacity-40",
  },
  SELECCIONADO: {
    label: "Seleccionado",
    base: "bg-primary border border-primary text-primary-content shadow-lg shadow-primary/40 scale-105 ring-2 ring-primary/30 cursor-pointer",
  },
} as const;

export type EstadoNumero = keyof typeof ESTADO_NUM_CONFIG;
