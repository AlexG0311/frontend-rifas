import React from 'react';
import type { DeclararGanadorResponse, GanadorPublicoResponse, EstadoEntrega } from '../../../types/resultado.type';
import { ESTADOS_ENTREGA } from './resultadosRifas.types';
import { SectionHeader } from './SectionHeader';

interface GanadorCardProps {
  ganadorPublico: GanadorPublicoResponse | null;
  ganadorDeclarado: DeclararGanadorResponse | null;
  ganadorPubLoading: boolean;
  ganadorLoading: boolean;
  onDeclararGanador: () => void;
  sinGanador: boolean;
}

export const GanadorCard: React.FC<GanadorCardProps> = ({
  ganadorPublico,
  ganadorDeclarado,
  ganadorPubLoading,
  ganadorLoading,
  onDeclararGanador,
  sinGanador,
}) => {

  const getEstadoEntregaBadge = (estado: EstadoEntrega) => {
    const config = ESTADOS_ENTREGA.find((e) => e.value === estado);
    return config ? config.color : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden mb-6">
      <div className="p-6 sm:p-8">
        <SectionHeader step={4} title="Declarar Ganador" />

        {ganadorPubLoading ? (
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
            Consultando ganador...
          </div>
        ) : ganadorPublico ? (
          <div className="rounded-2xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-5">
            <div className="flex items-center gap-3 mb-3">
              <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-lg font-bold text-green-700 dark:text-green-400">¡Ganador declarado!</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Nombre</p>
                <p className="font-semibold text-gray-900 dark:text-white">{ganadorPublico.cliente.nombre} {ganadorPublico.cliente.apellido}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Número ganador</p>
                <p className="font-semibold text-gray-900 dark:text-white">#{ganadorPublico.numero}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Estado entrega</p>
                <span className={`inline-block mt-1 px-3 py-1 text-xs font-medium rounded-full ${getEstadoEntregaBadge(ganadorPublico.estadoEntrega.nombre)}`}>
                  {ganadorPublico.estadoEntrega.nombre}
                </span>
              </div>
            </div>
          </div>
        ) : ganadorDeclarado ? (
          <div className="rounded-2xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-5">
            <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">✓ Ganador recién declarado</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Cliente</p>
                <p className="font-semibold text-gray-900 dark:text-white">{ganadorDeclarado.cliente.nombre}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Teléfono</p>
                <p className="font-semibold text-gray-900 dark:text-white">{ganadorDeclarado.cliente.telefono}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Número</p>
                <p className="font-semibold text-gray-900 dark:text-white">#{ganadorDeclarado.numeroGanador}</p>
              </div>
            </div>
          </div>
        ) : sinGanador ? (
          <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-6 text-center">
            <svg className="w-8 h-8 text-amber-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
              No hubo ganador en esta rifa
            </p>
            <p className="text-xs text-amber-600/80 dark:text-amber-400/80 mt-1">
              El número sorteado no fue comprado por ningún participante. Esta situación requiere una decisión manual (resorteo, número de respaldo, etc.).
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-6 text-center text-sm text-gray-500 dark:text-gray-400">
              No se ha declarado ganador aún. Asegúrate de haber registrado el sorteo primero.
            </div>
            <button
              onClick={onDeclararGanador}
              disabled={ganadorLoading}
              className="w-full sm:w-auto rounded-3xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {ganadorLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Calculando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Calcular y Declarar Ganador
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};