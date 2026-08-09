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
    badge: "badge-success",
    glow: "shadow-green-500/20",
    border: "border-green-500/30",
  },
  CERRADA: {
    label: "Cerrada",
    badge: "badge-warning",
    glow: "shadow-yellow-500/20",
    border: "border-yellow-500/30",
  },
  FINALIZADA: {
    label: "Finalizada",
    badge: "badge-error",
    glow: "shadow-red-500/20",
    border: "border-red-500/30",
  },
  SORTEADA: {
    label: "Sorteada",
    badge: "badge-success",
    glow: "shadow-green-500/20",
    border: "border-green-500/30",
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
        group relative cursor-pointer rounded-2xl border bg-base-200
        overflow-hidden transition-all duration-300
        hover:-translate-y-2 hover:shadow-2xl
        ${config.glow} ${config.border}
        shadow-lg
      `}
    >
      {/* Imagen / Banner */}
      <div className="relative h-44 overflow-hidden bg-primary/10">
        {rifa.imagenPrincipal ? (
          <img
            src={rifa.imagenPrincipal}
            alt={rifa.titulo}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Ticket
              size={64}
              className="text-primary/40 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12"
            />
          </div>
        )}

        {/* Badge estado */}
        <div className="absolute top-3 right-3">
          <span className={`badge ${config.badge} badge-sm font-semibold uppercase tracking-wide`}>
            {config.label}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5 flex flex-col gap-3">
        <h3 className="text-lg font-bold text-base-content leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {rifa.titulo}
        </h3>

        {rifa.descripcion && (
          <p className="text-sm text-base-content/60 line-clamp-2">{rifa.descripcion}</p>
        )}

        {/* Lotería */}
        {rifa.loteria?.nombre && (
          <div className="flex items-center gap-2 text-sm text-warning">
            <Trophy size={14} />
            <span className="font-medium truncate">{rifa.loteria.nombre}</span>
          </div>
        )}

        {/* Fecha sorteo */}
        {rifa.fechaSorteo && (
          <div className="flex items-center gap-2 text-sm text-base-content/50">
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
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-base-content/60">
              <span className="flex items-center gap-1">
                <TrendingUp size={12} />
                {vendidos} / {total} números
              </span>
              <span className="font-semibold text-primary">{porcentaje}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-base-300 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700"
                style={{ width: `${porcentaje}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer: precio + botón */}
        <div className="flex items-center justify-between mt-1 pt-3 border-t border-base-300">
          <div>
            <p className="text-xs text-base-content/40 uppercase tracking-widest">Precio</p>
            <p className="text-xl font-extrabold text-primary">
              ${rifa.precioNumero ?? "—"}
            </p>
          </div>

          {esSorteada ? (
            <button className="btn btn-success btn-sm rounded-xl gap-2 group-hover:btn-active transition-all">
              <Trophy size={14} />
              Ver ganador
            </button>
          ) : esFinalizada ? (
            <button
              disabled
              className="btn btn-disabled btn-sm rounded-xl gap-2 cursor-not-allowed"
            >
              <Clock size={14} />
              Esperando sorteo
            </button>
          ) : (
            <button className="btn btn-primary btn-sm rounded-xl gap-2 group-hover:btn-active transition-all">
              <Ticket size={14} />
              Ver números
            </button>
          )}
        </div>
      </div>
    </div>
  );
}