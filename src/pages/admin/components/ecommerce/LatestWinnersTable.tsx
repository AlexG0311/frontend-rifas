import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Badge from "../ui/badge/Badge";
import { useUltimosGanadores } from "../../hooks/useDashboard";

const ESTADO_ENTREGA_CONFIG: Record<string, { label: string; color: "warning" | "info" | "success" | "error" | "dark" }> = {
  PENDIENTE: { label: "Pendiente", color: "warning" },
  CONTACTADO: { label: "Contactado", color: "info" },
  ENTREGADO: { label: "Entregado", color: "success" },
  NO_RECLAMADO: { label: "No reclamado", color: "error" },
  CANCELADO: { label: "Cancelado", color: "dark" },
};

const getClienteNombre = (cliente: { nombreCompleto?: string; nombre?: string; apellido?: string | null }) =>
  cliente.nombreCompleto || [cliente.nombre, cliente.apellido].filter(Boolean).join(' ') || 'Sin cliente';

export default function LatestWinnersTable() {
  const { data, isLoading, error } = useUltimosGanadores();

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="h-6 w-44 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
        <div className="mt-6 h-72 rounded-2xl bg-gray-100 dark:bg-gray-900 animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-error/20 bg-error/5 p-5 text-sm text-error">
        No se pudieron cargar los últimos ganadores: {error}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Ultimos ganadores
        </h3>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell isHeader className="py-3 pr-4 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Cliente
              </TableCell>
              <TableCell isHeader className="py-3 pr-4 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Rifa
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Estado entrega
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {data.length === 0 ? (
              <TableRow>
                <TableCell className="py-8 text-center text-sm text-gray-500 dark:text-gray-400" isHeader={false}>
                  No hay ganadores recientes.
                </TableCell>
              </TableRow>
            ) : (
              data.map((ganador) => {
                const estado = ESTADO_ENTREGA_CONFIG[ganador.estadoEntrega.nombre] ?? ESTADO_ENTREGA_CONFIG.PENDIENTE;

                return (
                  <TableRow key={ganador.idGanador}>
                    <TableCell className="py-3 pr-4 text-gray-800 text-theme-sm dark:text-white/90">
                      {getClienteNombre(ganador.cliente)}
                    </TableCell>
                    <TableCell className="py-3 pr-4 text-gray-500 text-theme-sm dark:text-gray-400">
                      {ganador.rifa.titulo}
                    </TableCell>
                    <TableCell className="py-3 text-start">
                      <Badge size="sm" color={estado.color}>
                        {estado.label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
