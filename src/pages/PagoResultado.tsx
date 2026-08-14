import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Printer,
  Share2,
  ArrowLeft,
  Ticket,
  Calendar,
  User,
  Mail,
  Phone,
  RefreshCw,
} from "lucide-react";
import { getCompra } from "../services/crearcompra.service";
import type { CompraResponse } from "../types/compra.type";

const moneyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export default function PagoResultado() {
  const [searchParams] = useSearchParams();
  const uuidCompra = searchParams.get("compra");

  const [compra, setCompra] = useState<CompraResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pollingCount, setPollingCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchCompraDetails = async (showRefreshIndicator = false) => {
    if (!uuidCompra) {
      setError("No se especificó ningún identificador de compra.");
      setLoading(false);
      return;
    }

    if (showRefreshIndicator) {
      setIsRefreshing(true);
    }

    try {
      const data = await getCompra(uuidCompra);
      console.log("[PagoResultado] Datos de la compra recibidos del backend:", {
        idCompra: data.idCompra,
        codigoCompra: data.codigoCompra,
        estado: data.estado,
        cliente: data.cliente,
        fechaActualizacion: data.fechaActualizacion,
        fullData: data,
      });
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
  };

  // Carga inicial
  useEffect(() => {
    fetchCompraDetails();
  }, [uuidCompra]);

  // Sondeo automático (polling) para compras en estado PENDIENTE
  useEffect(() => {
    if (!compra) return;

    const estadoNombre = compra.estado.nombre.toUpperCase();
    const esPendiente = ["PENDIENTE", "PENDING"].includes(estadoNombre);

    if (esPendiente && pollingCount < 5) {
      const timer = setTimeout(() => {
        setPollingCount((prev) => prev + 1);
        fetchCompraDetails(true);
      }, 5000); // consultar cada 5 segundos

      return () => clearTimeout(timer);
    }
  }, [compra, pollingCount]);

  const handleRefreshManual = () => {
    setPollingCount(0); // Reiniciar conteo de polling para dar otros 5 intentos si el usuario presiona actualizar
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-300 via-base-100 to-base-200 flex flex-col items-center justify-center p-6 text-center">
        <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-300 p-8 flex flex-col items-center">
          <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
          <h2 className="text-2xl font-bold mb-2">Verificando tu pago</h2>
          <p className="text-base-content/60">
            Estamos consultando el estado de tu transacción con Wompi. Por favor espera un momento...
          </p>
        </div>
      </div>
    );
  }

  if (error || !compra) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-300 via-base-100 to-base-200 flex flex-col items-center justify-center p-6 text-center">
        <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-error/20 p-8 flex flex-col items-center">
          <div className="bg-error/10 p-4 rounded-full text-error mb-4">
            <AlertCircle className="h-12 w-12" />
          </div>
          <h2 className="text-2xl font-black text-error mb-2">Ocurrió un inconveniente</h2>
          <p className="text-base-content/70 mb-6">
            {error || "No encontramos los detalles de tu compra. Verifica el enlace e intenta de nuevo."}
          </p>
          <div className="flex flex-col gap-2 w-full">
            {uuidCompra && (
              <button
                onClick={handleRefreshManual}
                className="btn btn-primary gap-2 w-full"
              >
                <RefreshCw className="h-4 w-4" /> Intentar consultar de nuevo
              </button>
            )}
            <Link to="/home" className="btn btn-ghost w-full gap-2">
              <ArrowLeft className="h-4 w-4" /> Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const estado = compra.estado.nombre.toUpperCase();
  const esAprobada = ["APROBADA", "APROBADO", "COMPRADA", "COMPRADO", "APPROVED", "VENDIDO"].includes(estado);
  const esPendiente = ["PENDIENTE", "PENDING"].includes(estado);
  const esRechazada = ["RECHAZADA", "RECHAZADO", "DECLINED", "CANCELADA", "CANCELADO", "ERROR", "VOIDED"].includes(estado);

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-300 via-base-100 to-base-200 py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        
        {/* Card Principal */}
        <div className="card w-full bg-base-100 shadow-2xl border border-base-300 overflow-hidden relative print:border-0 print:shadow-none">
          
          {/* Cabecera del Estado */}
          <div className="p-8 text-center flex flex-col items-center border-b border-base-200">
            {esAprobada && (
              <>
                <div className="bg-success/15 p-4 rounded-full text-success mb-4 animate-bounce">
                  <CheckCircle2 className="h-16 w-16" />
                </div>
                <h1 className="text-3xl font-black text-success tracking-tight">¡Pago Aprobado con Éxito!</h1>
                <p className="text-base-content/60 mt-1 max-w-md">
                  ¡Felicidades! Tu compra se ha procesado correctamente y tus números ya están asegurados.
                </p>
              </>
            )}

            {esPendiente && (
              <>
                <div className="bg-warning/15 p-4 rounded-full text-warning mb-4 animate-pulse">
                  <AlertCircle className="h-16 w-16" />
                </div>
                <h1 className="text-3xl font-black text-warning tracking-tight">Pago en Proceso</h1>
                <p className="text-base-content/60 mt-1 max-w-md">
                  Wompi está procesando tu pago. Esto puede tardar unos minutos según tu entidad bancaria.
                </p>
                {pollingCount < 5 && (
                  <div className="flex items-center gap-2 mt-3 text-sm text-base-content/40 bg-base-200/50 px-3 py-1 rounded-full">
                    <Loader2 className="h-3 w-3 animate-spin text-primary" />
                    <span>Verificando estado en tiempo real...</span>
                  </div>
                )}
              </>
            )}

            {esRechazada && (
              <>
                <div className="bg-error/15 p-4 rounded-full text-error mb-4">
                  <XCircle className="h-16 w-16" />
                </div>
                <h1 className="text-3xl font-black text-error tracking-tight">Pago Rechazado o Fallido</h1>
                <p className="text-base-content/60 mt-1 max-w-md">
                  Lamentablemente, la transacción no pudo ser aprobada por tu entidad financiera o Wompi.
                </p>
              </>
            )}

            {!esAprobada && !esPendiente && !esRechazada && (
              <>
                <div className="bg-info/15 p-4 rounded-full text-info mb-4">
                  <AlertCircle className="h-16 w-16" />
                </div>
                <h1 className="text-3xl font-black text-info tracking-tight">Estado: {compra.estado.nombre}</h1>
                <p className="text-base-content/60 mt-1 max-w-md">
                  El estado actual de tu compra es {compra.estado.nombre.toLowerCase()}.
                </p>
              </>
            )}
          </div>

          {/* Información del Recibo */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Detalle Rifa */}
            <div className="bg-base-200/50 rounded-2xl p-4 sm:p-6 border border-base-300">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Rifa en la que participas</span>
              <h2 className="text-xl sm:text-2xl font-extrabold mt-1 text-base-content">{compra.rifa.titulo}</h2>
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-base-content/70">
                <div className="flex items-center gap-1.5">
                  <Ticket className="h-4 w-4 text-primary shrink-0" />
                  <span>Código: <strong className="text-base-content">{compra.codigoCompra}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-primary shrink-0" />
                  <span>Fecha: <strong className="text-base-content">{new Date(compra.fechaCompra).toLocaleDateString("es-CO")}</strong></span>
                </div>
              </div>
            </div>

            {/* Números Comprados */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-base-content/60 mb-3">Tus Números de la Suerte</h3>
              <div className="flex flex-wrap gap-2.5">
                {compra.numeros.map((item) => (
                  <div
                    key={item.idDetalleCompra}
                    className="relative group overflow-hidden bg-primary text-primary-content font-black text-lg sm:text-xl rounded-2xl w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center shadow-lg border border-primary/20 hover:scale-105 active:scale-95 transition-transform cursor-default"
                  >
                    {/* Brillo en hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white/0 via-white/10 to-white/0 translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-500" />
                    <span>{String(item.numero).padStart(2, "0")}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Resumen Financiero y Cliente */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-base-200">
              
              {/* Información del Cliente */}
              <div className="space-y-2.5">
                <h4 className="text-sm font-bold uppercase tracking-wider text-base-content/60">Datos del Participante</h4>
                <div className="space-y-1.5 text-sm text-base-content/85">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-base-content/40 shrink-0" />
                    <span className="font-semibold">{compra.cliente.nombre} {compra.cliente.apellido ?? ""}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-base-content/40 shrink-0" />
                    <span className="break-all">{compra.cliente.correo}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-base-content/40 shrink-0" />
                    <span>{compra.cliente.telefono}</span>
                  </div>
                  {compra.cliente.numeroDocumento && (
                    <div className="text-xs text-base-content/50 ml-6">
                      Documento: {compra.cliente.tipoDocumento} {compra.cliente.numeroDocumento}
                    </div>
                  )}
                </div>
              </div>

              {/* Total y Resumen Pago */}
              <div className="bg-base-200/40 rounded-2xl p-4 flex flex-col justify-between border border-base-200">
                <div>
                  <span className="text-xs text-base-content/50">Valor total pagado</span>
                  <div className="text-3xl font-black text-primary mt-1">
                    {moneyFormatter.format(Number(compra.valorTotal))}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-base-200 text-xs text-base-content/40 flex items-center gap-1.5 justify-between">
                  <span>Transacción Segura por Wompi</span>
                  {isRefreshing && <span className="text-primary font-medium flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Actualizando...</span>}
                </div>
              </div>

            </div>

            {/* Mensaje Informativo para Pendientes o Rechazados */}
            {esPendiente && (
              <div className="p-4 rounded-xl bg-warning/10 border border-warning/30 text-warning text-xs leading-relaxed flex gap-2">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <span>
                  Tu banco puede tomar hasta 24 horas para procesar la transacción. Si el estado cambia, recibirás un correo electrónico de confirmación. Puedes hacer clic en el botón <strong>"Actualizar estado"</strong> abajo para comprobar si ya finalizó.
                </span>
              </div>
            )}

            {esRechazada && (
              <div className="p-4 rounded-xl bg-error/10 border border-error/30 text-error text-xs leading-relaxed flex gap-2">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <span>
                  Tu reserva original puede haber vencido o la pasarela de pago declinó la tarjeta/cuenta. Por favor, regresa a la página de la rifa y selecciona tus números de nuevo para intentar otro medio de pago.
                </span>
              </div>
            )}

          </div>

          {/* Acciones del Pie de Card */}
          <div className="bg-base-200/50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-base-200 print:hidden">
            
            {/* Acciones principales del recibo */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handlePrint}
                className="btn btn-outline btn-sm gap-2 flex-1 sm:flex-none"
                disabled={!compra}
              >
                <Printer className="h-4 w-4" /> Guardar/Imprimir
              </button>
              {esAprobada && (
                <a
                  href={getWhatsAppMessage()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm gap-2 flex-1 sm:flex-none"
                >
                  <Share2 className="h-4 w-4" /> WhatsApp
                </a>
              )}
            </div>

            {/* Acciones de Navegación / Reintento */}
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
                <Link
                  to={`/rifa/${compra.rifa.uuidPublico}`}
                  className="btn btn-primary btn-sm w-full sm:w-auto"
                >
                  Intentar de nuevo
                </Link>
              )}
              {esAprobada && (
                <Link to="/rifas" className="btn btn-primary btn-sm w-full sm:w-auto">
                  Ver más rifas
                </Link>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
