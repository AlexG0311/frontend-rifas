import { BoxIconLine, GroupIcon, DollarLineIcon } from "../../icons";
import { useDashboardResumen } from "../../hooks/useDashboard";

const moneyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export default function EcommerceMetrics() {
  const { data: resumen, isLoading, error } = useDashboardResumen();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 animate-pulse"
          >
            <div className="h-12 w-12 rounded-xl bg-gray-200 dark:bg-gray-800" />
            <div className="mt-5 space-y-3">
              <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-7 w-16 rounded bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-error/20 bg-error/5 p-5 text-sm text-error">
        No se pudo cargar el resumen del dashboard: {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Rifas activas</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {resumen.rifasActivas}
            </h4>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Rifas Sorteadas</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {resumen.rifasSorteadas}
            </h4>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Números vendidos</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {resumen.numerosVendidos}
            </h4>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <DollarLineIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Ventas totales</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {typeof resumen.ventasTotales === "number"
                ? moneyFormatter.format(resumen.ventasTotales)
                : resumen.ventasTotales}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}
