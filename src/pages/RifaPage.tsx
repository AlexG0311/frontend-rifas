import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Ticket,
  Loader2,
  AlertCircle,
  ShoppingCart,
  X,
  CheckCircle2,
  Zap,
  Trophy,
  Calendar,
  Hash,
} from "lucide-react";
import { useNumerosRifa } from "../hooks/useNumerosRifa";
import { useRifas } from "../hooks/useRifas";
import type { EnviarParaApartar, NumerosReservado } from "../types/reserva.types";
import { ReservarNumero, CancelarReserva, ObtenerReservaPorToken } from "../services/reserva.service";
import CheckoutModal from "../components/CheckoutModal";

const ESTADO_NUM_CONFIG = {
  DISPONIBLE: {
    label: "Disponible",
    base: "bg-base-300 border border-base-content/10 text-base-content/70 hover:border-primary hover:text-primary hover:bg-primary/10 hover:scale-105 cursor-pointer",
  },
  RESERVADO: {
    label: "Reservado",
    base: "bg-warning/10 border border-warning/50 text-warning/70 cursor-not-allowed opacity-60",
  },
  VENDIDO: {
    label: "Vendido",
    base: "bg-error/10 border border-error/30 text-error/50 line-through cursor-not-allowed opacity-40",
  },
  SELECCIONADO: {
    label: "Seleccionado",
    base: "bg-primary border border-primary text-primary-content shadow-lg shadow-primary/40 scale-105 ring-2 ring-primary/30 cursor-pointer",
  },
} as const;

