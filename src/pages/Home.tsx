import { useRifas } from "../hooks/useRifas";
import RifaCard from "../components/RifaCard";
import { Ticket, Loader2, AlertCircle, RefreshCw, Sparkles } from "lucide-react";

export default function Home() {
  const { rifas, loading, error } = useRifas();

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Header */}
      <header className="bg-primary py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary-content/10 border border-primary-content/20 rounded-full px-4 py-1.5 text-sm text-primary-content/80 font-medium mb-6">
            <Sparkles size={14} className="text-primary-content/60" />
            Rifas exclusivas disponibles
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-primary-content mb-5 leading-tight tracking-tight">
            Monterroza
            <span className="block text-primary-content/80">
              Rifas
            </span>
          </h1>
          <p className="text-primary-content/70 text-lg max-w-xl mx-auto leading-relaxed">
            Elige tu rifa favorita, selecciona tus números de la suerte y participa por increíbles premios.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-5">
            <div className="relative">
              <Loader2 size={56} className="text-primary animate-spin" />
              <div className="absolute inset-0 blur-xl bg-primary/30 rounded-full" />
            </div>
            <p className="text-base-content/50 text-lg">Cargando rifas disponibles...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-32 gap-5 text-center">
            <div className="bg-error/10 border border-error/30 rounded-3xl p-8 flex flex-col items-center gap-4 max-w-md">
              <AlertCircle size={48} className="text-error" />
              <div>
                <p className="text-xl font-bold text-base-content mb-1">Error al cargar las rifas</p>
                <p className="text-base-content/50 text-sm">{error}</p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="btn btn-error btn-outline btn-sm gap-2 mt-2"
              >
                <RefreshCw size={14} />
                Reintentar
              </button>
            </div>
          </div>
        )}

        {/* Sin rifas */}
        {!loading && !error && rifas.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
            <div className="bg-base-200 border border-base-300 rounded-3xl p-10 flex flex-col items-center gap-4 max-w-sm">
              <Ticket size={52} className="text-base-content/20" />
              <div>
                <p className="text-xl font-bold text-base-content/50 mb-1">No hay rifas activas</p>
                <p className="text-base-content/30 text-sm">Vuelve pronto para ver las próximas rifas</p>
              </div>
            </div>
          </div>
        )}

        {/* Grid de rifas */}
        {!loading && !error && rifas.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-extrabold text-base-content">
                  Rifas activas
                </h2>
                <p className="text-base-content/50 text-sm mt-1">
                  {rifas.length} rifa{rifas.length !== 1 ? "s" : ""} disponible{rifas.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {rifas.map((rifa) => (
                <RifaCard
                  key={rifa.uuidPublico}
                  rifa={rifa}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}