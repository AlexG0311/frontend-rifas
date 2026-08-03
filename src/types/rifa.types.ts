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

