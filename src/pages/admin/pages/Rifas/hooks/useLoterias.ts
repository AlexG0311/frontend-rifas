import { useState, useEffect, useCallback } from 'react';
import { getLoterias } from '../../../services/loteria.service';
import type { LoteriaResponse } from '../../../types/loteria.type';

export const useLoterias = (search?: string) => {
  const [loterias, setLoterias] = useState<LoteriaResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLoterias = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getLoterias(search);
      setLoterias(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al cargar loterías');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  useEffect(() => {
    loadLoterias();
  }, [loadLoterias]);

  return { loterias, isLoading, error, loadLoterias };
};
