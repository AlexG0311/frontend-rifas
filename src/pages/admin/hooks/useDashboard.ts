import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getDashboardPendientes,
  getDashboardResumen,
  getUltimasCompras,
  getUltimosGanadores,
  getVentasPorMes,
} from '../services/dasboard-services/resumen.service';
import type {
  DashboardAlertaView,
  DashboardCompraView,
  DashboardGanadorView,
  DashboardResumenView,
  DashboardVentaMensualView,
} from '../types/dashboard.types';

function useDashboardLoader<T>(loader: () => Promise<T>, initialValue: T) {
  const initialValueRef = useRef(initialValue);
  const [data, setData] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await loader();
      setData(response);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al cargar el dashboard');
      setData(initialValueRef.current);
    } finally {
      setIsLoading(false);
    }
  }, [loader]);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      if (!isMounted) {
        return;
      }

      await load();
    };

    void run();

    return () => {
      isMounted = false;
    };
  }, [load]);

  return { data, isLoading, error, reload: load };
}

export const useDashboardResumen = () =>
  useDashboardLoader<DashboardResumenView>(getDashboardResumen, {
    rifasActivas: 0,
    rifasFinalizadas: 0,
    numerosVendidos: 0,
    ventasTotales: 0,
    moneda: 'COP',
  });

export const useDashboardVentasPorMes = () =>
  useDashboardLoader<DashboardVentaMensualView[]>(getVentasPorMes, []);

export const useUltimasCompras = () =>
  useDashboardLoader<DashboardCompraView[]>(getUltimasCompras, []);

export const useDashboardPendientes = () =>
  useDashboardLoader<DashboardAlertaView[]>(getDashboardPendientes, []);

export const useUltimosGanadores = () =>
  useDashboardLoader<DashboardGanadorView[]>(getUltimosGanadores, []);
