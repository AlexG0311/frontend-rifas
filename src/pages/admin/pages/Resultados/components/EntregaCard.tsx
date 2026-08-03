import React from 'react';
import type { ActualizarEntregaResponse, EstadoEntrega, GanadorPublicoResponse } from '../../../types/resultado.type';
import type { EntregaFormData } from './resultadosRifas.types';
import { ESTADOS_ENTREGA } from './resultadosRifas.types';
import { SectionHeader } from './SectionHeader';

interface EntregaCardProps {
  ganadorPublico: GanadorPublicoResponse | null;
  entregaForm: EntregaFormData;
  onEntregaChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onEstadoSelect: (estado: EstadoEntrega) => void;
  entregaLoading: boolean;
  entregaResult: ActualizarEntregaResponse | null;
}

export const EntregaCard: React.FC<EntregaCardProps> = ({
  ganadorPublico,
  entregaForm,
  onEntregaChange,
  onSubmit,
  onEstadoSelect,
  entregaLoading,
  entregaResult,
}) => {
  if (!ganadorPublico) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden mb-6">
      <div className="p-6 sm:p-8">
        <SectionHeader step={5} title="Gestión de Entrega" />

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Estado de entrega *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {ESTADOS_ENTREGA.map((estado) => (
                <button
                  key={estado.value}
                  type="button"
                  onClick={() => onEstadoSelect(estado.value)}
                  className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                    entregaForm.estadoEntrega === estado.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 ring-2 ring-blue-500'
                      : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600'
                  }`}
                  disabled={entregaLoading}
                >
                  {estado.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Nombre de quien recibe
                <span className="text-xs font-normal text-gray-400 ml-2">(Opcional)</span>
              </label>
              <input
                type="text"
                name="nombreRecibido"
                value={entregaForm.nombreRecibido}
                onChange={onEntregaChange}
                placeholder="Ej: Juan Pérez"
                className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={entregaLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Teléfono confirmado
                <span className="text-xs font-normal text-gray-400 ml-2">(Opcional)</span>
              </label>
              <input
                type="text"
                name="telefonoConfirmado"
                value={entregaForm.telefonoConfirmado}
                onChange={onEntregaChange}
                placeholder="Ej: +573001234567"
                className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={entregaLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Observación
              <span className="text-xs font-normal text-gray-400 ml-2">(Opcional)</span>
            </label>
            <textarea
              name="observacion"
              value={entregaForm.observacion}
              onChange={onEntregaChange}
              placeholder="Ej: Premio entregado en persona con acta firmada y foto de evidencia"
              className="w-full min-h-[100px] rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={entregaLoading}
            />
          </div>

          <button
            type="submit"
            disabled={entregaLoading}
            className="w-full sm:w-auto rounded-3xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {entregaLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Actualizando...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Actualizar Entrega
              </>
            )}
          </button>
        </form>

        {entregaResult && (
          <div className="mt-4 rounded-2xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-4 text-sm text-green-700 dark:text-green-400">
            Estado de entrega actualizado a: <strong>{entregaResult.estadoEntrega.nombre}</strong>
          </div>
        )}
      </div>
    </div>
  );
};
