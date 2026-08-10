import { ShoppingCart, Ticket, X, Zap, Loader2 } from "lucide-react";

interface RifaCartProps {
  seleccionados: number[];
  cifras: number;
  esGrillaChica: boolean;
  quitarNumero: (numero: number) => void;
  totalPrecio: number;
  enviando: boolean;
  rifaUuid: string;
  handleContinuarPago: (args: { uuidRifa: string; numeros: number[] }) => void;
  limpiarSeleccion: () => void;
}

export default function RifaCart({
  seleccionados,
  cifras,
  esGrillaChica,
  quitarNumero,
  totalPrecio,
  enviando,
  rifaUuid,
  handleContinuarPago,
  limpiarSeleccion,
}: RifaCartProps) {
  return (
    <aside className="lg:w-80 shrink-0">
      <div className="lg:sticky lg:top-6 flex flex-col gap-4">
        {/* Card carrito */}
        <div className="bg-base-200 rounded-2xl border border-base-300 overflow-hidden">
          <div className="px-5 py-4 border-b border-base-300 flex items-center gap-2">
            <ShoppingCart size={18} className="text-primary" />
            <span className="font-bold text-base-content">Mi selección</span>
            {seleccionados.length > 0 && (
              <span className="ml-auto bg-primary text-primary-content text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {seleccionados.length}
              </span>
            )}
          </div>

          <div className="px-5 py-4 min-h-[120px]">
            {seleccionados.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-24 gap-2 text-base-content/30">
                <Ticket size={28} />
                <p className="text-xs text-center">
                  {esGrillaChica ? (
                    <>
                      Haz clic en los números
                      <br />
                      para seleccionarlos
                    </>
                  ) : (
                    <>
                      Elige un combo
                      <br />
                      para comenzar
                    </>
                  )}
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
                {seleccionados.map((numero) => (
                  <div
                    key={numero}
                    className="group flex items-center gap-1 bg-primary/15 border border-primary/30 rounded-lg px-2 py-1 transition-all hover:bg-error/15 hover:border-error/30"
                  >
                    <span className="text-sm font-bold text-primary group-hover:text-error transition-colors">
                      {String(numero).padStart(cifras, "0")}
                    </span>
                    {esGrillaChica && (
                      <button
                        onClick={() => quitarNumero(numero)}
                        className="text-primary/50 group-hover:text-error transition-colors ml-0.5"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

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
                  uuidRifa: rifaUuid,
                  numeros: seleccionados,
                })
              }
              className="btn btn-primary w-full gap-2 disabled:opacity-40"
            >
              {enviando ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Procesando...
                </>
              ) : (
                <>
                  <ShoppingCart size={16} /> Continuar al pago
                </>
              )}
            </button>

            {seleccionados.length > 0 && (
              <button
                onClick={limpiarSeleccion}
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
            {esGrillaChica
              ? "Los números seleccionados se reservan por tiempo limitado. Completa tu pago para asegurarlos."
              : "Los números de tu combo se reservan por tiempo limitado. Completa tu pago para asegurarlos."}
          </p>
        </div>
      </div>
    </aside>
  );
}
