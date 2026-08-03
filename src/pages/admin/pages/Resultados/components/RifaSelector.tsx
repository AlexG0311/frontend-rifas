import React from 'react';
import type { RifaResponse } from '../../../types/rifa.type';
import { SectionHeader } from './SectionHeader';

interface RifaSelectorProps {
  rifas: RifaResponse[];
  rifasLoading: boolean;
  selectedRifaUuid: string;
  selectedRifa?: RifaResponse;
  onSelectRifa: (uuid: string) => void;
}

export const RifaSelector: React.FC<RifaSelectorProps> = ({
  rifas,
  rifasLoading,
  selectedRifaUuid,
  selectedRifa,
  onSelectRifa,
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden mb-6">
    <div className="p-6 sm:p-8">
      <SectionHeader step={1} title="Seleccionar Rifa" />
      <select
        value={selectedRifaUuid}
        onChange={(e) => onSelectRifa(e.target.value)}
        className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={rifasLoading}
      >
        <option value="" disabled hidden>
          {rifasLoading ? 'Cargando rifas...' : 'Seleccione una rifa'}
        </option>
        {rifas.map((rifa) => (
          <option key={rifa.uuidPublico} value={rifa.uuidPublico}>
            {rifa.titulo} — {rifa.estado.nombre} ({rifa.loteria.nombre})
          </option>
        ))}
      </select>

      {selectedRifa && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-2xl bg-gray-50 dark:bg-gray-900 p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">Estado</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">{selectedRifa.estado.nombre}</p>
          </div>
          <div className="rounded-2xl bg-gray-50 dark:bg-gray-900 p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">Lotería</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">{selectedRifa.loteria.nombre}</p>
          </div>
          <div className="rounded-2xl bg-gray-50 dark:bg-gray-900 p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">Rango</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
              {selectedRifa.numeroInicial} — {selectedRifa.numeroFinal}
            </p>
          </div>
          <div className="rounded-2xl bg-gray-50 dark:bg-gray-900 p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">Fecha sorteo</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
              {new Date(selectedRifa.fechaSorteo).toLocaleDateString('es-CO', { timeZone: 'America/Bogota' })}
            </p>
          </div>
        </div>
      )}
    </div>
  </div>
);
