// hooks/useCombosAdmin.ts — admin (RifaFormPage)
import { useState, useEffect, useCallback } from 'react';
import {
  getCombosAdmin,
  crearComboRifa,
  actualizarComboRifa,
  eliminarComboRifa,
} from '../../../../../services/combos.service.ts';
import type { ComboResponse, ComboPayload } from '../../../../../types/combo.type';

export const useCombosAdmin = (uuidRifa: string) => {
  const [combos, setCombos] = useState<ComboResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCombos = useCallback(async () => {
    if (!uuidRifa) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCombosAdmin(uuidRifa);
      setCombos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar combos');
    } finally {
      setIsLoading(false);
    }
  }, [uuidRifa]);

  useEffect(() => {
    loadCombos();
  }, [loadCombos]);

  const crear = useCallback(async (payload: ComboPayload) => {
    await crearComboRifa(uuidRifa, payload);
    await loadCombos();
  }, [uuidRifa, loadCombos]);

  const actualizar = useCallback(async (uuidCombo: string, payload: Partial<ComboPayload>) => {
    await actualizarComboRifa(uuidCombo, payload);
    await loadCombos();
  }, [loadCombos]);

  const eliminar = useCallback(async (uuidCombo: string) => {
    if (!window.confirm('¿Eliminar este combo?')) return;
    await eliminarComboRifa(uuidCombo);
    await loadCombos();
  }, [loadCombos]);

  return { combos, isLoading, error, crear, actualizar, eliminar };
};