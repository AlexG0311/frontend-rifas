import { useCallback, useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Loader2,
  Printer,
  Share2,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import { getCompra } from "../services/crearcompra.service";
import type { CompraResponse } from "../types/compra.type";

const moneyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const ESTADO_CONFIG: Record<string, { label: string; badge: string }> = {
  APROBADA: { label: "Pago aprobado", badge: "badge-success" },
  APROBADO: { label: "Pago aprobado", badge: "badge-success" },
  COMPRADA: { label: "Pago aprobado", badge: "badge-success" },
  COMPRADO: { label: "Pago aprobado", badge: "badge-success" },
  APPROVED: { label: "Pago aprobado", badge: "badge-success" },
  VENDIDO: { label: "Pago aprobado", badge: "badge-success" },
  PENDIENTE: { label: "Pago en proceso", badge: "badge-warning" },
  PENDING: { label: "Pago en proceso", badge: "badge-warning" },
  RECHAZADA: { label: "Pago rechazado", badge: "badge-error" },
  RECHAZADO: { label: "Pago rechazado", badge: "badge-error" },
  DECLINED: { label: "Pago rechazado", badge: "badge-error" },
  CANCELADA: { label: "Pago rechazado", badge: "badge-error" },
  CANCELADO: { label: "Pago rechazado", badge: "badge-error" },
  ERROR: { label: "Pago rechazado", badge: "badge-error" },
  VOIDED: { label: "Pago rechazado", badge: "badge-error" },
};

export default function PagoResultado() {
  const [searchParams] = useSearchParams();
  const uuidCompra = searchParams.get("compra");

  // Valor derivado: no necesita estado, se calcula en cada render.
  const sinUuid = !uuidCompra;

  const [compra, setCompra] = useState<CompraResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pollingCount, setPollingCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchCompraDetails = useCallback(
    async (showRefreshIndicator = false) => {
      if (!uuidCompra) return;

      if (showRefreshIndicator) {
        setIsRefreshing(true);
      }

      try {
        const data = await getCompra(uuidCompra);
        setCompra(data);
        setError(null);
      } catch (err) {
        console.error("Error al obtener los detalles de la compra:", err);
        setError(
          err instanceof Error
            ? err.message
            : "No se pudo recuperar la información del pago. Intenta de nuevo."
        );
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    [uuidCompra]
  );

  useEffect(() => {
    if (!uuidCompra) return;
    // fetchCompraDetails es async y solo llama a setState después del `await`
    // a getCompra(); el análisis estático de esta regla no distingue esa
    // frontera asíncrona. Patrón "fetch on mount" válido según la doc de React.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCompraDetails();
  }, [uuidCompra, fetchCompraDetails]);

  useEffect(() => {
    if (!compra) return;

    const estadoNombre = compra.estado.nombre.toUpperCase();
    const esPendiente = ["PENDIENTE", "PENDING"].includes(estadoNombre);

    if (esPendiente && pollingCount < 5) {
      const timer = setTimeout(() => {
        setPollingCount((prev) => prev + 1);
        fetchCompraDetails(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [compra, pollingCount, fetchCompraDetails]);

  const handleRefreshManual = () => {
    setPollingCount(0);
    fetchCompraDetails(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const getWhatsAppMessage = () => {
    if (!compra) return "";
    const numerosList = compra.numeros.map((n) => n.numero).join(", ");
    const text = `¡Hola! Acabo de comprar mis números para la rifa *${compra.rifa.titulo}*.
🎫 *Mis números:* ${numerosList}
📝 *Código de compra:* ${compra.codigoCompra}
👤 *Nombre:* ${compra.cliente.nombre} ${compra.cliente.apellido ?? ""}
💵 *Valor:* ${moneyFormatter.format(Number(compra.valorTotal))}`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  // Caso: no llegó ningún ?compra= en la URL. Es un error de render, no de estado.
  if (sinUuid) {
    return (
      <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center p-6 text-center">
        <div className="card w-full max-w-md bg-base-100 shadow border border-base-300 p-8 flex flex-col items-center">
          <h2 className="text-lg font-bold text-error mb-2">Ocurrió un inconveniente</h2>
          <p className="text-sm text-base-content/70 mb-6">
            No se especificó ningún identificador de compra.
          </p>
          <Link to="/rifas" className="btn btn-outline btn-sm w-full gap-2">
            <ArrowLeft className="h-4 w-4" /> Volver a Rifas
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center p-6 text-center">
        <div className="card w-full max-w-md bg-base-100 shadow border border-base-300 p-8 flex flex-col items-center">
          <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
          <h2 className="text-lg font-bold mb-1">Verificando tu pago</h2>
          <p className="text-sm text-base-content/60">
            Estamos consultando el estado de tu transacción con Wompi. Por favor espera un momento.
          </p>
        </div>
      </div>
    );
  }

  if (error || !compra) {
    return (
      <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center p-6 text-center">
        <div className="card w-full max-w-md bg-base-100 shadow border border-base-300 p-8 flex flex-col items-center">
          <h2 className="text-lg font-bold text-error mb-2">Ocurrió un inconveniente</h2>
          <p className="text-sm text-base-content/70 mb-6">
            {error || "No encontramos los detalles de tu compra. Verifica el enlace e intenta de nuevo."}
          </p>
          <div className="flex flex-col gap-2 w-full">
            <button onClick={handleRefreshManual} className="btn btn-primary btn-sm gap-2 w-full">
              <RefreshCw className="h-4 w-4" /> Intentar consultar de nuevo
            </button>
            <Link to="/rifas" className="btn btn-outline btn-sm w-full gap-2">
              <ArrowLeft className="h-4 w-4" /> Volver a Rifas
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const estado = compra.estado.nombre.toUpperCase();
  const config = ESTADO_CONFIG[estado] ?? { label: compra.estado.nombre, badge: "badge-info" };
  const esPendiente = ["PENDIENTE", "PENDING"].includes(estado);
  const esRechazada = ["RECHAZADA", "RECHAZADO", "DECLINED", "CANCELADA", "CANCELADO", "ERROR", "VOIDED"].includes(estado);
  const esAprobada = !esPendiente && !esRechazada;

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">

        {/* Volver — siempre visible arriba */}
        <div className="mb-4 print:hidden">
          <Link to="/rifas" className="inline-flex items-center gap-1.5 text-sm text-base-content/60 hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" /> Volver a Rifas
          </Link>
        </div>

        {/* Documento tipo factura */}
        <div className="bg-base-100 shadow border border-base-300 rounded-lg overflow-hidden print:border-0 print:shadow-none">

          {/* Encabezado del documento */}
          <div className="px-6 sm:px-8 py-6 border-b border-base-300 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-base-content/40 font-semibold">Comprobante de compra</p>
              <h1 className="text-lg font-bold text-base-content mt-1">{compra.rifa.titulo}</h1>
              <p className="text-xs text-base-content/50 mt-1">
                Código: <span className="font-mono">{compra.codigoCompra}</span>
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className={`badge ${config.badge} badge-sm font-semibold`}>{config.label}</span>
              <p className="text-xs text-base-content/50 mt-2">
                {new Date(compra.fechaCompra).toLocaleDateString("es-CO", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              {esPendiente && pollingCount < 5 && (
                <p className="text-xs text-base-content/40 mt-1 flex items-center gap-1 sm:justify-end">
                  <Loader2 className="h-3 w-3 animate-spin" /> Verificando...
                </p>
              )}
            </div>
          </div>

          {/* Cuerpo del documento */}
          <div className="px-6 sm:px-8 py-6 space-y-6">

            {/* Datos del participante */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-base-content/40 mb-2">Participante</p>
              <div className="text-sm text-base-content/80 space-y-0.5">
                <p className="font-medium text-base-content">
                  {compra.cliente.nombre} {compra.cliente.apellido ?? ""}
                </p>
                <p>{compra.cliente.correo}</p>
                <p>{compra.cliente.telefono}</p>
                {compra.cliente.numeroDocumento && (
                  <p className="text-base-content/50">
                    {compra.cliente.tipoDocumento} {compra.cliente.numeroDocumento}
                  </p>
                )}
              </div>
            </div>

            {/* Detalle — tabla tipo factura */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-base-content/40 mb-2">Detalle</p>
              <div className="border border-base-300 rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-base-200/60">
                    <tr>
                      <th className="text-left font-semibold text-base-content/60 px-4 py-2">Número</th>
                      <th className="text-right font-semibold text-base-content/60 px-4 py-2">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-base-200">
                    {compra.numeros.map((item) => (
                      <tr key={item.idDetalleCompra}>
                        <td className="px-4 py-2 font-mono text-base-content">
                          {String(item.numero).padStart(2, "0")}
                        </td>
                        <td className="px-4 py-2 text-right text-base-content/70">
                          {moneyFormatter.format(Number(item.valorNumero))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-end">
              <div className="w-full sm:w-64">
                <div className="flex justify-between items-center py-2 border-t-2 border-base-300">
                  <span className="text-sm font-semibold text-base-content">Total</span>
                  <span className="text-xl font-bold text-base-content">
                    {moneyFormatter.format(Number(compra.valorTotal))}
                  </span>
                </div>
                <p className="text-[11px] text-base-content/40 text-right">Procesado por Wompi</p>
              </div>
            </div>

            {/* Mensajes de estado */}
            {esPendiente && (
              <div className="p-3 rounded-md bg-warning/10 border border-warning/30 text-warning text-xs leading-relaxed">
                Tu banco puede tomar hasta 24 horas para procesar la transacción. Si el estado cambia, recibirás un correo de confirmación. Usa el botón "Actualizar estado" para comprobar si ya finalizó.
              </div>
            )}

            {esRechazada && (
              <div className="p-3 rounded-md bg-error/10 border border-error/30 text-error text-xs leading-relaxed">
                Tu reserva original puede haber vencido o la pasarela de pago declinó la transacción. Vuelve a la página de la rifa para intentar de nuevo.
              </div>
            )}
          </div>

          {/* Pie de acciones */}
          <div className="bg-base-200/40 px-6 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-base-300 print:hidden">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button onClick={handlePrint} className="btn btn-outline btn-sm gap-2 flex-1 sm:flex-none">
                <Printer className="h-4 w-4" /> Imprimir
              </button>
                {esAprobada && (
                <a
                  href={getWhatsAppMessage()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm gap-2 flex-1 sm:flex-none"
                >
                  <Share2 className="h-4 w-4" /> Compartir
                </a>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {esPendiente && (
                <button
                  onClick={handleRefreshManual}
                  disabled={isRefreshing}
                  className="btn btn-primary btn-sm gap-2 w-full sm:w-auto"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                  Actualizar estado
                </button>
              )}
              {esRechazada && (
                <Link to={`/rifa/${compra.rifa.uuidPublico}`} className="btn btn-primary btn-sm w-full sm:w-auto">
                  Intentar de nuevo
                </Link>
              )}
              <Link to="/rifas" className="btn btn-ghost btn-sm w-full sm:w-auto gap-2">
                <ArrowLeft className="h-4 w-4" /> Volver a Rifas
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}