import { useState, useRef, useEffect, useCallback } from "react";
import { ReservarNumero, CancelarReserva, ObtenerReservaPorToken } from "../services/reserva.service";
import type { EnviarParaApartar, NumerosReservado } from "../types/reserva.types";
import type { CompraResponse} from "../types/compra.type";
import { getDatosPagoWompi, type WidgetWompiParams  } from "../services/wompi.service";
import type { NumeroRifa, Rifa } from "../types/rifa.types";

interface UseRifaCheckoutProps {
  rifa: Rifa | undefined;
  numeros: NumeroRifa[];
}

export function useRifaCheckout({ rifa, numeros }: UseRifaCheckoutProps) {
  const [seleccionados, setSeleccionados] = useState<number[]>([]);
  const [datosPago, setDatosPago] = useState<WidgetWompiParams  | null>(null);
  const [cargandoPago, setCargandoPago] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [checkoutCompletado, setCheckoutCompletado] = useState(false);
  const [exitoso, setExitoso] = useState(false);
  const [reservaActual, setReservaActual] = useState<NumerosReservado | null>(null);
  const [compra, setCompra] = useState<CompraResponse | null>(null); // NUEVO
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [comboSinStock, setComboSinStock] = useState<number | null>(null);
  const [precioComboSeleccionado, setPrecioComboSeleccionado] = useState<number | null>(null);
  const [comboSeleccionadoUuid, setComboSeleccionadoUuid] = useState<string | null>(null);

  const canceladaRef = useRef(false);

  // Pide los datos de pago de Wompi apenas hay una COMPRA creada (precio ya congelado)
  useEffect(() => {
    if (!exitoso || !compra) {
      setDatosPago(null);
      return;
    }

    setCargandoPago(true);
    getDatosPagoWompi(compra.uuidPublico)
      .then(setDatosPago)
      .catch((err) => {
        console.error(err);
        alert("Error al preparar el pago. Intenta de nuevo.");
      })
      .finally(() => setCargandoPago(false));
  }, [exitoso, compra]);

  const toggleNumero = useCallback((numero: number) => {
    setPrecioComboSeleccionado(null);
    setComboSeleccionadoUuid(null);
    setSeleccionados((prev) =>
      prev.includes(numero) ? prev.filter((n) => n !== numero) : [...prev, numero]
    );
  }, []);

  const quitarNumero = useCallback((numero: number) => {
    setSeleccionados((prev) => prev.filter((n) => n !== numero));
  }, []);

  const seleccionarCombo = useCallback((cantidad: number, precio: number, uuidCombo: string) => {
    const numerosDisponibles = numeros.filter((n) => n.estado === "DISPONIBLE");

    if (numerosDisponibles.length < cantidad) {
      setComboSinStock(cantidad);
      return;
    }
    setComboSinStock(null);

    const shuffled = [...numerosDisponibles];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const elegidos = shuffled.slice(0, cantidad).map((n) => n.numero);
    setSeleccionados(elegidos);
    setPrecioComboSeleccionado(precio);
    setComboSeleccionadoUuid(uuidCombo === "unitario" ? null : uuidCombo);
  }, [numeros]);

  const limpiarSeleccion = useCallback(() => {
    setSeleccionados([]);
    setPrecioComboSeleccionado(null);
    setComboSeleccionadoUuid(null);
  }, []);

  const handleContinuarPago = async ({ uuidRifa, numeros }: EnviarParaApartar) => {
    setEnviando(true);
    canceladaRef.current = false;
    try {
      const res = await ReservarNumero(uuidRifa, numeros, comboSeleccionadoUuid ?? undefined);
      setReservaActual(res);
      localStorage.setItem("reservaActual", JSON.stringify(res));
      setCheckoutCompletado(false);
      setIsCheckoutOpen(true);
    } catch (error) {
      console.error(error);
      alert("Error al apartar los números. Es posible que alguno ya no esté disponible, intenta de nuevo.");
      limpiarSeleccion();
    } finally {
      setEnviando(false);
    }
  };

  const handleCloseCheckout = async () => {
    if (!reservaActual || checkoutCompletado || canceladaRef.current) {
      setIsCheckoutOpen(false);
      return;
    }
    canceladaRef.current = true;
    try {
      await CancelarReserva(reservaActual.uuidPublico, reservaActual.sessionToken);
    } catch (error) {
      console.error(error);
    } finally {
      limpiarSeleccion();
      setReservaActual(null);
      localStorage.removeItem("reservaActual");
      setIsCheckoutOpen(false);
    }
  };

  // Al confirmar el checkout exitosamente (CheckoutModal ya crea reserva CONFIRMADA + compra)
  const handleCheckoutExitoso = useCallback((compraCreada: CompraResponse) => {
    setIsCheckoutOpen(false);
    setExitoso(true);
    setCompra(compraCreada);
    localStorage.removeItem("reservaActual");
    setCheckoutCompletado(true);
  }, []);

  useEffect(() => {
    if (reservaActual || checkoutCompletado) return;

    const localStorageReserva = localStorage.getItem("reservaActual");
    if (!localStorageReserva) return;

    (async () => {
      let reserva: NumerosReservado;
      try {
        reserva = JSON.parse(localStorageReserva);
      } catch {
        localStorage.removeItem("reservaActual");
        return;
      }

      try {
        const actual = await ObtenerReservaPorToken(reserva.sessionToken);

        if (!actual || actual.estado?.nombre !== "ACTIVA") {
          localStorage.removeItem("reservaActual");
          return;
        }

        setReservaActual(actual);
        setSeleccionados(actual.numeros.map((n: string) => parseInt(n, 10)));
        setIsCheckoutOpen(true);
      } catch {
        localStorage.removeItem("reservaActual");
      }
    })();
  }, [reservaActual, checkoutCompletado]);

  const totalPrecio = precioComboSeleccionado ?? seleccionados.length * (rifa?.precioNumero ?? 0);

  return {
    seleccionados,
    enviando,
    exitoso,
    reservaActual,
    compra, // NUEVO
    isCheckoutOpen,
    comboSinStock,
    datosPago,
    cargandoPago,
    precioComboSeleccionado,
    comboSeleccionadoUuid,
    totalPrecio,
    toggleNumero,
    quitarNumero,
    seleccionarCombo,
    limpiarSeleccion,
    handleContinuarPago,
    handleCloseCheckout,
    handleCheckoutExitoso, // NUEVO: reemplaza el onSuccess inline
    setExitoso,
    setIsCheckoutOpen,
    setReservaActual,
    setCheckoutCompletado,
  };
}