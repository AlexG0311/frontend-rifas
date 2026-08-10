export interface ComboResponse {
  idCombo: string;
  uuidPublico: string;
  cantidadNumeros: number;
  precio: string; // viene como string desde el backend (Decimal serializado)
  etiqueta: string;
  descripcion: string | null;
  destacado: boolean;
  orden: number;
  activo: boolean;
  fechaCreacion: string; // Date serializado a JSON siempre llega como string ISO
  fechaActualizacion: string | null;
}

export interface ComboPayload {
  cantidadNumeros: number;
  precio: number; // al enviar SÍ es number, el backend lo convierte a Decimal internamente
  etiqueta: string;
  descripcion?: string;
  destacado?: boolean;
  orden?: number;
  activo?: boolean;
}