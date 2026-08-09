// services/rifa.service.ts
import type {
  RifaCreatePayload,
  RifaUpdatePayload,
  RifaEstadoPayload,
  RifaResponse,
  RifasListResponse,
  NumeroRifaResponse,
} from '../types/rifa.type';

const API_URL =  'http://localhost:3000/api';

// Helper para manejar respuestas
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }
  const data = await response.json();
  return data.data || data;
};

// Helper para crear headers
const getHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  // Si tienes token de autenticación
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Obtener todas las rifas
export const getRifas = async (): Promise<RifasListResponse> => {
  try {
    const response = await fetch(`${API_URL}/rifas/admin`, {
      credentials: "include",
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse<RifasListResponse>(response);
  } catch (error) {
    console.error('Error al obtener rifas:', error);
    throw error;
  }
};

// Obtener una rifa por UUID
export const getRifaByUuid = async (uuidPublico: string): Promise<RifaResponse> => {
  try {
    const response = await fetch(`${API_URL}/rifas/${uuidPublico}`, {
      credentials: "include",
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse<RifaResponse>(response);
  } catch (error) {
    console.error('Error al obtener rifa:', error);
    throw error;
  }
};

// Obtener números de una rifa
export const getNumerosRifa = async (uuidRifa: string): Promise<NumeroRifaResponse[]> => {
  try {
    const response = await fetch(`${API_URL}/rifas/${uuidRifa}/numeros`, {
      credentials: "include",
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse<NumeroRifaResponse[]>(response);
  } catch (error) {
    console.error('Error al obtener números de rifa:', error);
    throw error;
  }
};

// Crear una nueva rifa
export const createRifa = async (data: RifaCreatePayload): Promise<RifaResponse> => {
  try {
    const response = await fetch(`${API_URL}/rifas`, {
      method: 'POST',
      credentials: 'include',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<RifaResponse>(response);
  } catch (error) {
    console.error('Error al crear rifa:', error);
    throw error;
  }
};

// Actualizar una rifa (PATCH)
export const updateRifa = async (
  uuidPublico: string,
  data: RifaUpdatePayload
): Promise<RifaResponse> => {
  try {
    const response = await fetch(`${API_URL}/rifas/${uuidPublico}`, {
      method: 'PATCH',
      credentials: "include",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<RifaResponse>(response);
  } catch (error) {
    console.error('Error al actualizar rifa:', error);
    throw error;
  }
};

// Cambiar estado de una rifa
export const cambiarEstadoRifa = async (
  uuidPublico: string,
  data: RifaEstadoPayload
): Promise<RifaResponse> => {
  try {
    const response = await fetch(`${API_URL}/rifas/${uuidPublico}/estado`, {
      method: 'PATCH',
      credentials: "include",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<RifaResponse>(response);
  } catch (error) {
    console.error('Error al cambiar estado de rifa:', error);
    throw error;
  }
};

// Eliminar una rifa
export const deleteRifa = async (uuidPublico: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/rifas/${uuidPublico}`, {
      credentials: 'include',
      method: 'DELETE',
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error al eliminar rifa:', error);
    throw error;
  }
};

// Función adicional: Obtener rifas por estado
export const getRifasByEstado = async (idEstadoRifa: number): Promise<RifasListResponse> => {
  try {
    const response = await fetch(`${API_URL}/rifas?estado=${idEstadoRifa}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse<RifasListResponse>(response);
  } catch (error) {
    console.error('Error al obtener rifas por estado:', error);
    throw error;
  }
};

// Función adicional: Obtener estadísticas de rifa
export const getRifaEstadisticas = async (uuidPublico: string) => {
  try {
    const response = await fetch(`${API_URL}/rifas/${uuidPublico}/estadisticas`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error al obtener estadísticas de rifa:', error);
    throw error;
  }
};