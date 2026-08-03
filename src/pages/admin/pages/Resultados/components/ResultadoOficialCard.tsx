import React from 'react';
import type { ResultadoRifaResponse } from '../../../types/resultado.type';
import { SectionHeader } from './SectionHeader';

interface ResultadoOficialCardProps {
  resultado: ResultadoRifaResponse | null;
  resultadoLoading: boolean;
  onRefresh: () => void;
}

export const ResultadoOficialCard: React.FC<ResultadoOficialCardProps> = ({
  resultado,
  resultadoLoading,
  onRefresh,
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden mb-6">
    <div className="p-6 sm:p-8">
      <SectionHeader
        step={3}
        title="Resultado Oficial"
        action={
          <button
            onClick={onRefresh}
            disabled={resultadoLoading}
            className="ml-auto text-xs text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50"
          >
            {resultadoLoading ? 'Cargando...' : 'Actualizar'}
          </button>
        }
      />

      {resultadoLoading ? (
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
          Consultando resultado...
        </div>
      ) : resultado ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-gray-50 dark:bg-gray-900 p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">Lotería</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
              {resultado.nombreLoteria || (resultado.loteria?.idResultadoLoteria ? `ID: ${resultado.loteria.idResultadoLoteria}` : 'N/A')}
            </p>
          </div>
          <div className="rounded-2xl bg-gray-50 dark:bg-gray-900 p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">Número oficial</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{resultado.loteria?.numeroGanador ?? resultado.numeroGanador ?? 'N/A'}</p>
          </div>
          <div className="rounded-2xl bg-gray-50 dark:bg-gray-900 p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">Fecha sorteo</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">{resultado.loteria?.fechaSorteo ? String(resultado.loteria.fechaSorteo) : 'N/A'}</p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Esta rifa aún no tiene un resultado registrado.
        </div>
      )}
    </div>
  </div>
);
