import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Badge from "../ui/badge/Badge";
import { useUltimasCompras } from "../../hooks/useDashboard";
import { formatFechaCol } from "../../utils/date.utils";

const moneyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

const getClienteNombre = (cliente: { nombreCompleto?: string; nombre?: string; apellido?: string | null }) =>
  cliente.nombreCompleto || [cliente.nombre, cliente.apellido].filter(Boolean).join(' ') || 'Sin cliente';

export default function RecentOrders() {
  const { data, isLoading, error } = useUltimasCompras();

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="h-6 w-44 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
        <div className="mt-6 h-80 rounded-2xl bg-gray-100 dark:bg-gray-900 animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-error/20 bg-error/5 p-5 text-sm text-error">
        No se pudieron cargar las últimas compras: {error}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Ultimas compras
          </h3>
        </div>
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
              <TableCell isHeader className="py-3 pr-4 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Números
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Valor
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {data.length === 0 ? (
              <TableRow>
                <TableCell className="py-8 text-center text-sm text-gray-500 dark:text-gray-400" isHeader={false}>
                  No hay compras recientes.
                </TableCell>
              </TableRow>
            ) : (
              data.map((compra) => (
                <TableRow key={compra.idCompra}>
                  <TableCell className="py-3 pr-4 text-gray-800 text-theme-sm dark:text-white/90">
                    <div>
                      <p className="font-medium">{getClienteNombre(compra.cliente)}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{formatFechaCol(compra.fechaCompra)}</p>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 pr-4 text-gray-500 text-theme-sm dark:text-gray-400">
                    {compra.rifa.titulo}
                  </TableCell>
                  <TableCell className="py-3 pr-4 text-start">
                    <div className="flex flex-wrap gap-1.5">
                      {compra.numeros.map((numero) => (
                        <Badge key={numero} size="sm" color="info">
                          {numero}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {moneyFormatter.format(Number(compra.valorTotal))}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
