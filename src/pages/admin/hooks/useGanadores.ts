import { useCallback, useEffect, useState } from 'react';
import { getGanadoresSorteo } from '../services/ganadores.service';
import type { GanadorRifa } from '../types/ganador.type';

export const useGanadoresSorteo = () => {
  const [ganadores, setGanadores] = useState<GanadorRifa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGanadores = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getGanadoresSorteo();
      setGanadores(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al cargar ganadores');
      setGanadores([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGanadores();
  }, [loadGanadores]);

  return { ganadores, isLoading, error, loadGanadores };
};
