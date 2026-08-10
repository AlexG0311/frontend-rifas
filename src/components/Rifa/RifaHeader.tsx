import { ArrowLeft, Ticket, Calendar } from "lucide-react";
import type { Rifa } from "../../types/rifa.types";

interface RifaHeaderProps {
  rifa: Rifa;
  onBack: () => void;
}

export default function RifaHeader({ rifa, onBack }: RifaHeaderProps) {
  return (
    <header className="bg-primary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-8">
        <button
          onClick={onBack}
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
  );
}
