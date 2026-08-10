import { Hash, Zap, Trophy } from "lucide-react";

interface RifaProgressProps {
  disponibles: number;
  reservados: number;
  vendidos: number;
  porcentajeVendido: number;
}

export default function RifaProgress({
  disponibles,
  reservados,
  vendidos,
  porcentajeVendido,
}: RifaProgressProps) {
  return (
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
