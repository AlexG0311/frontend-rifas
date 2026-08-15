import { useState, useEffect, useRef } from "react";
import { X, User, CreditCard, Mail, Phone, MapPin, CheckCircle2, Loader2, AlertCircle, ShieldCheck } from "lucide-react";
import type { NumerosReservado, DatosCliente } from "../types/reserva.types";
import type { CompraResponse } from "../types/compra.type";
import { CheckoutReserva } from "../services/reserva.service";
import { crearCompra } from "../services/crearcompra.service";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  reserva: NumerosReservado | null;
  totalPrecio: number;
  tituloRifa: string;
  onSuccess: (compra: CompraResponse) => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  reserva,
  totalPrecio,
  tituloRifa,
  onSuccess,
}: CheckoutModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  const [formData, setFormData] = useState<DatosCliente>({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    tipoDocumento: "CC",
    numeroDocumento: "",
    pais: "Colombia",
    departamento: "",
    ciudad: "",
    direccion: "",
    aceptaNotificaciones: true,
  });

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setError(null);
    }
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!reserva) return;

    setLoading(true);
    setError(null);

    try {
      await CheckoutReserva(reserva.uuidPublico, {
        sessionToken: reserva.sessionToken,
        cliente: formData,
      });

      const compra = await crearCompra(reserva.uuidPublico);

      onSuccess(compra);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Ocurrió un error al procesar tu solicitud.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !reserva) return null;

  return (
    <dialog ref={dialogRef} className="modal modal-bottom sm:modal-middle" onClose={onClose}>
      <div className="modal-box max-w-2xl w-full p-0 bg-base-100 rounded-2xl overflow-hidden shadow-2xl border border-base-300 flex flex-col max-h-[90vh]">

        {/* Header — fijo, no se encoge */}
        <div className="bg-primary px-6 py-5 flex items-center justify-between text-primary-content shrink-0">
          <div>
            <span className="text-xs uppercase font-semibold tracking-wider opacity-80">Finalizar compra</span>
            <h3 className="text-xl font-extrabold leading-tight">{tituloRifa}</h3>
          </div>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="btn btn-circle btn-sm btn-ghost text-primary-content hover:bg-white/20"
          >
            <X size={18} />
          </button>
        </div>

        {/* Resumen de la reserva — fijo, pero la lista de números tiene su propio scroll limitado */}
        <div className="bg-base-200/70 border-b border-base-300 px-6 py-4 flex flex-wrap items-start justify-between gap-3 shrink-0">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-base-content/60">Números apartados ({reserva.numeros.length}):</p>
            <div className="flex flex-wrap gap-1.5 mt-1 max-h-16 overflow-y-auto pr-1">
              {reserva.numeros.map((num) => (
                <span key={num} className="badge badge-primary font-bold text-xs">
                  {String(num).padStart(2, "0")}
                </span>
              ))}
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xs text-base-content/60">Total a pagar:</span>
            <p className="text-2xl font-black text-primary">${totalPrecio.toLocaleString()}</p>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-error/10 border border-error/30 text-error flex items-center gap-2 text-sm shrink-0">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Formulario — ocupa el espacio restante y scrollea internamente */}
        <form onSubmit={handleSubmit} className="flex-1 min-h-0 overflow-y-auto p-6 space-y-4">

          {/* Sección Datos Personales */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-base-content/70 flex items-center gap-2 mb-3">
              <User size={16} className="text-primary" /> Datos personales
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="label text-xs font-semibold py-1">Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  required
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej. Juan"
                  className="input input-bordered input-sm w-full focus:input-primary"
                />
              </div>

              <div>
                <label className="label text-xs font-semibold py-1">Apellido *</label>
                <input
                  type="text"
                  name="apellido"
                  required
                  value={formData.apellido}
                  onChange={handleChange}
                  placeholder="Ej. Pérez"
                  className="input input-bordered input-sm w-full focus:input-primary"
                />
              </div>

              <div>
                <label className="label text-xs font-semibold py-1">Correo electrónico *</label>
                <div className="relative">
                  <input
                    type="email"
                    name="correo"
                    required
                    value={formData.correo}
                    onChange={handleChange}
                    placeholder="juan@ejemplo.com"
                    className="input input-bordered input-sm w-full focus:input-primary pl-8"
                  />
                  <Mail size={14} className="absolute left-2.5 top-2.5 text-base-content/40" />
                </div>
              </div>

              <div>
                <label className="label text-xs font-semibold py-1">Teléfono / WhatsApp *</label>
                <div className="relative">
                  <input
                    type="tel"
                    name="telefono"
                    required
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="300 123 4567"
                    className="input input-bordered input-sm w-full focus:input-primary pl-8"
                  />
                  <Phone size={14} className="absolute left-2.5 top-2.5 text-base-content/40" />
                </div>
              </div>
            </div>
          </div>

          {/* Sección Documento */}
          <div className="pt-2">
            <h4 className="text-sm font-bold uppercase tracking-wider text-base-content/70 flex items-center gap-2 mb-3">
              <CreditCard size={16} className="text-primary" /> Identificación
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="label text-xs font-semibold py-1">Tipo Doc. *</label>
                <select
                  name="tipoDocumento"
                  value={formData.tipoDocumento}
                  onChange={handleChange}
                  className="select select-bordered select-sm w-full focus:select-primary font-medium"
                >
                  <option value="CC">Cédula (CC)</option>
                  <option value="CE">Cédula Extranjería (CE)</option>
                  <option value="PP">Pasaporte</option>
                  <option value="NIT">NIT</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="label text-xs font-semibold py-1">Número de documento *</label>
                <input
                  type="text"
                  name="numeroDocumento"
                  required
                  value={formData.numeroDocumento}
                  onChange={handleChange}
                  placeholder="Ej. 1020304050"
                  className="input input-bordered input-sm w-full focus:input-primary"
                />
              </div>
            </div>
          </div>

          {/* Sección Dirección */}
          <div className="pt-2">
            <h4 className="text-sm font-bold uppercase tracking-wider text-base-content/70 flex items-center gap-2 mb-3">
              <MapPin size={16} className="text-primary" /> Ubicación & Dirección
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="label text-xs font-semibold py-1">País *</label>
                <input
                  type="text"
                  name="pais"
                  required
                  value={formData.pais}
                  onChange={handleChange}
                  className="input input-bordered input-sm w-full focus:input-primary"
                />
              </div>

              <div>
                <label className="label text-xs font-semibold py-1">Departamento *</label>
                <input
                  type="text"
                  name="departamento"
                  required
                  value={formData.departamento}
                  onChange={handleChange}
                  placeholder="Ej. Antioquia"
                  className="input input-bordered input-sm w-full focus:input-primary"
                />
              </div>

              <div>
                <label className="label text-xs font-semibold py-1">Ciudad / Municipio *</label>
                <input
                  type="text"
                  name="ciudad"
                  required
                  value={formData.ciudad}
                  onChange={handleChange}
                  placeholder="Ej. Medellín"
                  className="input input-bordered input-sm w-full focus:input-primary"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="label text-xs font-semibold py-1">Dirección de residencia *</label>
                <input
                  type="text"
                  name="direccion"
                  required
                  value={formData.direccion}
                  onChange={handleChange}
                  placeholder="Calle / Carrera # xx - xx"
                  className="input input-bordered input-sm w-full focus:input-primary"
                />
              </div>
            </div>
          </div>

          {/* Checkbox Notificaciones */}
          <div className="pt-2">
            <label className="cursor-pointer flex items-center gap-2 text-xs text-base-content/80">
              <input
                type="checkbox"
                name="aceptaNotificaciones"
                checked={formData.aceptaNotificaciones}
                onChange={handleChange}
                className="checkbox checkbox-primary checkbox-xs"
              />
              <span>Deseo recibir confirmación y notificaciones de mi participación por correo y WhatsApp.</span>
            </label>
          </div>
        </form>

        {/* Botones — fuera del área scrolleable, siempre visibles */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-base-300 shrink-0 bg-base-100">
          <div className="flex items-center gap-1.5 text-xs text-base-content/50">
            <ShieldCheck size={16} className="text-success" />
            <span>Pago seguro</span>
          </div>

          <div className="flex items-center gap-2">
            <button type="button" onClick={onClose} disabled={loading} className="btn btn-ghost btn-sm">
              Cancelar
            </button>
            <button
              type="submit"
              form="checkout-form"
              disabled={loading}
              onClick={(e) => {
                // Como el form ya no envuelve los botones, disparamos el submit manualmente
                const form = e.currentTarget.closest('.modal-box')?.querySelector('form');
                if (form) {
                  e.preventDefault();
                  form.requestSubmit();
                }
              }}
              className="btn btn-primary btn-sm gap-2 px-6"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Procesando...
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} /> Continuar al pago
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>cerrar</button>
      </form>
    </dialog>
  );
}