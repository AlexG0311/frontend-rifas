// hooks/useResultados.ts
import { useState, useEffect, useCallback } from 'react';
import {
  registrarSorteoRifa,
  procesarResultadoLoteria,
  declararGanador,
  actualizarEntrega,
  getGanadorRifa,
  getResultadoRifa,
} from '../../../services/resultado.service';
import type {
  RegistrarSorteoPayload,
  RegistrarSorteoResponse,
  ProcesarResultadoPayload,
  ProcesarResultadoResponse,
  DeclararGanadorResponse,
  ActualizarEntregaPayload,
  ActualizarEntregaResponse,
  GanadorPublicoResponse,
  ResultadoRifaResponse,
} from '../../../types/resultado.type';

// ─── Hook para procesar resultado de lotería (masivo) ───
export const useProcesarResultadoLoteria = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ProcesarResultadoResponse | null>(null);

  const procesar = async (
    payload: ProcesarResultadoPayload
  ): Promise<ProcesarResultadoResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await procesarResultadoLoteria(payload);
      setResultado(data);
      return data;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al procesar resultado de lotería');
      console.error(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = useCallback(() => {
    setResultado(null);
    setError(null);
  }, []);

  return { procesar, resultado, isLoading, error, reset };
};

// ─── Hook para registrar sorteo de una rifa ───
export const useRegistrarSorteoRifa = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<RegistrarSorteoResponse | null>(null);

  const registrar = async (
    uuidPublico: string,
    payload: RegistrarSorteoPayload
  ): Promise<RegistrarSorteoResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await registrarSorteoRifa(uuidPublico, payload);
      setResultado(data);
      return data;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al registrar sorteo');
      console.error(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = useCallback(() => {
    setResultado(null);
    setError(null);
  }, []);

  return { registrar, resultado, isLoading, error, reset };
};

// ─── Hook para declarar ganador ───
export const useDeclararGanador = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ganador, setGanador] = useState<DeclararGanadorResponse | null>(null);

  const declarar = async (
    uuidPublico: string
  ): Promise<DeclararGanadorResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await declararGanador(uuidPublico);
      setGanador(data);
      return data;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al declarar ganador');
      console.error(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = useCallback(() => {
    setGanador(null);
    setError(null);
  }, []);

  return { declarar, ganador, isLoading, error, reset };
};

// ─── Hook para actualizar estado de entrega ───
export const useActualizarEntrega = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ActualizarEntregaResponse | null>(null);

  const actualizar = async (
    uuidPublico: string,
    payload: ActualizarEntregaPayload
  ): Promise<ActualizarEntregaResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await actualizarEntrega(uuidPublico, payload);
      setResultado(data);
      return data;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al actualizar entrega');
      console.error(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = useCallback(() => {
    setResultado(null);
    setError(null);
  }, []);

  return { actualizar, resultado, isLoading, error, reset };
};

// ─── Hook para obtener ganador de rifa (GET) ───
export const useGanadorRifa = (uuidPublico: string) => {
  const [ganador, setGanador] = useState<GanadorPublicoResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadGanador = useCallback(async () => {
    if (!uuidPublico) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await getGanadorRifa(uuidPublico);
      setGanador(data);
    } catch (error) {
      // 404 = no hay ganador aún, no es un error crítico
      setError(error instanceof Error ? error.message : 'Error al obtener ganador');
      setGanador(null);
    } finally {
      setIsLoading(false);
    }
  }, [uuidPublico]);

  useEffect(() => {
    if (uuidPublico) {
      loadGanador();
    }
  }, [loadGanador, uuidPublico]);

  return { ganador, isLoading, error, loadGanador };
};

// ─── Hook para obtener resultado de rifa (GET) ───
export const useResultadoRifa = (uuidPublico: string) => {
  const [resultado, setResultado] = useState<ResultadoRifaResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadResultado = useCallback(async () => {
    if (!uuidPublico) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await getResultadoRifa(uuidPublico);
      setResultado(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al obtener resultado');
      setResultado(null);
    } finally {
      setIsLoading(false);
    }
  }, [uuidPublico]);

  useEffect(() => {
    if (uuidPublico) {
      loadResultado();
    }
  }, [loadResultado, uuidPublico]);

  return { resultado, isLoading, error, loadResultado };
};
