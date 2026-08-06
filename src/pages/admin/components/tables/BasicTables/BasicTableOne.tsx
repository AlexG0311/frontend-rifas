import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import { useGanadoresSorteo } from "../../../hooks/useGanadores";
import { formatFechaCol } from "../../../utils/date.utils";
import type { GanadorRifa } from "../../../types/ganador.type";

const ESTADO_ENTREGA_CONFIG: Record<GanadorRifa["estadoEntrega"]["nombre"], { label: string; color: "warning" | "info" | "success" | "error" | "dark" }> = {
  PENDIENTE: {
    label: "Pendiente",
    color: "warning",
  },
  CONTACTADO: {
    label: "Contactado",
    color: "info",
  },
  ENTREGADO: {
    label: "Entregado",
    color: "success",
  },
  NO_RECLAMADO: {
    label: "No reclamado",
    color: "error",
  },
  CANCELADO: {
    label: "Cancelado",
    color: "dark",
  },
};

export default function GanadoresTable() {
  const { ganadores, isLoading, error, loadGanadores } = useGanadoresSorteo();

  // Estado de carga
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="text-center py-10 text-red-600">
        <p>Error al cargar ganadores: {error}</p>
        <button 
          onClick={loadGanadores}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  // Sin datos
  if (ganadores.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p>No hay ganadores registrados</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Ganador
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Rifa
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Número
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Contacto
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Estado
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Fecha Confirmación
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {ganadores.map((ganador) => (
              <TableRow key={ganador.idGanador}>
                {/* Columna: Ganador */}
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">
                      {ganador.cliente.nombre.charAt(0)}
                      {ganador.cliente.apellido?.charAt(0) || ''}
                    </div>
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {`${ganador.cliente.nombre} ${ganador.cliente.apellido || ''}`}
                      </span>
                      <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        ID: {ganador.cliente.uuidPublico}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* Columna: Rifa */}
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <div>
                    <span className="block font-medium text-gray-800 dark:text-white/90">
                      {ganador.rifa.titulo}
                    </span>
                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                      UUID: {ganador.rifa.uuidPublico.substring(0, 8)}...
                    </span>
                  </div>
                </TableCell>

                {/* Columna: Número */}
                <TableCell className="px-4 py-3 text-start">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium dark:bg-green-500/10 dark:text-green-400">
                    #{ganador.numero}
                  </span>
                </TableCell>

                {/* Columna: Contacto */}
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{ganador.cliente.correo}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{ganador.cliente.telefono}</span>
                    </div>
                  </div>
                </TableCell>
                
                {/* Columna: Estado */}
                <TableCell   className="px-4 py-3 text-start">
            
                   {(() => {                    
                    const estado = ESTADO_ENTREGA_CONFIG[ganador.estadoEntrega.nombre] ?? ESTADO_ENTREGA_CONFIG.PENDIENTE;
                    return (
                  <Badge
                    size="sm"
                        color={estado.color}
                  >
                        {estado.label}
                  </Badge>
                    );
                  })()}
                                 
                </TableCell>

                {/* Columna: Fecha Confirmación */}
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {ganador.fechaConfirmacion ? (
                    formatFechaCol(ganador.fechaConfirmacion)
                  ) : (
                    <span className="text-gray-400">Pendiente</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>    
    </div>
  );
}