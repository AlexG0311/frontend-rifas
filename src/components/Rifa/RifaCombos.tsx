import { Loader2, Shuffle, RefreshCw, Check } from "lucide-react";
interface Combo {
  uuidPublico: string;
  cantidadNumeros: number;
  precio: number | string;
  destacado: boolean;
  orden: number;
  etiqueta: string;
  descripcion?: string | null;
}

interface RifaCombosProps {
  total: number;
  combosLoading: boolean;
  combos: Combo[];
  disponibles: number;
  comboSinStock: number | null;
  seleccionados: number[];
  comboSeleccionadoUuid: string | null; // NUEVO
  cifras: number;
  seleccionarCombo: (cantidad: number, precio: number, uuidCombo: string) => void;
  limpiarSeleccion: () => void;
}

export default function RifaCombos({
  total,
  combosLoading,
  combos,
  disponibles,
  comboSinStock,
  seleccionados,
  comboSeleccionadoUuid,
  cifras,
  seleccionarCombo,
  limpiarSeleccion,
}: RifaCombosProps) {
  const combosParaMostrar = [...combos].sort((a, b) => a.orden - b.orden);
  // Si no hay seleccionados, ningún combo cuenta como "elegido" aunque haya un uuid residual
  const uuidActivo = seleccionados.length > 0 ? comboSeleccionadoUuid : null;

  return (
    <>
      <div className="mb-6">
        <h3 className="text-lg font-bold text-base-content mb-1">Elige tu combo</h3>
        <p className="text-sm text-base-content/50">
          Con {total} números en juego, te asignamos combinaciones al azar entre los números disponibles.
        </p>
      </div>

      {combosLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 size={28} className="animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {combosParaMostrar.map((combo) => {
            // El combo "unitario" nunca manda uuidCombo al backend (se envía como null/undefined),
            // así que se marca como seleccionado cuando no hay uuid activo pero sí hay números elegidos
            // y la cantidad coincide con 1.
            const esSeleccionado = combo.uuidPublico === uuidActivo;

            return (
              <button
                key={combo.uuidPublico}
                onClick={() => seleccionarCombo(combo.cantidadNumeros, Number(combo.precio), combo.uuidPublico)}
                disabled={disponibles < combo.cantidadNumeros}
                className={`
                  relative flex flex-col items-center gap-2 rounded-2xl border-2 p-5 transition-all
                  disabled:opacity-40 disabled:cursor-not-allowed
                  ${esSeleccionado
                    ? "border-primary bg-primary/15 shadow-lg shadow-primary/30 ring-2 ring-primary/40"
                    : combo.destacado
                      ? "border-primary/40 bg-primary/5 hover:bg-primary/10 hover:border-primary/60"
                      : "border-base-300 bg-base-200 hover:border-primary/50 hover:bg-base-300/50"}
                `}
              >
                {esSeleccionado && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-content flex items-center justify-center shadow-md">
                    <Check size={14} strokeWidth={3} />
                  </span>
                )}
                {!esSeleccionado && combo.destacado && (
                  <span className="badge badge-primary badge-sm mb-1">Más popular</span>
                )}
                <Shuffle size={26} className="text-primary" />
                <span className="text-base font-extrabold text-base-content">{combo.etiqueta}</span>
                {combo.descripcion && (
                  <span className="text-xs text-base-content/50 text-center leading-tight">
                    {combo.descripcion}
                  </span>
                )}
                <span className="text-primary font-bold mt-1">
                  ${Number(combo.precio).toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {comboSinStock !== null && (
        <div className="mt-4 rounded-xl bg-error/10 border border-error/30 px-4 py-3 text-sm text-error">
          Solo quedan {disponibles} números disponibles — no alcanza para un combo de {comboSinStock}.
        </div>
      )}

      {seleccionados.length > 0 && (
        <div className="mt-6 rounded-2xl bg-primary/5 border border-primary/20 p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-base-content/70">
              Tus {seleccionados.length} número(s) asignado(s)
            </p>
            <button
              onClick={limpiarSeleccion}
              className="btn btn-ghost btn-xs gap-1 text-base-content/40 hover:text-error"
            >
              <RefreshCw size={12} /> Cambiar
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
            {seleccionados.map((n) => (
              <span key={n} className="badge badge-primary badge-md font-mono font-bold">
                {String(n).padStart(cifras, "0")}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );
}