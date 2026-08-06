import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { useDashboardVentasPorMes } from "../../hooks/useDashboard";

const moneyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

export default function MonthlySalesChart() {
  const { data, isLoading, error } = useDashboardVentasPorMes();

  const categories = data.length > 0 ? data.map((item) => item.nombreMes) : [];
  const ventas = data.length > 0 ? data.map((item) => Number(item.ventasTotales)) : [];
  const numeros = data.length > 0 ? data.map((item) => item.numerosVendidos) : [];

  const options: ApexOptions = {
    colors: ["#465fff", "#22c55e"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 220,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "40%",
        borderRadius: 6,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: {
      labels: {
        formatter: (val: number) => moneyFormatter.format(val),
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (val: number) => moneyFormatter.format(val),
      },
    },
  };

  const series = [
    {
      name: "Ventas",
      data: ventas,
    },
    {
      name: "Números vendidos",
      data: numeros,
    },
  ];

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="h-6 w-40 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
        <div className="mt-6 h-[220px] rounded-2xl bg-gray-100 dark:bg-gray-900 animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-error/20 bg-error/5 p-5 text-sm text-error">
        No se pudo cargar las ventas por mes: {error}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Ventas por mes
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Evolución mensual de ventas y números vendidos
          </p>
        </div>
      </div>

      {data.length > 0 ? (
        <div className="max-w-full overflow-x-auto custom-scrollbar mt-4">
          <div className="min-w-[650px] xl:min-w-full pl-2">
            <Chart options={options} series={series} type="bar" height={220} />
          </div>
        </div>
      ) : (
        <div className="flex h-[220px] items-center justify-center text-sm text-gray-500 dark:text-gray-400">
          No hay datos de ventas por mes.
        </div>
      )}
    </div>
  );
}
