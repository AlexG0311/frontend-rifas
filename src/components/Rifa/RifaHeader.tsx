import { ArrowLeft, Ticket, Calendar } from "lucide-react";
import type { Rifa } from "../../types/rifa.types";

interface RifaHeaderProps {
  rifa: Rifa;
  onBack: () => void;
}

export default function RifaHeader({ rifa, onBack }: RifaHeaderProps) {
  return (
    <header className="bg-[#180D2B] border-b border-[#2A1745] text-[#F5F3FF]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-[#F5F3FF]/70 hover:text-[#8B5CF6] transition-colors text-sm font-medium mb-6 group"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1 text-[#8B5CF6]" />
          Volver a rifas
        </button>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Ticket size={18} className="text-[#F5C542]" />
              <span className="text-[#F5C542] text-xs uppercase tracking-widest font-extrabold">
                {rifa.loteria?.nombre ?? "Rifa"}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F5F3FF] leading-tight mb-3">
              {rifa.titulo}
            </h1>
            {rifa.descripcion && (
              <p className="text-[#F5F3FF]/70 text-sm max-w-xl leading-relaxed">{rifa.descripcion}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-3 sm:flex-col sm:items-end">
            <div className="bg-[#0F071A] border border-[#2A1745] rounded-2xl px-5 py-2.5 text-center shadow-lg">
              <p className="text-[#F5F3FF]/50 text-[10px] uppercase tracking-widest font-semibold">Precio / número</p>
              <p className="text-2xl sm:text-3xl font-black text-[#F5C542]">
                ${rifa.precioNumero?.toLocaleString()}
              </p>
            </div>
            {rifa.fechaSorteo && (
              <div className="bg-[#0F071A] border border-[#2A1745] rounded-2xl px-4 py-2 flex items-center gap-2">
                <Calendar size={14} className="text-[#8B5CF6]" />
                <span className="text-[#F5F3FF]/80 text-xs font-semibold">
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

