// hooks/useRifas.ts
import { useState, useEffect, useCallback } from 'react';
import {
  getRifas,
  getRifaByUuid,
  createRifa,
  updateRifa,
  cambiarEstadoRifa,
  deleteRifa,
  getNumerosRifa,
  getRifasByEstado,
  getRifaEstadisticas,
} from '../../../services/rifa.service';
import type {
  RifaCreatePayload,
  RifaUpdatePayload,
  RifaEstadoPayload,
  RifaResponse,
  RifasListResponse,
  NumeroRifaResponse,
} from '../../../types/rifa.type';

// Hook para obtener todas las rifas
export const useRifas = (estadoId?: number) => {
  const [rifas, setRifas] = useState<RifasListResponse>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRifas = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = estadoId 
        ? await getRifasByEstado(estadoId) 
        : await getRifas();
      setRifas(data); 
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al cargar las rifas');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [estadoId]);

  useEffect(() => {
    loadRifas();
  }, [loadRifas]);

  return { rifas, isLoading, error, loadRifas };
};

// Hook para obtener una rifa específica
export const useRifa = (uuidPublico: string) => {
  const [rifa, setRifa] = useState<RifaResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRifa = useCallback(async () => {
    if (!uuidPublico) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const data = await getRifaByUuid(uuidPublico);
      setRifa(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al cargar la rifa');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [uuidPublico]);

  useEffect(() => {
    loadRifa();
  }, [loadRifa]);

  return { rifa, isLoading, error, loadRifa };
};

// Hook para obtener números de una rifa
export const useNumerosRifa = (uuidRifa: string) => {
  const [numeros, setNumeros] = useState<NumeroRifaResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNumeros = useCallback(async () => {
    if (!uuidRifa) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const data = await getNumerosRifa(uuidRifa);
      setNumeros(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al cargar los números');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [uuidRifa]);

  useEffect(() => {
    loadNumeros();
  }, [loadNumeros]);

  return { numeros, isLoading, error, loadNumeros };
};

// Hook para estadísticas de rifa
export const useRifaEstadisticas = (uuidPublico: string) => {
  const [estadisticas, setEstadisticas] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEstadisticas = useCallback(async () => {
    if (!uuidPublico) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const data = await getRifaEstadisticas(uuidPublico);
      setEstadisticas(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al cargar estadísticas');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [uuidPublico]);

  useEffect(() => {
    loadEstadisticas();
  }, [loadEstadisticas]);

  return { estadisticas, isLoading, error, loadEstadisticas };
};

// Hook para crear rifa
export const useCrearRifa = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crearRifa = async (data: RifaCreatePayload): Promise<RifaResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await createRifa(data);
      return result;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al crear la rifa');
      console.error(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { crearRifa, isLoading, error };
};

// Hook para actualizar rifa
export const useActualizarRifa = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const actualizarRifa = async (
    uuidPublico: string,
    data: RifaUpdatePayload
  ): Promise<RifaResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await updateRifa(uuidPublico, data);
      return result;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al actualizar la rifa');
      console.error(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { actualizarRifa, isLoading, error };
};

// Hook para cambiar estado de rifa
export const useCambiarEstadoRifa = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cambiarEstado = async (
    uuidPublico: string,
    data: RifaEstadoPayload
  ): Promise<RifaResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await cambiarEstadoRifa(uuidPublico, data);
      return result;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al cambiar el estado de la rifa');
      console.error(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { cambiarEstado, isLoading, error };
};

// Hook para eliminar rifa
export const useEliminarRifa = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const eliminarRifa = async (uuidPublico: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteRifa(uuidPublico);
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al eliminar la rifa');
      console.error(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { eliminarRifa, isLoading, error };
};