import { Ticket } from "lucide-react";
import { ESTADO_NUM_CONFIG } from "../../types/rifa.types";
import type { NumeroRifa } from "../../types/rifa.types";

interface RifaGridProps {
  numeros: NumeroRifa[];
  seleccionados: number[];
  cifras: number;
  toggleNumero: (numero: number) => void;
}

export default function RifaGrid({
  numeros,
  seleccionados,
  cifras,
  toggleNumero,
}: RifaGridProps) {
  return (
    <>
      <div className="flex flex-wrap gap-4 mb-5 text-xs">
        <LeyendaItem color="bg-base-300 border-base-content/10" label="Disponible" />
        <LeyendaItem color="bg-primary border-primary" label="Seleccionado" />
        <LeyendaItem color="bg-warning/10 border-warning/50" label="Reservado" />
        <LeyendaItem color="bg-error/10 border-error/30" label="Vendido" />
      </div>

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
                {String(num.numero).padStart(cifras, "0")}
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
    </>
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
