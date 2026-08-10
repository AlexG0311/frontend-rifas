import { useState } from 'react';
import { Plus, Trash2, Edit2, Star } from 'lucide-react';
import { useRifas } from '../../../../hooks/useRifas';
import { useCombosAdmin } from '../Rifas/hooks/useCombosAdmin';
import type { ComboResponse } from '../../../../types/combo.type';
import { ComboFormModal } from '../../components/ComboFormModal';
import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';

export default function CombosPage() {
  const { rifas, loading: loadingRifas } = useRifas();
  const [selectedRifa, setSelectedRifa] = useState<string>('');
  const { combos, isLoading, error, crear, actualizar, eliminar } = useCombosAdmin(selectedRifa);
  const [editando, setEditando] = useState<ComboResponse | null>(null);
  const [mostrarForm, setMostrarForm] = useState(false);

  return (
    <>
      <PageMeta title="Gestión de Combos" description="Administrar combos de rifas" />
      <PageBreadcrumb pageTitle="Gestión de Combos" />

      <div className="space-y-6">
        {/* ── Selector de rifa ────────────────────────────────────── */}
        <div className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="w-full sm:w-1/2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Seleccionar Rifa
              </label>
              <select
                className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedRifa}
                onChange={(e) => setSelectedRifa(e.target.value)}
                disabled={loadingRifas}
              >
                <option value="">Selecciona una rifa...</option>
                {rifas.map((rifa) => (
                  <option key={rifa.uuidPublico} value={rifa.uuidPublico}>
                    {rifa.titulo}
                  </option>
                ))}
              </select>
            </div>
            {selectedRifa && (
              <button
                type="button"
                onClick={() => { setEditando(null); setMostrarForm(true); }}
                className="rounded-2xl bg-blue-600 px-4 py-2.5 text-sm text-white hover:bg-blue-700 flex items-center gap-2 shrink-0"
              >
                <Plus size={16} /> Agregar combo
              </button>
            )}
          </div>
        </div>

        {/* ── Tabla de combos ────────────────────────────────────── */}
        {selectedRifa && (
          <div className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Combos de venta</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Configura combinaciones de números aleatorios con precio especial para esta rifa.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="animate-pulse text-sm text-gray-400">Cargando combos...</div>
            ) : combos.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                Aún no hay combos configurados. Sin combos, los usuarios no podrán comprar números en esta rifa (más de 100 números requiere al menos un combo).
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr className="text-left text-gray-500 dark:text-gray-400">
                      <th className="py-3 px-4">Etiqueta</th>
                      <th className="py-3 px-4">Cantidad</th>
                      <th className="py-3 px-4">Precio</th>
                      <th className="py-3 px-4">Destacado</th>
                      <th className="py-3 px-4">Estado</th>
                      <th className="py-3 px-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {combos.map((combo) => (
                      <tr key={combo.uuidPublico}>
                        <td className="py-3 px-4 font-medium text-gray-800 dark:text-white">{combo.etiqueta}</td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{combo.cantidadNumeros}</td>
                        <td className="py-3 px-4 text-green-600 dark:text-green-400 font-semibold">
                          ${combo.precio.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          {combo.destacado && <Star size={14} className="fill-amber-400 text-amber-400" />}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs ${
                              combo.activo
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                            }`}
                          >
                            {combo.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => { setEditando(combo); setMostrarForm(true); }}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => eliminar(combo.uuidPublico)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {mostrarForm && (
        <ComboFormModal
          combo={editando}
          onClose={() => setMostrarForm(false)}
          onSave={async (data) => {
            if (editando) {
              await actualizar(editando.uuidPublico, data);
            } else {
              await crear(data);
            }
            setMostrarForm(false);
          }}
        />
      )}
    </>
  );
}
