import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCrearRifa, useActualizarRifa, useRifa } from './hooks/useRifas';
import { useLoterias } from './hooks/useLoterias';
import { GetProductos } from '../../services/productos.service';
import type { productosGetpayload } from '../../types/productos.type';
import  type { RifaCreatePayload, RifaUpdatePayload, RifaProducto } from '../../types/rifa.type';
import DropzoneImage from '../../components/form/form-elements/DropZone';

interface RifaFormData {
  idLoteria: number;
  titulo: string;
  descripcion: string;
  precioNumero: number;
  numeroInicial: number;
  numeroFinal: number;
  fechaInicio: string;
  fechaCierre: string;
  fechaSorteo: string;
  imagenPrincipal: string;
  productos: RifaProducto[];
}

const formatForDatetimeLocal = (dateInput: Date | string): string => {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return '';
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const parts = formatter.formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value || '00';
  let hourStr = get('hour');
  if (hourStr === '24') hourStr = '00';
  return `${get('year')}-${get('month')}-${get('day')}T${hourStr}:${get('minute')}`;
};

const formatForDateOnly = (dateInput: Date | string): string => {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

const getInitialState = (): RifaFormData => ({
  idLoteria: 0,
  titulo: '',
  descripcion: '',
  precioNumero: 0,
  numeroInicial: 0,
  numeroFinal: 9999,
  fechaInicio: formatForDatetimeLocal(new Date()),
  fechaCierre: formatForDatetimeLocal(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
  fechaSorteo: formatForDateOnly(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)),
  imagenPrincipal: '',
  productos: [],
});

export default function RifaFormPage() {
  const navigate = useNavigate();
  const { uuidPublico } = useParams<{ uuidPublico?: string }>();
  const modo: 'crear' | 'editar' = uuidPublico ? 'editar' : 'crear';
  const { rifa, isLoading: isRifaLoading, error: rifaError } = useRifa(uuidPublico ?? '');
  const { loterias, isLoading: loteriasLoading, error: loteriasError } = useLoterias();
  const { crearRifa, isLoading: isCreating } = useCrearRifa();
  const { actualizarRifa, isLoading: isUpdating } = useActualizarRifa();

  const [formData, setFormData] = useState<RifaFormData>(getInitialState());
  const [formError, setFormError] = useState<string | null>(null);
  const [availableProducts, setAvailableProducts] = useState<productosGetpayload>([]);
  const [selectedProductoId, setSelectedProductoId] = useState<number>(0);
  const [selectedCantidad, setSelectedCantidad] = useState<number>(1);
  const [productMode, setProductMode] = useState<'manual' | 'select' | 'keep'>('manual');
  const [searchTerm, setSearchTerm] = useState('');

  const isLoading = isCreating || isUpdating;
  const filteredProducts = availableProducts.filter((product) =>
    product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (modo === 'editar' && rifa) {
      setFormData({
        idLoteria: rifa.loteria.idLoteria,
        titulo: rifa.titulo,
        descripcion: rifa.descripcion || '',
        precioNumero: rifa.precioNumero,
        numeroInicial: rifa.numeroInicial,
        numeroFinal: rifa.numeroFinal,
        fechaInicio: formatForDatetimeLocal(rifa.fechaInicio),
        fechaCierre: formatForDatetimeLocal(rifa.fechaCierre),
        fechaSorteo: formatForDateOnly(rifa.fechaSorteo),
        imagenPrincipal: rifa.imagenPrincipal || '',
        productos: rifa.productos.map((p) => ({
          idProducto: p.idProducto,
          cantidad: p.cantidad,
        })),
      });
      setProductMode(rifa.productos.length > 0 ? 'keep' : 'manual');
      setFormError(null);
    }
  }, [modo, rifa]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await GetProductos();
        setAvailableProducts(products);
        if (products.length > 0 && selectedProductoId === 0) {
          setSelectedProductoId(products[0].idProducto);
        }
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    };
    loadProducts();
  }, [selectedProductoId]);

  useEffect(() => {
    if (modo === 'crear' && loterias.length > 0 && formData.idLoteria === 0) {
      setFormData((prev) => ({ ...prev, idLoteria: loterias[0].id_loteria }));
    }
  }, [modo, loterias, formData.idLoteria]);

  const selectedLoteriaId = formData.idLoteria || (modo === 'editar' ? rifa?.idLoteria ?? 0 : 0);

  const validateForm = (): boolean => {
    if (!formData.titulo.trim()) {
      setFormError('El título es requerido');
      return false;
    }
    if (formData.titulo.trim().length < 3) {
      setFormError('El título debe tener al menos 3 caracteres');
      return false;
    }
    if (!selectedLoteriaId) {
      setFormError('Debe seleccionar una lotería');
      return false;
    }
    if (productMode === 'select' && formData.productos.length === 0) {
      setFormError('Debe agregar al menos un producto como premio');
      return false;
    }
    if (!formData.precioNumero || formData.precioNumero <= 0) {
      setFormError('El precio debe ser mayor a 0');
      return false;
    }

    // ── Validaciones de número inicial / final ──────────────────────────────
    if (
      formData.numeroInicial === null ||
      formData.numeroInicial === undefined ||
      Number.isNaN(formData.numeroInicial)
    ) {
      setFormError('El número inicial es requerido');
      return false;
    }
    if (
      formData.numeroFinal === null ||
      formData.numeroFinal === undefined ||
      Number.isNaN(formData.numeroFinal)
    ) {
      setFormError('El número final es requerido');
      return false;
    }
    if (formData.numeroInicial !== 0) {
      setFormError('El número inicial debe ser 0');
      return false;
    }
    if (formData.numeroFinal < 0) {
      setFormError('El número final no puede ser negativo');
      return false;
    }
    if (formData.numeroFinal > 9999) {
      setFormError('El número final no puede ser mayor a 9999');
      return false;
    }
    if (formData.numeroInicial >= formData.numeroFinal) {
      setFormError('El número inicial debe ser menor al número final');
      return false;
    }

    // ── Validaciones de fechas ───────────────────────────────────────────────
    if (!formData.fechaInicio) {
      setFormError('La fecha de inicio es requerida');
      return false;
    }
    if (!formData.fechaCierre) {
      setFormError('La fecha de cierre es requerida');
      return false;
    }
    if (!formData.fechaSorteo) {
      setFormError('La fecha de sorteo es requerida');
      return false;
    }

    const buildDate = (str: string) => {
      if (!str) return new Date();
      if (str.includes('T')) {
        const timePart = str.split('T')[1];
        const sec = timePart.split(':').length === 2 ? ':00' : '';
        return new Date(`${str}${sec}-05:00`);
      }
      return new Date(`${str}T00:00:00-05:00`);
    };

    const fechaInicio = buildDate(formData.fechaInicio);
    const fechaCierre = buildDate(formData.fechaCierre);
    const fechaSorteo = buildDate(formData.fechaSorteo);

    if (fechaInicio >= fechaCierre) {
      setFormError('La fecha de inicio debe ser anterior a la fecha de cierre');
      return false;
    }
    if (fechaCierre >= fechaSorteo) {
      setFormError('La fecha de cierre debe ser anterior a la fecha de sorteo');
      return false;
    }
    setFormError(null);
    return true;
  };

  const preparePayload = () => {
    const buildDate = (str: string) => {
      if (!str) return new Date();
      if (str.includes('T')) {
        const timePart = str.split('T')[1];
        const sec = timePart.split(':').length === 2 ? ':00' : '';
        return new Date(`${str}${sec}-05:00`);
      }
      return new Date(`${str}T00:00:00-05:00`);
    };

    return {
      idLoteria: Number(selectedLoteriaId),
      titulo: formData.titulo,
      descripcion: formData.descripcion || null,
      precioNumero: Number(formData.precioNumero),
      numeroInicial: Number(formData.numeroInicial),
      numeroFinal: Number(formData.numeroFinal),
      imagenPrincipal: formData.imagenPrincipal || undefined,
      fechaInicio: buildDate(formData.fechaInicio),
      fechaCierre: buildDate(formData.fechaCierre),
      fechaSorteo: buildDate(formData.fechaSorteo),
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const basePayload = preparePayload();
      let result;

      if (modo === 'crear') {
        const createData: Partial<RifaCreatePayload> = { ...basePayload };
        if (productMode === 'select') {
          createData.productos = formData.productos.map((p) => ({
            idProducto: Number(p.idProducto),
            cantidad: Number(p.cantidad),
          }));
        }
        console.log('Creando rifa con payload:', createData);
        result = await crearRifa(createData as RifaCreatePayload);
      } else {
        const updatePayload: RifaUpdatePayload = {
          titulo: basePayload.titulo,
          descripcion: basePayload.descripcion,
          precioNumero: basePayload.precioNumero,
          imagenPrincipal: basePayload.imagenPrincipal,
          fechaInicio: basePayload.fechaInicio,
          fechaCierre: basePayload.fechaCierre,
          fechaSorteo: basePayload.fechaSorteo,
        };
        if (basePayload.idLoteria !== rifa?.idLoteria) {
          updatePayload.idLoteria = basePayload.idLoteria;
        }
        if (productMode === 'select') {
          updatePayload.productos = formData.productos.map((p) => ({
            idProducto: Number(p.idProducto),
            cantidad: Number(p.cantidad),
          }));
        } else if (productMode === 'manual') {
          updatePayload.productos = [];
        }

        console.log('Editando rifa con payload:', updatePayload);
        result = await actualizarRifa(uuidPublico!, updatePayload);
      }

      if (result) {
        navigate('/admin/Rifas');
      }
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Error al guardar la rifa');
      console.error('Error al guardar la rifa:', error);
    }
  };

  if (modo === 'editar' && isRifaLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (modo === 'editar' && rifaError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Error</h1>
          <p className="text-gray-600 dark:text-gray-300">{rifaError}</p>
          <button
            onClick={() => navigate('/admin/Rifas')}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver a Rifas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {modo === 'crear' ? 'Crear nueva rifa' : 'Editar rifa'}
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {modo === 'crear'
                ? 'Completa los datos para crear una nueva rifa.'
                : 'Ajusta los datos y guarda para actualizar la rifa.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/admin/Rifas')}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Volver a Rifas
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            {formError && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    minLength={3}
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Lotería *
                  </label>
                  <select
                    value={formData.idLoteria === 0 ? '' : String(formData.idLoteria)}
                    onChange={(e) => {
                      const selectedValue = parseInt(e.target.value, 10);
                      setFormData({
                        ...formData,
                        idLoteria: Number.isNaN(selectedValue) ? 0 : selectedValue,
                      });
                    }}
                    className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={isLoading || loteriasLoading}
                  >
                    {loterias.length === 0 ? (
                      <option value="" disabled>
                        {loteriasLoading ? 'Cargando loterías...' : 'No hay loterías'}
                      </option>
                    ) : (
                      <>
                        <option value="" disabled hidden>
                          Seleccione una lotería
                        </option>
                        {loterias.map((loteria) => (
                          <option key={loteria.id_loteria} value={String(loteria.id_loteria)}>
                            {loteria.nombre}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                  {loteriasError && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{loteriasError}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Precio por número *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">$</span>
                    <input
                      type="number"
                      value={formData.precioNumero}
                      onChange={(e) => setFormData({ ...formData, precioNumero: Number(e.target.value) })}
                      className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-10 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      min={0.01}
                      step="0.01"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Número inicial *
                    </label>
                    <input
                      type="number"
                      value={formData.numeroInicial}
                      onChange={(e) => setFormData({ ...formData, numeroInicial: Number(e.target.value) })}
                      className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      min={0}
                      max={0}
                      disabled={isLoading}
                    />
                    <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">Siempre debe ser 0</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Número final *
                    </label>
                    <input
                      type="number"
                      value={formData.numeroFinal}
                      onChange={(e) => setFormData({ ...formData, numeroFinal: Number(e.target.value) })}
                      className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      min={1}
                      max={9999}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full min-h-[120px] rounded-3xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Opcional: describe la rifa"
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Fecha inicio *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.fechaInicio}
                    onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                    className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Fecha cierre *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.fechaCierre}
                    onChange={(e) => setFormData({ ...formData, fechaCierre: e.target.value })}
                    className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Fecha sorteo *
                  </label>
                  <input
                    type="date"
                    value={formData.fechaSorteo}
                    onChange={(e) => setFormData({ ...formData, fechaSorteo: e.target.value })}
                    className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Producto como premio
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => setProductMode('manual')}
                    className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                      productMode === 'manual'
                        ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                        : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600'
                    }`}
                    disabled={isLoading}
                  >
                    Describir manualmente
                  </button>
                  <button
                    type="button"
                    onClick={() => setProductMode('select')}
                    className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                      productMode === 'select'
                        ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                        : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600'
                    }`}
                    disabled={isLoading}
                  >
                    Seleccionar productos registrados
                  </button>
                  {modo === 'editar' && (
                    <button
                      type="button"
                      onClick={() => setProductMode('keep')}
                      className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                        productMode === 'keep'
                          ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                          : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600'
                      }`}
                      disabled={isLoading}
                    >
                      Mantener productos actuales
                    </button>
                  )}
                </div>

                {productMode === 'select' && (
                  <div className="space-y-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Buscar producto
                        </label>
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Buscar por nombre..."
                          className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={isLoading}
                        />
                      </div>
                      <div className="sm:w-52">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Producto
                        </label>
                        <select
                          value={selectedProductoId === 0 ? '' : String(selectedProductoId)}
                          onChange={(e) => setSelectedProductoId(Number(e.target.value))}
                          className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={isLoading || availableProducts.length === 0}
                        >
                          <option value="" disabled hidden>
                            Seleccione
                          </option>
                          {filteredProducts.map((product) => (
                            <option key={product.idProducto} value={String(product.idProducto)}>
                              {product.nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="sm:w-28">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Cantidad
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={selectedCantidad}
                          onChange={(e) => setSelectedCantidad(Number(e.target.value))}
                          className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={isLoading}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (!selectedProductoId || selectedCantidad <= 0) return;
                          const exists = formData.productos.find((p) => p.idProducto === selectedProductoId);
                          if (exists) {
                            setFormData((prev) => ({
                              ...prev,
                              productos: prev.productos.map((p) =>
                                p.idProducto === selectedProductoId
                                  ? { ...p, cantidad: p.cantidad + selectedCantidad }
                                  : p
                              ),
                            }));
                          } else {
                            setFormData((prev) => ({
                              ...prev,
                              productos: [...prev.productos, { idProducto: selectedProductoId, cantidad: selectedCantidad }],
                            }));
                          }
                        }}
                        disabled={isLoading || !selectedProductoId}
                        className="rounded-2xl bg-blue-600 px-5 py-3 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
                      >
                        Agregar
                      </button>
                    </div>

                    {formData.productos.length > 0 ? (
                      <div className="grid grid-cols-1 gap-3">
                        {formData.productos.map((p) => {
                          const product = availableProducts.find((item) => item.idProducto === p.idProducto);
                          return (
                            <div key={p.idProducto} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-3xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                              <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                  {product?.nombre || `Producto ${p.idProducto}`}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Cantidad: {p.cantidad}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  min={1}
                                  value={p.cantidad}
                                  onChange={(e) => {
                                    const value = Number(e.target.value);
                                    if (value > 0) {
                                      setFormData((prev) => ({
                                        ...prev,
                                        productos: prev.productos.map((item) =>
                                          item.idProducto === p.idProducto ? { ...item, cantidad: value } : item
                                        ),
                                      }));
                                    }
                                  }}
                                  className="w-24 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  disabled={isLoading}
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      productos: prev.productos.filter((item) => item.idProducto !== p.idProducto),
                                    }))
                                  }
                                  className="rounded-2xl bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
                                >
                                  Quitar
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="rounded-3xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                        No has agregado productos todavía.
                      </div>
                    )}
                  </div>
                )}

                {productMode === 'manual' && (
                  <div className="rounded-3xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-6 text-sm text-gray-500 dark:text-gray-400">
                    Seleccionaste crear la rifa sin productos.
                  </div>
                )}

                {productMode === 'keep' && (
                  <div className="rounded-3xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-6 text-sm text-blue-700 dark:text-blue-300">
                    Mantendrás los productos actuales de la rifa. Si quieres cambiarlos, selecciona otra opción.
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <DropzoneImage
                  value={formData.imagenPrincipal}
                  onChange={(url) => setFormData((prev) => ({ ...prev, imagenPrincipal: url }))}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-3xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? 'Guardando...' : modo === 'crear' ? 'Crear rifa' : 'Actualizar rifa'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/admin/Rifas')}
                  disabled={isLoading}
                  className="w-full rounded-3xl border border-gray-300 bg-white dark:bg-gray-900 px-5 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}