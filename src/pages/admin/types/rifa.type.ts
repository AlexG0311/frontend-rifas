// types/rifa.type.ts

export interface RifaProducto {
  idProducto: number;
  cantidad: number;
}

export interface RifaCreatePayload {
  idLoteria: number;
  titulo: string;
  descripcion?: string | null;
  precioNumero: number;
  numeroInicial: number;
  imagenPrincipal?: string,
  numeroFinal: number;
  fechaInicio: string | Date;
  fechaCierre: string | Date;
  fechaSorteo: string | Date;
  productos: RifaProducto[];
}

export interface RifaUpdatePayload {
  idLoteria?: number;
  titulo?: string;
  descripcion?: string | null;
  precioNumero?: number;
  imagenPrincipal?: string,
  fechaInicio?: string | Date;
  fechaCierre?: string | Date;
  fechaSorteo?: string | Date;
  productos?: RifaProducto[];
}

export interface RifaEstadoPayload {
  idEstadoRifa: number;
  observacion?: string;
}

export interface RifaProductoResponse {
  idProducto: number;
  cantidad: number;
  producto: {
    nombre: string;
    valorComercial: number;
  };
}

export interface RifaResponse {
  uuidPublico: string;
  idRifa: number;
  idLoteria: number;
  titulo: string;
  descripcion?: string | null;
  precioNumero: number;
  numeroInicial: number;
  imagenPrincipal?: string,
  numeroFinal: number;
  fechaInicio: Date;
  fechaCierre: Date;
  fechaSorteo: Date;
  estado: {
    idEstadoRifa: number;
    nombre: string;
  };
  loteria: {
    idLoteria: number;
    nombre: string;
    serie?: string | null;
  };
  resultado_rifa?:{
    serie?: string  | null;
   
  }
  resultado_loteria?:{
    serie?: string  | null;
    numeroGanador?: string  | null;
  }
  productos: RifaProductoResponse[];
  totalNumeros: number;
  numerosVendidos: number;
  numerosDisponibles: number;
  createdAt: Date;
  updatedAt: Date;
}

export type RifasListResponse = RifaResponse[];

export interface NumeroRifaResponse {
  idNumero: number;
  numero: number;
  estado: {
    idEstadoNumero: number;
    nombre: string;
  };
  usuario?: {
    idUsuario: number;
    nombre: string;
    email: string;
  } | null;
  fechaVenta?: Date | null;
}