import React, { useState } from 'react';
import { useLoterias } from '../Rifas/hooks/useLoterias';
import { useProcesarResultadoLoteria } from './hooks/useResultados';
import type { ProcesarResultadoPayload } from '../../types/resultado.type';

interface FormData {
  idLoteria: number;
  fechaSorteo: string;
  numeroGanador: string;
  serie: string;
}

const getInitialForm = (): FormData => ({
  idLoteria: 0,
  fechaSorteo: new Date().toISOString().split('T')[0],
  numeroGanador: '',
  serie: '',
});

export default function ResultadosLoteria() {
  const { loterias, isLoading: loteriasLoading } = useLoterias();
  const { procesar, resultado, isLoading, error, reset } = useProcesarResultadoLoteria();

  const [formData, setFormData] = useState<FormData>(getInitialForm());
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'idLoteria' ? Number(value) : value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.idLoteria) {
      setFormError('Debe seleccionar una lotería');
      return false;
    }
    if (!formData.fechaSorteo) {
      setFormError('La fecha del sorteo es requerida');
      return false;
    }
    if (!formData.numeroGanador.trim()) {
      setFormError('El número ganador es requerido');
      return false;
    }
    setFormError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSuccessMessage(null);
    reset();

    const payload: ProcesarResultadoPayload = {
      idLoteria: formData.idLoteria,
      fechaSorteo: formData.fechaSorteo,
      numeroGanador: formData.numeroGanador,
      ...(formData.serie.trim() && { serie: formData.serie }),
    };

    const result = await procesar(payload);
    if (result) {
      setSuccessMessage(
        `Resultado procesado correctamente. Se actualizaron ${result.totalRifasProcesadas} rifa(s).`
      );
    }
  };

  const handleReset = () => {
    setFormData(getInitialForm());
    setFormError(null);
    setSuccessMessage(null);
    reset();
  };

  const selectedLoteria = loterias.find((l) => l.id_loteria === formData.idLoteria);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Resultados de Loterías
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Registra el número premiado del día de una lotería. Todas las rifas asociadas se actualizarán automáticamente.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            {/* Error global */}
            {(formError || error) && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-2xl flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{formError || error}</span>
              </div>
            )}

            {/* Success */}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-2xl flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Lotería selector */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Lotería *
                </label>
                <select
                  name="idLoteria"
                  value={formData.idLoteria === 0 ? '' : String(formData.idLoteria)}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={isLoading || loteriasLoading}
                >
                  {loterias.length === 0 ? (
                    <option value="" disabled>
                      {loteriasLoading ? 'Cargando loterías...' : 'No hay loterías disponibles'}
                    </option>
                  ) : (
                    <>
                      <option value="" disabled hidden>
                        Seleccione una lotería
                      </option>
                      {loterias.map((loteria) => (
                        <option key={loteria.id_loteria} value={String(loteria.id_loteria)}>
                          {loteria.nombre}
                          {loteria.diaSorteo ? ` (${loteria.diaSorteo})` : ''}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>

              {/* Fecha y Número ganador */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Fecha del sorteo *
                  </label>
                  <input
                    type="date"
                    name="fechaSorteo"
                    value={formData.fechaSorteo}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Número ganador *
                  </label>
                  <input
                    type="text"
                    name="numeroGanador"
                    value={formData.numeroGanador}
                    onChange={handleChange}
                    placeholder="Ej: 4589"
                    className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Serie (opcional) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Serie
                  <span className="text-xs font-normal text-gray-400 dark:text-gray-500 ml-2">
                    (Opcional)
                  </span>
                </label>
                <input
                  type="text"
                  name="serie"
                  value={formData.serie}
                  onChange={handleChange}
                  placeholder="Ej: 005"
                  className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
              </div>

              {/* Preview */}
              {formData.idLoteria > 0 && formData.numeroGanador && (
                <div className="rounded-2xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-4">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <span className="font-semibold">Resumen:</span> Se registrará el número{' '}
                    <span className="font-bold">{formData.numeroGanador}</span>
                    {formData.serie && (
                      <> serie <span className="font-bold">{formData.serie}</span></>
                    )}{' '}
                    de la lotería{' '}
                    <span className="font-bold">{selectedLoteria?.nombre || '...'}</span> para la
                    fecha <span className="font-bold">{formData.fechaSorteo}</span>.
                  </p>
                </div>
              )}

              {/* Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-3xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Procesar Resultado
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isLoading}
                  className="w-full rounded-3xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-5 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors"
                >
                  Limpiar
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Resultado Card */}
        {resultado && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden">
            <div className="p-6 sm:p-8">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Resultado Procesado
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-gray-50 dark:bg-gray-900 p-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Número ganador</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {resultado.numeroGanador}
                  </p>
                </div>
                <div className="rounded-2xl bg-gray-50 dark:bg-gray-900 p-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Rifas procesadas</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                    {resultado.totalRifasProcesadas}
                  </p>
                </div>
                <div className="rounded-2xl bg-gray-50 dark:bg-gray-900 p-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Fecha del sorteo</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                    {resultado.fechaSorteo}
                  </p>
                </div>
                {resultado.serie && (
                  <div className="rounded-2xl bg-gray-50 dark:bg-gray-900 p-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Serie</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                      {resultado.serie}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
