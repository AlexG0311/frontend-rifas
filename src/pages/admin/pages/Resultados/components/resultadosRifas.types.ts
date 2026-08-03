import type { EstadoEntrega } from '../../../types/resultado.type';

export interface SorteoFormData {
  idLoteria: number;
  fechaSorteo: string;
  numeroGanador: string;
  serie: string;
  numeroManual: string;
}

export interface EntregaFormData {
  estadoEntrega: EstadoEntrega;
  nombreRecibido: string;
  telefonoConfirmado: string;
  observacion: string;
}

export const getInitialSorteoForm = (): SorteoFormData => ({
  idLoteria: 0,
  fechaSorteo: new Date().toISOString().split('T')[0],
  numeroGanador: '',
  serie: '',
  numeroManual: '',
});

export const getInitialEntregaForm = (): EntregaFormData => ({
  estadoEntrega: 'PENDIENTE',
  nombreRecibido: '',
  telefonoConfirmado: '',
  observacion: '',
});

export const ESTADOS_ENTREGA: { value: EstadoEntrega; label: string; color: string }[] = [
  { value: 'PENDIENTE', label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  { value: 'CONTACTADO', label: 'Contactado', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  { value: 'ENTREGADO', label: 'Entregado', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  { value: 'NO_RECLAMADO', label: 'No reclamado', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
];
