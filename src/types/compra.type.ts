export type CompraResponse = {
  idCompra: string;
  uuidPublico: string;
  codigoCompra: string;
  cantidadNumeros: number;
  valorTotal: string;
  fechaCompra: Date;
  fechaActualizacion: Date | null;
  estado: {
    idEstadoCompra: number;
    nombre: string;
  };
  cliente: {
    idCliente: string;
    uuidPublico: string;
    nombre: string;
    apellido: string | null;
    correo: string;
    telefono: string;
    tipoDocumento: string | null;
    numeroDocumento: string | null;
  };
  rifa: {
    idRifa: string;
    uuidPublico: string;
    titulo: string;
  };
  numeros: {
    idDetalleCompra: string;
    numero: string;
    valorNumero: string;
  }[];
};
