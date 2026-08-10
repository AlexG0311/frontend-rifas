import { useState, useEffect } from 'react';
import { getCombosRifa } from '../services/combos.service.ts';
import type { ComboResponse } from '../types/combo.type';

export const useCombos = (uuidRifa: string | null) => {
  const [combos, setCombos] = useState<ComboResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!uuidRifa) return;
    setIsLoading(true);
    getCombosRifa(uuidRifa)
      .then(setCombos)
      .catch(() => setCombos([]))
      .finally(() => setIsLoading(false));
  }, [uuidRifa]);

  return { combos, isLoading };
};