export type DashboardResumenView = {
  rifasActivas: number;
  rifasSorteadas: number;
  numerosVendidos: number;
  ventasTotales: number | string;
  moneda: 'COP';
};

export type Resume = DashboardResumenView;

export type DashboardVentaMensualView = {
  anio: number;
  mes: number;
  nombreMes: string;
  ventasTotales: number | string;
  numerosVendidos: number;
  compras: number;
};

export type DashboardCompraView = {
  idCompra: string;
  codigoCompra: string;
  fechaCompra: string | Date;
  valorTotal: number | string;
  cantidadNumeros: number;
  cliente: {
    nombreCompleto?: string;
    nombre?: string;
    apellido?: string | null;
    correo?: string;
    telefono?: string;
  };
  rifa: {
    idRifa: string;
    titulo: string;
  };
  numeros: string[];
};

export type DashboardAlertaView = {
  tipo: 'RIFAS_POR_SORTEAR_HOY' | string;
  titulo: string;
  mensaje: string;
  cantidad: number;
};

export type DashboardGanadorView = {
  idGanador: string;
  numero: string;
  cliente: {
    nombreCompleto?: string;
    nombre?: string;
    apellido?: string | null;
    correo?: string;
    telefono?: string;
  };
  rifa: {
    idRifa: string;
    titulo: string;
  };
  estadoEntrega: {
    idEstadoEntrega: number;
    nombre: string;
  };
};


