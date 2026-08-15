import type { Rifa } from "../types/rifa.types";
import { Calendar, Ticket, Trophy, TrendingUp, Clock} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNumerosRifa } from "../hooks/useNumerosRifa";

interface RifaCardProps {
  rifa: Rifa;
}

const ESTADO_CONFIG = {
  ACTIVA: {
    label: "Activa",
    badge: "bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#8B5CF6]",
    glow: "shadow-[#8B5CF6]/10",
    border: "border-[#2A1745] hover:border-[#8B5CF6]",
  },
  CERRADA: {
    label: "Cerrada",
    badge: "bg-[#F5C542]/20 border border-[#F5C542]/40 text-[#F5C542]",
    glow: "shadow-[#F5C542]/10",
    border: "border-[#2A1745]",
  },
  FINALIZADA: {
    label: "Finalizada",
    badge: "bg-rose-500/20 border border-rose-500/40 text-rose-300",
    glow: "shadow-rose-500/10",
    border: "border-[#2A1745]",
  },
  SORTEADA: {
    label: "Sorteada",
    badge: "bg-[#F5C542]/20 border border-[#F5C542]/40 text-[#F5C542]",
    glow: "shadow-[#F5C542]/10",
    border: "border-[#2A1745]",
  },
};

export default function RifaCard({ rifa }: RifaCardProps) {
  const navigate = useNavigate();
  const config = ESTADO_CONFIG[rifa.estado.nombre as keyof typeof ESTADO_CONFIG] ?? ESTADO_CONFIG.ACTIVA;
  const { numeros } = useNumerosRifa(rifa.uuidPublico ?? null);
  const vendidos = numeros.filter((n) => n.estado === "VENDIDO").length;
  const total = rifa.numeroFinal - rifa.numeroInicial + 1;
  const porcentaje = total > 0 ? Math.round((vendidos / total) * 100) : 0;

  const esFinalizada = rifa.estado.nombre === "FINALIZADA";
  const esSorteada = rifa.estado.nombre === "SORTEADA";

  return (
    <div
      onClick={() => navigate(`/rifa/${rifa.uuidPublico}`)}
      className={`
        group relative cursor-pointer rounded-2xl border bg-[#180D2B]
        overflow-hidden transition-all duration-300
        hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#8B5CF6]/15
        ${config.border}
        shadow-lg text-[#F5F3FF]
      `}
    >
      {/* Imagen / Banner */}
      <div className="relative h-44 overflow-hidden bg-[#0F071A]">
        {rifa.imagenPrincipal ? (
          <img
            src={rifa.imagenPrincipal}
            alt={rifa.titulo}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Ticket
              size={64}
              className="text-[#8B5CF6]/30 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
            />
          </div>
        )}

        {/* Badge estado */}
        <div className="absolute top-3 right-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${config.badge}`}>
            {config.label}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5 flex flex-col gap-3">
        <h3 className="text-lg font-extrabold text-[#F5F3FF] leading-tight line-clamp-2 group-hover:text-[#8B5CF6] transition-colors">
          {rifa.titulo}
        </h3>

        {rifa.descripcion && (
          <p className="text-xs text-[#F5F3FF]/60 line-clamp-2 leading-relaxed">{rifa.descripcion}</p>
        )}

        {/* Lotería */}
        {rifa.loteria?.nombre && (
          <div className="flex items-center gap-2 text-xs font-semibold text-[#F5C542]">
            <Trophy size={14} className="text-[#F5C542]" />
            <span className="truncate">{rifa.loteria.nombre}</span>
          </div>
        )}

        {/* Fecha sorteo */}
        {rifa.fechaSorteo && (
          <div className="flex items-center gap-2 text-xs text-[#F5F3FF]/50">
            <Calendar size={14} />
            <span>
              {new Date(rifa.fechaSorteo).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        )}

        {/* Progreso de números — solo si aún se pueden comprar */}
        {!esFinalizada && !esSorteada && (
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs text-[#F5F3FF]/60">
              <span className="flex items-center gap-1">
                <TrendingUp size={12} className="text-[#8B5CF6]" />
                {vendidos} / {total} números
              </span>
              <span className="font-extrabold text-[#F5C542]">{porcentaje}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-[#2A1745] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#8B5CF6] transition-all duration-700"
                style={{ width: `${porcentaje}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer: precio + botón */}
        <div className="flex items-center justify-between mt-2 pt-3 border-t border-[#2A1745]">
          <div>
            <p className="text-[10px] text-[#F5F3FF]/40 uppercase tracking-widest font-semibold">Precio</p>
            <p className="text-xl font-black text-[#F5C542]">
              ${rifa.precioNumero?.toLocaleString() ?? "—"}
            </p>
          </div>

          {esSorteada ? (
            <button className="bg-[#F5C542] hover:bg-[#F5C542]/90 text-[#0F071A] font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all">
              <Trophy size={14} />
              Ver ganador
            </button>
          ) : esFinalizada ? (
            <button
              disabled
              className="bg-[#2A1745] text-[#F5F3FF]/40 text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-not-allowed"
            >
              <Clock size={14} />
              Esperando sorteo
            </button>
          ) : (
            <button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-[#8B5CF6]/20">
              <Ticket size={14} />
              Ver números
            </button>
          )}
        </div>
      </div>
    </div>
  );
}