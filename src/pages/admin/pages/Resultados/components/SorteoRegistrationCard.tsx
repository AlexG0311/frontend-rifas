import React from 'react';
import type { RegistrarSorteoResponse, ResultadoRifaResponse } from '../../../types/resultado.type';
import type { LoteriaResponse } from '../../../types/loteria.type';
import type { RifaResponse } from '../../../types/rifa.type';
import type { SorteoFormData } from './resultadosRifas.types';
import { SectionHeader } from './SectionHeader';

interface SorteoRegistrationCardProps {
  form: SorteoFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  loterias: LoteriaResponse[];
  loteriasLoading: boolean;
  sorteoLoading: boolean;
  sorteoResult: RegistrarSorteoResponse | null;
  selectedRifa?: RifaResponse;
  resultadoOficial?: ResultadoRifaResponse | null;
}

export const SorteoRegistrationCard: React.FC<SorteoRegistrationCardProps> = ({
  form,
  onChange,
  onSubmit,
  sorteoLoading,
  sorteoResult,
  selectedRifa,
  resultadoOficial,
}) => {
  
  const formatDisplayDate = (value?: string | Date | null) => {
    if (!value) return '—';

    if (typeof value === 'string') {
      const raw = value.split('T')[0] ?? '';
      const [year, month, day] = raw.split('-').map((part) => Number(part));
      if (year && month && day) {
        return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
      }
    }

    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);

    return date.toLocaleDateString('es-CO', {
      timeZone: 'America/Bogota',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const previewLoteria = selectedRifa?.loteria.nombre || resultadoOficial?.nombreLoteria || '—';
  const previewFechaSorteo = form.fechaSorteo
    ? formatDisplayDate(form.fechaSorteo)
    : formatDisplayDate(resultadoOficial?.loteria?.fechaSorteo);
  const previewSerie = form.serie || String(selectedRifa?.resultado_loteria?.serie ?? selectedRifa?.resultado_rifa?.serie ?? resultadoOficial?.serie ?? resultadoOficial?.loteria?.serie ?? '') || '—';
  const previewNumeroGanador = form.numeroGanador || String(selectedRifa?.resultado_loteria?.numeroGanador ?? resultadoOficial?.numeroGanador ?? resultadoOficial?.loteria?.numeroGanador ?? '') || '—';

  return (
  <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden mb-6">
    <div className="p-6 sm:p-8">
      <SectionHeader step={2} title="Registrar Resultado del Sorteo" />

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="rounded-2xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-4">
          <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-3">
            Datos cargados automáticamente según la rifa seleccionada
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/80 dark:bg-gray-900/70 p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">Lotería</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">{previewLoteria}</p>
            </div>
            <div className="rounded-2xl bg-white/80 dark:bg-gray-900/70 p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">Fecha del sorteo</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">{previewFechaSorteo}</p>
            </div>
            <div className="rounded-2xl bg-white/80 dark:bg-gray-900/70 p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">Serie</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">{previewSerie}</p>
            </div>
            <div className="rounded-2xl bg-white/80 dark:bg-gray-900/70 p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">Número ganador de la lotería</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">{previewNumeroGanador}</p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Número manual
            <span className="text-xs font-normal text-gray-400 ml-2">(Define el ganador según la forma de juego)</span>
          </label>
          <input
            type="text"
            name="numeroManual"
            value={form.numeroManual}
            onChange={onChange}
            placeholder="Ej: 589 (3 cifras)"
            className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={sorteoLoading}
          />
        </div>

        <button
          type="submit"
          disabled={sorteoLoading}
          className="w-full sm:w-auto rounded-3xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {sorteoLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              Registrando...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Registrar Sorteo
            </>
          )}
        </button>
      </form>

      {sorteoResult && (
        <div className="mt-6 rounded-2xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-4">
          <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">✓ Sorteo registrado</p>
          <div className="grid grid-cols-2 gap-2 text-sm text-green-600 dark:text-green-400">
            <span>
              Número: <strong>{sorteoResult.numeroGanador}</strong>
            </span>
            {sorteoResult.serie && (
              <span>
                Serie: <strong>{sorteoResult.serie}</strong>
              </span>
            )}
            {sorteoResult.numeroCalculado && (
              <span>
                Número calculado: <strong>{sorteoResult.numeroCalculado}</strong>
              </span>
            )}
            <span>
              Rifa sorteada: <strong>{sorteoResult.rifaSorteada ? 'Sí' : 'No'}</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  </div>
  );
};
