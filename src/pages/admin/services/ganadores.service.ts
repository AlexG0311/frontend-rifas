import type { ApiResponse } from '../types/api.type';
import type { GanadorRifa } from '../types/ganador.type';

const API_URL = 'http://localhost:3000/api';

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  const data = await response.json().catch(() => ({}));
  return data.data || data;
};

const getHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const token = localStorage.getItem('token');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export const getGanadoresSorteo = async (): Promise<GanadorRifa[]> => {
  try {
    const response = await fetch(`${API_URL}/rifas/sorteo/ganadores`, {
      method: 'GET',
      credentials: 'include',
      headers: getHeaders(),
    });

    const result = await handleResponse<ApiResponse<GanadorRifa[]> | GanadorRifa[]>(response);
    return Array.isArray(result) ? result : result.data;
  } catch (error) {
    console.error('Error al obtener ganadores de sorteo:', error);
    throw error;
  }
};
