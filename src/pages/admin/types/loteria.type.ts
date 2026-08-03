export interface LoteriaCreatePayload {
  nombre: string;
  diaSorteo?: string | null;
  activa?: boolean;
}

export interface LoteriaUpdatePayload {
  nombre?: string;
  diaSorteo?: string | null;
  activa?: boolean;
}

export interface LoteriaResponse {
  id_loteria: number;
  nombre: string;
  serie?: string | null;
  diaSorteo?: string | null;
  activa?: boolean;
}

export type LoteriasListResponse = LoteriaResponse[];
