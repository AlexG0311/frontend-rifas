import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import type { ComboResponse, ComboPayload } from '../../../types/combo.type';

interface ComboFormModalProps {
  combo: ComboResponse | null;
  onClose: () => void;
  onSave: (data: ComboPayload) => Promise<void>;
}

// Presets de combo: x5 hasta x40
const COMBO_PRESETS = Array.from({ length: 36 }, (_, i) => {
  const cantidad = i + 5; // 5, 6, 7, ..., 40
  return {
    cantidad,
    etiqueta: `Combo x${cantidad}`,
    descripcion: `${cantidad} números aleatorios`,
  };
});

const findPresetPorCantidad = (cantidad: number) =>
  COMBO_PRESETS.find((p) => p.cantidad === cantidad);

export const ComboFormModal = ({ combo, onClose, onSave }: ComboFormModalProps) => {
  const presetInicial = combo ? findPresetPorCantidad(combo.cantidadNumeros) : COMBO_PRESETS[0];

  const [cantidadSeleccionada, setCantidadSeleccionada] = useState<number>(
    presetInicial?.cantidad ?? COMBO_PRESETS[0].cantidad
  );
  const [form, setForm] = useState<Pick<ComboPayload, 'precio' | 'destacado' | 'orden' | 'activo'>>({
    precio: combo ? Number(combo.precio) : 0,
    destacado: combo?.destacado ?? false,
    orden: combo?.orden ?? 0,
    activo: combo?.activo ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const presetActual = findPresetPorCantidad(cantidadSeleccionada)!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (form.precio < 0) {
      setError('El precio no puede ser negativo');
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await onSave({
        cantidadNumeros: presetActual.cantidad,
        etiqueta: presetActual.etiqueta,
        descripcion: presetActual.descripcion,
        precio: form.precio,
        destacado: form.destacado,
        orden: form.orden,
        activo: form.activo,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el combo');
    } finally {
      setSaving(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg w-full max-w-md p-6 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <X size={18} />
        </button>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          {combo ? 'Editar combo' : 'Nuevo combo'}
        </h3>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Combo *
            </label>
            <select
              value={cantidadSeleccionada}
              onChange={(e) => setCantidadSeleccionada(Number(e.target.value))}
              className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={saving}
            >
              {COMBO_PRESETS.map((preset) => (
                <option key={preset.cantidad} value={preset.cantidad}>
                  {preset.etiqueta}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {presetActual.descripcion}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Precio *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">$</span>
              <input
                type="number"
                min={0}
                step="0.01"
                value={form.precio}
                onChange={(e) => setForm((p) => ({ ...p, precio: Number(e.target.value) }))}
                className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-10 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={saving}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Orden
              </label>
              <input
                type="number"
                min={0}
                value={form.orden}
                onChange={(e) => setForm((p) => ({ ...p, orden: Number(e.target.value) }))}
                className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={saving}
              />
            </div>
            <div className="flex flex-col justify-end gap-2 pb-1">
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={form.destacado}
                  onChange={(e) => setForm((p) => ({ ...p, destacado: e.target.checked }))}
                  disabled={saving}
                />
                Destacado
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={form.activo}
                  onChange={(e) => setForm((p) => ({ ...p, activo: e.target.checked }))}
                  disabled={saving}
                />
                Activo
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Guardando...' : combo ? 'Actualizar' : 'Crear combo'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-2xl border border-gray-300 dark:border-gray-700 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};