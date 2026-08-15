import { useParams, useNavigate } from "react-router-dom";
import { useNumerosRifa } from "../hooks/useNumerosRifa";
import { useRifas } from "../hooks/useRifas";
import { useCombos } from "../hooks/useCombos";
import CheckoutModal from "../components/CheckoutModal";
import { useResultadoRifa } from "./admin/pages/Resultados/hooks/useResultados";
import { useRifaCheckout } from "../hooks/useRifaCheckout";

import RifaHeader from "../components/Rifa/RifaHeader";
import RifaProgress from "../components/Rifa/RifaProgress";
import RifaGrid from "../components/Rifa/RifaGrid";
import RifaCombos from "../components/Rifa/RifaCombos";
import RifaCart from "../components/Rifa/RifaCart";
import {
  LoadingView,
  ErrorView,
  FinalizadaView,
  SorteadaView,
  ExitosoView,
} from "../components/Rifa/RifaStatusViews";
import { ShoppingCart, Loader2 } from "lucide-react";

export default function RifaPage() {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();

  const { rifas, loading: loadingRifas } = useRifas();
  const { numeros, loading: loadingNumeros, error } = useNumerosRifa(uuid ?? null);
  const { resultado, isLoading: isLoadingResultado } = useResultadoRifa(uuid ?? null);
  const { combos, isLoading: combosLoading } = useCombos(uuid ?? null);

  const rifa = rifas.find((r) => r.uuidPublico === uuid);

  const {
    seleccionados,
    enviando,
    exitoso,
    reservaActual,
    isCheckoutOpen,
    comboSinStock,
    totalPrecio,
    toggleNumero,
    quitarNumero,
    datosPago,
    cargandoPago,
    seleccionarCombo,
    comboSeleccionadoUuid,
    limpiarSeleccion,
    handleContinuarPago,
    handleCloseCheckout,
    handleCheckoutExitoso, // NUEVO
  } = useRifaCheckout({ rifa, numeros });

  const loading = loadingRifas || loadingNumeros;

  const disponibles = numeros.filter((n) => n.estado === "DISPONIBLE").length;
  const vendidos = numeros.filter((n) => n.estado === "VENDIDO").length;
  const reservados = numeros.filter((n) => n.estado === "RESERVADO").length;
  const rifaTotal = rifa ? rifa.numeroFinal - rifa.numeroInicial + 1 : 0;
  const total = numeros.length || rifaTotal || 0;
  const porcentajeVendido = total > 0 ? Math.round(((vendidos + reservados) / total) * 100) : 0;

  const esGrillaChica = total <= 100;
  const cifras = String(Math.max(total - 1, 0)).length;

  if (loading) return <LoadingView />;
  if (!rifa || error) return <ErrorView error={error} onBack={() => navigate("/rifas")} />;
  if (rifa.estado?.nombre === "FINALIZADA") return <FinalizadaView rifa={rifa} onBack={() => navigate("/rifas")} />;
  if (rifa.estado?.nombre === "SORTEADA") return <SorteadaView rifa={rifa} resultado={resultado} isLoading={isLoadingResultado} onBack={() => navigate("/rifas")} />;

if (exitoso) {
  if (cargandoPago || !datosPago) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-primary" />
      </div>
    );
  }
  return (
    <ExitosoView
      seleccionados={seleccionados}
      cifras={cifras}
      datosPago={datosPago}
    />
  );
}

  return (
    <div className="min-h-screen bg-base-100">
      <RifaHeader rifa={rifa} onBack={() => navigate("/rifas")} />

      <RifaProgress
        disponibles={disponibles}
        reservados={reservados}
        vendidos={vendidos}
        porcentajeVendido={porcentajeVendido}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-8">
        <section className="flex-1 min-w-0">
          {esGrillaChica ? (
            <RifaGrid
              numeros={numeros}
              seleccionados={seleccionados}
              cifras={cifras}
              toggleNumero={toggleNumero}
            />
          ) : (
            <RifaCombos
              rifa={rifa}
              total={total}
              combosLoading={combosLoading}
              combos={combos}
              disponibles={disponibles}
              comboSinStock={comboSinStock}
              seleccionados={seleccionados}
              comboSeleccionadoUuid={comboSeleccionadoUuid}
              cifras={cifras}
              seleccionarCombo={seleccionarCombo}
              limpiarSeleccion={limpiarSeleccion}
            />
          )}
        </section>

        <RifaCart
          seleccionados={seleccionados}
          cifras={cifras}
          esGrillaChica={esGrillaChica}
          quitarNumero={quitarNumero}
          totalPrecio={totalPrecio}
          enviando={enviando}
          rifaUuid={rifa.uuidPublico}
          handleContinuarPago={handleContinuarPago}
          limpiarSeleccion={limpiarSeleccion}
        />
      </div>

      {seleccionados.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-base-100/95 backdrop-blur-lg border-t border-base-300 px-4 py-3 shadow-2xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-base-content/50">{seleccionados.length} número(s)</p>
              <p className="text-lg font-extrabold text-primary">${totalPrecio.toLocaleString()}</p>
            </div>
            <button
              disabled={enviando}
              onClick={() =>
                handleContinuarPago({
                  uuidRifa: rifa.uuidPublico,
                  numeros: seleccionados,
                })
              }
              className="btn btn-primary gap-2"
            >
              {enviando ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <ShoppingCart size={16} />
              )}
              Continuar al pago
            </button>
          </div>
        </div>
      )}

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={handleCloseCheckout}
        reserva={reservaActual}
        totalPrecio={totalPrecio}
        tituloRifa={rifa?.titulo ?? "Rifa"}
        onSuccess={handleCheckoutExitoso}
      />
    </div>
  );
}