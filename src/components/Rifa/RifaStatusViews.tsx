import { Loader2, AlertCircle, Ticket, Trophy, CheckCircle2, ArrowLeft } from "lucide-react";
import type { Rifa } from "../../types/rifa.types";
import { useRef } from "react";
import { useWidget } from "../../wompi/useWidget"; 
import type { WidgetWompiParams } from "../../services/wompi.service";

interface LoadingViewProps {}
export function LoadingView(_props: LoadingViewProps) {
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

interface ErrorViewProps {
  error: string | null;
  onBack: () => void;
}
export function ErrorView({ error, onBack }: ErrorViewProps) {
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center">
      <div className="text-center flex flex-col items-center gap-5 p-8">
        <AlertCircle size={52} className="text-error" />
        <p className="text-xl font-bold">{error ?? "Rifa no encontrada"}</p>
        <button onClick={onBack} className="btn btn-primary gap-2">
          <ArrowLeft size={16} /> Volver a Rifas
        </button>
      </div>
    </div>
  );
}

interface FinalizadaViewProps {
  rifa: Rifa;
  onBack: () => void;
}
export function FinalizadaView({ rifa, onBack }: FinalizadaViewProps) {
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center">
      <div className="text-center flex flex-col items-center gap-6 p-8 max-w-md">
        <div className="w-20 h-20 rounded-full bg-warning/20 border-2 border-warning flex items-center justify-center">
          <Ticket size={40} className="text-warning" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-base-content mb-2">Ventas finalizadas</h2>
          <p className="text-base-content/50 text-sm leading-relaxed">
            Esta rifa ya no está disponible para la compra de números.
            {rifa.fechaSorteo && (
              <>
                {" "}
                Espera los resultados el{" "}
                <span className="font-semibold text-base-content/70">
                  {new Date(rifa.fechaSorteo).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                .
              </>
            )}
          </p>
        </div>
        <button onClick={onBack} className="btn btn-primary w-full gap-2">
          <ArrowLeft size={16} /> Volver a Rifas
        </button>
      </div>
    </div>
  );
}

interface SorteadaViewProps {
  rifa: Rifa;
  resultado: any;
  isLoading: boolean;
  onBack: () => void;
}
export function SorteadaView({ rifa, resultado, isLoading, onBack }: SorteadaViewProps) {
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center">
      <div className="text-center flex flex-col items-center gap-6 p-8 max-w-md">
        <div className="w-20 h-20 rounded-full bg-success/20 border-2 border-success flex items-center justify-center">
          <Trophy size={40} className="text-success" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-base-content mb-2">¡Ya hay ganador!</h2>
          <p className="text-base-content/50 text-sm mb-4">{rifa.titulo}</p>

          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 size={28} className="text-success animate-spin" />
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <div className="inline-flex flex-col items-center gap-1 bg-success/10 border border-success/30 rounded-2xl px-8 py-5">
                <span className="text-xs uppercase tracking-widest text-success/60 font-semibold">
                  Número ganador (Rifa)
                </span>
                <span className="text-4xl font-extrabold text-success">
                  {resultado?.numeroGanador
                    ? String(resultado.numeroGanador).padStart(2, "0")
                    : "—"}
                </span>
              </div>

              <div className="inline-flex flex-col items-center gap-1 bg-info/10 border border-info/30 rounded-2xl px-8 py-5">
                <span className="text-xs uppercase tracking-widest text-info/60 font-semibold">
                  Resultado lotería
                </span>
                <span className="text-4xl font-extrabold text-info">
                  {resultado?.loteria?.numeroGanador
                    ? String(resultado.loteria.numeroGanador).padStart(2, "0")
                    : "—"}
                </span>
                {resultado?.loteria?.serie && (
                  <span className="text-xs text-info/50 font-medium mt-0.5">
                    Serie: {resultado.loteria.serie}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
        <p className="text-base-content/40 text-xs leading-relaxed">
          Si eres el ganador, estaremos contactándote para la entrega del premio.
        </p>
        <button onClick={onBack} className="btn btn-primary w-full gap-2">
          <ArrowLeft size={16} /> Volver a Rifas
        </button>
      </div>
    </div>
  );
}

interface ExitosoViewProps {
  seleccionados: number[];
  cifras: number;
  datosPago: WidgetWompiParams;
}

export function ExitosoView({ seleccionados, cifras, datosPago }: ExitosoViewProps) {
  const wompiContainerRef = useRef<HTMLDivElement>(null);
  useWidget({ wompiContainerRef, datosPago });

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
              {String(n).padStart(cifras, "0")}
            </span>
          ))}
        </div>
        <div ref={wompiContainerRef} />
      </div>
    </div>
  );
}
