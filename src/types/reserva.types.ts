export interface NumerosReservado {
  idReserva: string;
  uuidPublico: string;
  sessionToken: string;
  idCliente: string | null;
  fechaExpiracion: Date;
  fechaCreacion: Date;
  fechaConfirmacion: Date | null;
  estado: {
    idEstadoReserva: number;
    nombre: string;
  };
  numeros: string[];
}

export interface EnviarParaApartar {
  uuidRifa: string;
  numeros: number[];
}

export interface DatosCliente {
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  tipoDocumento: string;
  numeroDocumento: string;
  pais: string;
  departamento: string;
  ciudad: string;
  direccion: string;
  aceptaNotificaciones: boolean;
}

export interface CheckoutPayload {
  sessionToken: string;
  cliente: DatosCliente;
}