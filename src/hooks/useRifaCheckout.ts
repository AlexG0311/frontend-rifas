import { useState, useRef, useEffect, useCallback } from "react";
import { ReservarNumero, CancelarReserva, ObtenerReservaPorToken } from "../services/reserva.service";
import type { EnviarParaApartar, NumerosReservado } from "../types/reserva.types";
import type { NumeroRifa, Rifa } from "../types/rifa.types";

interface UseRifaCheckoutProps {
  rifa: Rifa | undefined;
  numeros: NumeroRifa[];
}

export function useRifaCheckout({ rifa, numeros }: UseRifaCheckoutProps) {
  const [seleccionados, setSeleccionados] = useState<number[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [checkoutCompletado, setCheckoutCompletado] = useState(false);
  const [exitoso, setExitoso] = useState(false);
  const [reservaActual, setReservaActual] = useState<NumerosReservado | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [comboSinStock, setComboSinStock] = useState<number | null>(null);
  const [precioComboSeleccionado, setPrecioComboSeleccionado] = useState<number | null>(null);

  const canceladaRef = useRef(false);

  const toggleNumero = useCallback((numero: number) => {
    setPrecioComboSeleccionado(null);
    setSeleccionados((prev) =>
      prev.includes(numero) ? prev.filter((n) => n !== numero) : [...prev, numero]
    );
  }, []);

  const quitarNumero = useCallback((numero: number) => {
    setSeleccionados((prev) => prev.filter((n) => n !== numero));
  }, []);

  const seleccionarCombo = useCallback((cantidad: number, precio: number) => {
    const numerosDisponibles = numeros.filter((n) => n.estado === "DISPONIBLE");

    if (numerosDisponibles.length < cantidad) {
      setComboSinStock(cantidad);
      return;
    }
    setComboSinStock(null);

    // Fisher-Yates shuffle parcial
    const shuffled = [...numerosDisponibles];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const elegidos = shuffled.slice(0, cantidad).map((n) => n.numero);
    setSeleccionados(elegidos);
    setPrecioComboSeleccionado(precio);
  }, [numeros]);

  const limpiarSeleccion = useCallback(() => {
    setSeleccionados([]);
    setPrecioComboSeleccionado(null);
  }, []);

  const handleContinuarPago = async ({ uuidRifa, numeros }: EnviarParaApartar) => {
    setEnviando(true);
    canceladaRef.current = false;
    try {
      const res = await ReservarNumero(uuidRifa, numeros);
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
    isCheckoutOpen,
    comboSinStock,
    precioComboSeleccionado,
    totalPrecio,
    toggleNumero,
    quitarNumero,
    seleccionarCombo,
    limpiarSeleccion,
    handleContinuarPago,
    handleCloseCheckout,
    setExitoso,
    setIsCheckoutOpen,
    setReservaActual,
    setCheckoutCompletado,
  };
}
