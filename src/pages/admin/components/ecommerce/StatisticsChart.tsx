import { AlertCircle } from "lucide-react";
import { useDashboardPendientes } from "../../hooks/useDashboard";

export default function StatisticsChart() {
  const { data, isLoading, error } = useDashboardPendientes();
  const pendientes = Array.isArray(data) ? data : data ? [data] : [];

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 animate-pulse">
        <div className="h-6 w-36 rounded bg-gray-200 dark:bg-gray-800" />
        <div className="mt-4 h-28 rounded-2xl bg-gray-100 dark:bg-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-error/20 bg-error/5 p-5 text-sm text-error">
        No se pudieron cargar los pendientes: {error}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 py-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10 text-warning">
          <AlertCircle size={18} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Pendientes
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Alertas que requieren atención hoy
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {pendientes.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-5 text-sm text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
            No hay alertas pendientes.
          </div>
        ) : (
          pendientes.map((pendiente, index) => (
            <div key={`${pendiente.tipo}-${index}`} className="rounded-2xl border border-warning/20 bg-warning/5 px-4 py-4">
              <p className="font-semibold text-gray-800 dark:text-white/90">{pendiente.titulo}</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{pendiente.mensaje}</p>
              <p className="mt-2 text-xs font-medium uppercase tracking-wide text-warning">
                {pendiente.cantidad} pendiente{pendiente.cantidad !== 1 ? 's' : ''}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
