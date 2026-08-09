import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRifas, useEliminarRifa } from './hooks/useRifas';
import type { RifaResponse } from '../../types/rifa.type';
import { formatFechaCol, formatFechaHoraCol } from '../../utils/date.utils';

export const RifasList: React.FC = () => {
  const navigate = useNavigate();
  const { rifas, isLoading, error, loadRifas } = useRifas();
  const { eliminarRifa, isLoading: isDeleting } = useEliminarRifa();
  const [deleteError, setDeleteError] = React.useState<string | null>(null);

  const handleDelete = async (uuidPublico: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta rifa?')) return;

    setDeleteError(null);
    try {
      const success = await eliminarRifa(uuidPublico);
      if (success) {
        await loadRifas();
      }
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : 'Error al eliminar la rifa');
    }
  };

  const handleEdit = (rifa: RifaResponse) => {
    navigate(`/admin/Rifas/editar/${rifa.uuidPublico}`);
  };

  const handleCreate = () => {
    navigate('/admin/Rifas/crear');
  };

  const getEstadoColor = (estado: string) => {
    const colores: Record<string, string> = {
      'activa': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'sorteada': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'pendiente': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      'finalizada': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'cancelada': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };
    return colores[estado.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando rifas...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Rifas</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Gestiona todas las rifas disponibles</p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nueva Rifa
        </button>
      </div>

      {deleteError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
          {deleteError}
        </div>
      )}

      {rifas.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 dark:bg-gray-800/50 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">No hay rifas disponibles</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Crea tu primera rifa haciendo clic en "Nueva Rifa"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rifas.map((rifa) => (
            <div
              key={rifa.uuidPublico}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-none dark:border dark:border-gray-700 overflow-hidden hover:shadow-lg dark:hover:border-gray-600 transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{rifa.titulo}</h2>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEstadoColor(rifa.estado.nombre)}`}>
                    {rifa.estado.nombre}
                  </span>
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {rifa.descripcion || 'Sin descripción'}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Loteria:</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">{rifa.loteria.nombre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Precio por número:</span>
                    <span className="font-medium text-green-600 dark:text-green-400">${rifa.precioNumero}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Números:</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {rifa.numeroInicial} - {rifa.numeroFinal}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Disponibles:</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {rifa.numerosDisponibles} / {rifa.totalNumeros}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500">
                    <span>Cierre: {formatFechaHoraCol(rifa.fechaCierre)}</span>
                    <span>Sorteo: {formatFechaCol(rifa.fechaSorteo)}</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(rifa)}
                    className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 transition-colors text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(rifa.uuidPublico)}
                    disabled={isDeleting}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? '...' : 'Eliminar'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};