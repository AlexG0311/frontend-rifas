
/**
 * Formatea una fecha para mostrar solo día/mes/año en hora de Colombia
 * Ejemplo: "09/08/2026"
 */
export const formatFechaCol = (fecha: string | Date): string => {
  if (!fecha) return '';
  return new Date(fecha).toLocaleDateString('es-CO', {
    timeZone: 'America/Bogota',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};
/**
 * Formatea fecha y hora exacta del sorteo/cierre
 * Ejemplo: "9 ago 2026, 10:30 p. m."
 */
export const formatFechaHoraCol = (fecha: string | Date): string => {
  if (!fecha) return '';
  return new Date(fecha).toLocaleString('es-CO', {
    timeZone: 'America/Bogota',
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};