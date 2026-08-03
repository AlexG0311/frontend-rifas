import type { LoteriaCreatePayload, LoteriaResponse, LoteriaUpdatePayload, LoteriasListResponse } from '../types/loteria.type';

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

export const getLoterias = async (search?: string): Promise<LoteriasListResponse> => {
  try {
    const url = search
      ? `${API_URL}/loterias?search=${encodeURIComponent(search)}`
      : `${API_URL}/loterias`;

    const response = await fetch(url, {
      credentials: 'include',
      method: 'GET',
      headers: getHeaders(),
    });

    return handleResponse<LoteriasListResponse>(response);
  } catch (error) {
    console.error('Error al obtener loterías:', error);
    throw error;
  }
};

export const getLoteriaById = async (id: number): Promise<LoteriaResponse> => {
  try {
    const response = await fetch(`${API_URL}/loterias/${id}`, {
      credentials: 'include',
      method: 'GET',
      headers: getHeaders(),
    });

    return handleResponse<LoteriaResponse>(response);
  } catch (error) {
    console.error('Error al obtener la lotería:', error);
    throw error;
  }
};

export const createLoteria = async (data: LoteriaCreatePayload): Promise<LoteriaResponse> => {
  try {
    const response = await fetch(`${API_URL}/loterias`, {
      credentials: 'include',
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    return handleResponse<LoteriaResponse>(response);
  } catch (error) {
    console.error('Error al crear la lotería:', error);
    throw error;
  }
};

export const updateLoteria = async (id: number, data: LoteriaUpdatePayload): Promise<LoteriaResponse> => {
  try {
    const response = await fetch(`${API_URL}/loterias/${id}`, {
      credentials: 'include',
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    return handleResponse<LoteriaResponse>(response);
  } catch (error) {
    console.error('Error al actualizar la lotería:', error);
    throw error;
  }
};

export const deleteLoteria = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/loterias/${id}`, {
      credentials: 'include',
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error al eliminar la lotería:', error);
    throw error;
  }
};
