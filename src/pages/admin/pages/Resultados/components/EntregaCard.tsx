import type { EstadoEntrega, ActualizarEntregaPayload } from '../../../types/resultado.type';
import { ESTADOS_ENTREGA } from './resultadosRifas.types';
import { SectionHeader } from './SectionHeader';
import { useEffect, useRef, useState } from 'react';
import { getInitialEntregaForm } from './resultadosRifas.types';
import { useActualizarEntrega, useGanadorRifa } from '../hooks/useResultados';

interface EntregaCardProps {
  uuirifa: string;
  isOpen: boolean;
  onClose: () => void;
}

export const EntregaCard = ({ uuirifa, isOpen, onClose }: EntregaCardProps) => {
  const { ganador: ganadorPublico, loadGanador } = useGanadorRifa(uuirifa);
  const [entregaForm, setEntregaForm] = useState(getInitialEntregaForm());
  const { actualizar, resultado: entregaResult, isLoading: entregaLoading } = useActualizarEntrega();

  const refDialog = useRef<HTMLDialogElement>(null);

  const handleEntregaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEntregaForm((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (!refDialog.current) return;
    if (isOpen) {
      refDialog.current.showModal();
    } else {
      refDialog.current.close();
    }
  }, [isOpen, ganadorPublico]);

  // Sincroniza el formulario con el estado actual del ganador cuando se abre el modal

    useEffect(() => {
      if (ganadorPublico && isOpen) {
        setEntregaForm((prev) => ({
          ...prev,
          estadoEntrega: ganadorPublico.estadoEntrega.nombre as EstadoEntrega,
          nombreRecibido: ganadorPublico.nombreRecibido ?? '',
          telefonoConfirmado: ganadorPublico.telefonoConfirmado ?? '',
          observacion: ganadorPublico.observacion ?? '',
        }));
      }
    }, [ganadorPublico, isOpen]);

  const handleDialogClose = () => {
    // Se dispara cuando el <dialog> se cierra vía Esc o backdrop nativo
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === refDialog.current) {
      onClose();
    }
  };

  const handleActualizarEntrega = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uuirifa) return;

    const payload: ActualizarEntregaPayload = {
      estadoEntrega: entregaForm.estadoEntrega,
      ...(entregaForm.nombreRecibido.trim() && { nombreRecibido: entregaForm.nombreRecibido }),
      ...(entregaForm.telefonoConfirmado.trim() && { telefonoConfirmado: entregaForm.telefonoConfirmado }),
      ...(entregaForm.observacion.trim() && { observacion: entregaForm.observacion }),
    };

    const result = await actualizar(uuirifa, payload);
    if (result) {
      loadGanador();
    }
  };

  const handleEstadoSelect = (estado: EstadoEntrega) => {
    setEntregaForm((prev) => ({ ...prev, estadoEntrega: estado }));
  };

  const estadoActualLabel =
    ESTADOS_ENTREGA.find((e) => e.value === entregaForm.estadoEntrega)?.label ?? entregaForm.estadoEntrega;

  return (
    <dialog
      ref={refDialog}
      onClose={handleDialogClose}
      onClick={handleBackdropClick}
      className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-0 bg-transparent backdrop:bg-black/50 w-[95vw] max-w-lg m-0 rounded-3xl"
    >
      {!ganadorPublico ? (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 text-center text-gray-500 dark:text-gray-400">
          Cargando...
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden mb-6 max-h-[90vh] overflow-y-auto">
          <div className="p-4 sm:p-6 md:p-8 relative">
            {/* Botón cerrar */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="absolute right-4 top-4 sm:right-6 sm:top-6 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="pr-10">
              <SectionHeader step={5} title="Gestión de Entrega" />
            </div>

            {/* Estado actual seleccionado */}
            <div className="mb-4 flex items-center gap-2 text-sm">
              <span className="text-gray-500 dark:text-gray-400">Estado actual:</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-medium dark:bg-blue-900/20 dark:text-blue-300">
                {estadoActualLabel}
              </span>
            </div>

            <form onSubmit={handleActualizarEntrega} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Estado de entrega *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  {ESTADOS_ENTREGA.map((estado) => (
                    <button
                      key={estado.value}
                      type="button"
                      onClick={() => handleEstadoSelect(estado.value)}
                      className={`rounded-2xl border px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium transition ${
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
                    onChange={handleEntregaChange}
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
                    onChange={handleEntregaChange}
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
                  onChange={handleEntregaChange}
                  placeholder="Ej: Premio entregado en persona con acta firmada y foto de evidencia"
                  className="w-full min-h-[100px] rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={entregaLoading}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
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
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto rounded-3xl border border-gray-300 dark:border-gray-700 px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>

            {entregaResult && (
              <div className="mt-4 rounded-2xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-4 text-sm text-green-700 dark:text-green-400">
                Estado de entrega actualizado a: <strong>{entregaResult.estadoEntrega.nombre}</strong>
              </div>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
};