export default function RifaPage() {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();

  const { rifas, loading: loadingRifas } = useRifas();
  const { numeros, loading: loadingNumeros, error } = useNumerosRifa(uuid ?? null);

  const [seleccionados, setSeleccionados] = useState<number[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [checkoutCompletado, setCheckoutCompletado] = useState(false);
  const [exitoso, setExitoso] = useState(false);
  const [reservaActual, setReservaActual] = useState<NumerosReservado | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const rifa = rifas.find((r) => r.uuidPublico === uuid);

  const loading = loadingRifas || loadingNumeros;

  const disponibles = numeros.filter((n) => n.estado === "DISPONIBLE").length;
  const vendidos = numeros.filter((n) => n.estado === "VENDIDO").length;
  const reservados = numeros.filter((n) => n.estado === "RESERVADO").length;
  const rifaTotal = rifa ? rifa.numeroFinal - rifa.numeroInicial + 1 : 0;
  const total = numeros.length || rifaTotal || 0;
  const porcentajeVendido = total > 0 ? Math.round(((vendidos + reservados) / total) * 100) : 0;

  function toggleNumero(numero: number) {
    setSeleccionados((prev) =>
      prev.includes(numero) ? prev.filter((n) => n !== numero) : [...prev, numero]
    );
  }

  function quitarNumero(numero: number) {
    setSeleccionados((prev) => prev.filter((n) => n !== numero));
  }

  const canceladaRef = useRef(false);
  async function handleContinuarPago({ uuidRifa, numeros }: EnviarParaApartar) {
    setEnviando(true);
    canceladaRef.current = false;
    try {
      const res = await ReservarNumero(uuidRifa, numeros);
      setReservaActual(res);  
      localStorage.setItem("reservaActual", JSON.stringify(res));
      setCheckoutCompletado(false);  
      setIsCheckoutOpen(true);
      console.log(res)
    } catch (error) {
      console.error(error);
      alert("Error al apartar los números.");
    } finally {
      setEnviando(false);
    }
  }

const handleCloseCheckout = async () => {
  if (!reservaActual || checkoutCompletado || canceladaRef.current) {
    setIsCheckoutOpen(false);
    return;
  }
  canceladaRef.current = true;
  try {
    await CancelarReserva(reservaActual.uuidPublico, reservaActual.sessionToken);
  } catch (error) {
    console.error(error);
  } finally {
     setSeleccionados([]);
    setReservaActual(null);
    localStorage.removeItem("reservaActual");
    setIsCheckoutOpen(false);
}
}



useEffect(() => {
  if (reservaActual || checkoutCompletado) return;
 
  const localStorageReserva = localStorage.getItem("reservaActual");
  if (!localStorageReserva) return;
 
  (async () => {
    let reserva: NumerosReservado;
    try {
      reserva = JSON.parse(localStorageReserva);
    } catch {
      localStorage.removeItem("reservaActual");
      return;
    }
 
    // Verifica contra el backend que la reserva sigue viva ANTES de
    // mostrar nada — evita reabrir el modal para una reserva que ya
    // expiró hace rato.
    try {
      const actual = await ObtenerReservaPorToken(reserva.sessionToken); // GET /reservas/session/:sessionToken
 
      if (!actual || actual.estado?.nombre !== "ACTIVA") {  // si la reserva esta cancelada , aceptada, expirada, etc borrar 
                                                            // del localStorage y no abrir el modal
        localStorage.removeItem("reservaActual");
        return;
      }
 
      setReservaActual(actual);
      setSeleccionados(actual.numeros.map((n: string) => parseInt(n, 10)));
      setIsCheckoutOpen(true);
    } catch {
      // Si el endpoint falla o la reserva ya no existe, simplemente se
      // descarta en silencio — no interrumpimos al usuario con un
      // alert por algo que ya no es válido.
      localStorage.removeItem("reservaActual");
    }
  })();
}, [reservaActual, checkoutCompletado]);



  const totalPrecio = seleccionados.length * (rifa?.precioNumero ?? 0);

  // ─── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            <Loader2 size={52} className="text-primary animate-spin" />
            <div className="absolute inset-0 blur-xl bg-primary/30 rounded-full" />
          </div>
          <p className="text-base-content/50">Cargando rifa...</p>
        </div>
      </div>
    );
  }

  // ─── Error / Not found ────────────────────────────────────────────────────────
  if (!rifa || error) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center flex flex-col items-center gap-5 p-8">
          <AlertCircle size={52} className="text-error" />
          <p className="text-xl font-bold">{error ?? "Rifa no encontrada"}</p>
          <button onClick={() => navigate("/home")} className="btn btn-primary gap-2">
            <ArrowLeft size={16} /> Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  // ─── Éxito ────────────────────────────────────────────────────────────────────
  if (exitoso) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center flex flex-col items-center gap-6 p-8 max-w-sm">
          <div className="w-20 h-20 rounded-full bg-success/20 border-2 border-success flex items-center justify-center">
            <CheckCircle2 size={40} className="text-success" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-base-content mb-2">¡Números apartados!</h2>
            <p className="text-base-content/50 text-sm">
              Tus números fueron reservados exitosamente. Completa tu pago para confirmar la participación.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {seleccionados.map((n) => (
              <span key={n} className="badge badge-success badge-lg font-bold">
                {String(n).padStart(2, "0")}
              </span>
            ))}
          </div>
          <button onClick={() => navigate("/home")} className="btn btn-primary w-full gap-2">
            <ArrowLeft size={16} /> Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  // ─── Vista principal ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-base-100">

      {/* ── Header Hero ─────────────────────────────────────────────────────────── */}
      <header className="bg-primary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-8">
          {/* Back button */}
          <button
            onClick={() => navigate("/home")}
            className="inline-flex items-center gap-2 text-primary-content/70 hover:text-primary-content transition-colors text-sm font-medium mb-6 group"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Volver a rifas
          </button>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Ticket size={18} className="text-primary-content/60" />
                <span className="text-primary-content/60 text-xs uppercase tracking-widest font-semibold">
                  {rifa.loteria?.nombre ?? "Rifa"}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-primary-content leading-tight mb-3">
                {rifa.titulo}
              </h1>
              {rifa.descripcion && (
                <p className="text-primary-content/65 text-sm max-w-xl leading-relaxed">{rifa.descripcion}</p>
              )}
            </div>

            {/* Info pills */}
            <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
              <div className="bg-primary-content/10 border border-primary-content/20 rounded-xl px-3 py-2 text-center">
                <p className="text-primary-content/50 text-xs uppercase tracking-widest">Precio / número</p>
                <p className="text-2xl font-extrabold text-primary-content">
                  ${rifa.precioNumero?.toLocaleString()}
                </p>
              </div>
              {rifa.fechaSorteo && (
                <div className="bg-primary-content/10 border border-primary-content/20 rounded-xl px-3 py-2 flex items-center gap-2">
                  <Calendar size={14} className="text-primary-content/50" />
                  <span className="text-primary-content/80 text-sm font-medium">
                    {new Date(rifa.fechaSorteo).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Barra de progreso ────────────────────────────────────────────────────── */}
      <div className="bg-base-200 border-b border-base-300 px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mb-3">
            <StatItem icon={<Hash size={14} />} label="Disponibles" value={disponibles} color="text-success" />
            <StatItem icon={<Zap size={14} />} label="Reservados" value={reservados} color="text-warning" />
            <StatItem icon={<Trophy size={14} />} label="Vendidos" value={vendidos} color="text-error" />
            <div className="ml-auto text-right hidden sm:block">
              <span className="text-xs text-base-content/40 uppercase tracking-widest">Progreso</span>
              <p className="text-xl font-extrabold text-primary">{porcentajeVendido}%</p>
            </div>
          </div>
          <div className="h-2 w-full rounded-full bg-base-300 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{ width: `${porcentajeVendido}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Layout principal (números + carrito) ─────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-8">

        {/* ── Panel de números ─────────────────────────────────────────────────────── */}
        <section className="flex-1 min-w-0">
          {/* Leyenda */}
          <div className="flex flex-wrap gap-4 mb-5 text-xs">
            <LeyendaItem color="bg-base-300 border-base-content/10" label="Disponible" />
            <LeyendaItem color="bg-primary border-primary" label="Seleccionado" />
            <LeyendaItem color="bg-warning/10 border-warning/50" label="Reservado" />
            <LeyendaItem color="bg-error/10 border-error/30" label="Vendido" />
          </div>

          {/* Grid de números */}
          {numeros.length > 0 && (
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
              {numeros.map((num) => {
                const isSeleccionado = seleccionados.includes(num.numero) && num.estado === "DISPONIBLE";
                const cfg = isSeleccionado
                  ? ESTADO_NUM_CONFIG["SELECCIONADO"]
                  : ESTADO_NUM_CONFIG[num.estado];
                const isDisabled = num.estado !== "DISPONIBLE";

                return (
                  <button
                    key={num.numero}
                    onClick={() => !isDisabled && toggleNumero(num.numero)}
                    disabled={isDisabled}
                    title={cfg.label}
                    className={`
                      flex items-center justify-center rounded-xl
                      text-xs font-bold h-10 w-full
                      transition-all duration-150 select-none border
                      ${cfg.base}
                    `}
                  >
                    {String(num.numero).padStart(2, "0")}
                  </button>
                );
              })}
            </div>
          )}

          {numeros.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-base-content/30">
              <Ticket size={44} />
              <p className="text-sm">No hay números registrados</p>
            </div>
          )}
        </section>

        {/* ── Panel carrito (sticky en desktop) ────────────────────────────────────── */}
        <aside className="lg:w-80 shrink-0">
          <div className="lg:sticky lg:top-6 flex flex-col gap-4">

            {/* Card carrito */}
            <div className="bg-base-200 rounded-2xl border border-base-300 overflow-hidden">
              {/* Header del carrito */}
              <div className="px-5 py-4 border-b border-base-300 flex items-center gap-2">
                <ShoppingCart size={18} className="text-primary" />
                <span className="font-bold text-base-content">Mi selección</span>
                {seleccionados.length > 0 && (
                  <span className="ml-auto bg-primary text-primary-content text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {seleccionados.length}
                  </span>
                )}
              </div>

              {/* Lista de seleccionados */}
              <div className="px-5 py-4 min-h-[120px]">
                {seleccionados.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-24 gap-2 text-base-content/30">
                    <Ticket size={28} />
                    <p className="text-xs text-center">Haz clic en los números<br />para seleccionarlos</p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
                    {seleccionados.map((numero) => (
                      <div
                        key={numero}
                        className="group flex items-center gap-1 bg-primary/15 border border-primary/30 rounded-lg px-2 py-1 transition-all hover:bg-error/15 hover:border-error/30"
                      >
                        <span className="text-sm font-bold text-primary group-hover:text-error transition-colors">
                          {String(numero).padStart(2, "0")}
                        </span>
                        <button
                          onClick={() => quitarNumero(numero)}
                          className="text-primary/50 group-hover:text-error transition-colors ml-0.5"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Total y botón */}
              <div className="px-5 py-4 border-t border-base-300 bg-base-300/40">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-base-content/60">Total a pagar</span>
                  <span className="text-2xl font-extrabold text-primary">
                    ${totalPrecio.toLocaleString()}
                  </span>
                </div>
                <button
                  disabled={seleccionados.length === 0 || enviando}
                  onClick={() =>
                    handleContinuarPago({
                      uuidRifa: rifa.uuidPublico,
                      numeros: seleccionados,
                    })}
                  className="btn btn-primary w-full gap-2 disabled:opacity-40"
                >
                  {enviando ? (
                    <><Loader2 size={16} className="animate-spin" /> Procesando...</>
                  ) : (
                    <><ShoppingCart size={16} /> Continuar al pago</>
                  )}
                </button>

                {seleccionados.length > 0 && (
                  <button
                    onClick={() => setSeleccionados([])}
                    className="btn btn-ghost btn-sm w-full mt-2 text-base-content/40 hover:text-error"
                  >
                    Limpiar selección
                  </button>
                )}
              </div>
            </div>

            {/* Info card */}
            <div className="bg-info/10 border border-info/20 rounded-2xl px-5 py-4 flex gap-3">
              <Zap size={18} className="text-info shrink-0 mt-0.5" />
              <p className="text-xs text-base-content/60 leading-relaxed">
                Los números seleccionados se reservan por tiempo limitado. Completa tu pago para asegurarlos.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* ── Barra flotante en móvil (si hay seleccionados) ──────────────────────── */}
      {seleccionados.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-base-100/95 backdrop-blur-lg border-t border-base-300 px-4 py-3 shadow-2xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-base-content/50">{seleccionados.length} número(s)</p>
              <p className="text-lg font-extrabold text-primary">${totalPrecio.toLocaleString()}</p>
            </div>
            <button
              disabled={enviando}
              onClick={() =>
                handleContinuarPago({
                  uuidRifa: rifa.uuidPublico,
                  numeros: seleccionados,
                })
              }
              className="btn btn-primary gap-2"
            >
              {enviando ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <ShoppingCart size={16} />
              )}
              Continuar al pago
            </button>
          </div>
        </div>
      )}

      {/* ── Modal Checkout ─────────────────────────────────────────────────── */}
      
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => {
          handleCloseCheckout()
        }}
        reserva={reservaActual}
        totalPrecio={totalPrecio}
        tituloRifa={rifa?.titulo ?? "Rifa"}
        onSuccess={() => {
          setIsCheckoutOpen(false);
          setExitoso(true);
          setReservaActual(null);
          localStorage.removeItem("reservaActual");
          setCheckoutCompletado(true)
        }}

      />
    </div>
  );
}

function StatItem({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className={`${color} opacity-60`}>{icon}</span>
      <span className={`text-lg font-extrabold ${color}`}>{value}</span>
      <span className="text-base-content/40 text-xs">{label}</span>
    </div>
  );
}

function LeyendaItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-4 h-4 rounded border ${color}`} />
      <span className="text-base-content/50">{label}</span>
    </div>
  );
}
