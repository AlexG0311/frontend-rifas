import { Loader2, Shuffle, RefreshCw } from "lucide-react";
import type { ComboResponse } from "../../types/combo.type.ts";

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
  rifa: {
    precioNumero: number;
  };
  total: number;
  combosLoading: boolean;
  combos: Combo[];
  disponibles: number;
  comboSinStock: number | null;
  seleccionados: number[];
  cifras: number;
  seleccionarCombo: (cantidad: number, precio: number,uuidCombo: string) => void;
  limpiarSeleccion: () => void;
}
export default function RifaCombos({
  rifa,
  total,
  combosLoading,
  combos,
  disponibles,
  comboSinStock,
  seleccionados,
  cifras,
  seleccionarCombo,
  limpiarSeleccion,
}: RifaCombosProps) {
// Combo implícito de 1 número, usando el precio base de la rifa
const comboUnitario: ComboResponse = {
  idCombo: "unitario",
  uuidPublico: "unitario",
  cantidadNumeros: 1,
  precio: String(rifa.precioNumero),
  etiqueta: "1 número",
  descripcion: "Un número bendecido por la suerte",
  destacado: false,
  orden: -1, // siempre primero
  activo: true,
  fechaCreacion: "",
  fechaActualizacion: null,
};



  // Combina el combo unitario (siempre presente) con los combos configurados por el admin
const combosParaMostrar = [comboUnitario, ...combos].sort((a, b) => a.orden - b.orden);

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
          {combosParaMostrar.map((combo) => (
            <button
              key={combo.uuidPublico}
              onClick={() => seleccionarCombo(combo.cantidadNumeros, Number(combo.precio), combo.uuidPublico)}
              disabled={disponibles < combo.cantidadNumeros}
              className={`
                flex flex-col items-center gap-2 rounded-2xl border-2 p-5 transition-all
                disabled:opacity-40 disabled:cursor-not-allowed
                ${combo.destacado
                  ? "border-primary bg-primary/10 shadow-lg shadow-primary/20 hover:bg-primary/15"
                  : "border-base-300 bg-base-200 hover:border-primary/50 hover:bg-base-300/50"}
              `}
            >
              {combo.destacado && (
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
          ))}
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
