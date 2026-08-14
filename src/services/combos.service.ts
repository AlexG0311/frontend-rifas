import { ApiError } from '../pages/admin/services/resultado.service';// reutiliza la misma clase de error ya existente
import type { ComboPayload, ComboResponse } from '../types/combo.type';

const API_URL = `${import.meta.env.VITE_API_URL}/api/combos`;

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.error || errorData.message || `Error ${response.status}: ${response.statusText}`,
      errorData.errorCode
    );
  }
  const data = await response.json();
  return data.data || data;
};

const getHeaders = (withBody: boolean = true): HeadersInit => {
  const headers: HeadersInit = {};
  if (withBody) headers['Content-Type'] = 'application/json';
  const token = localStorage.getItem('token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

// Público — usado en RifaPage
export const getCombosRifa = async (uuidRifa: string): Promise<ComboResponse[]> => {
  const response = await fetch(`${API_URL}/rifas/${uuidRifa}/publicos`, {
    method: 'GET',
    credentials: 'include',
  });
  if (response.status === 404) return [];
  return handleResponse<ComboResponse[]>(response);
};

// Admin — todos los combos (incluye inactivos)
export const getCombosAdmin = async (uuidRifa: string): Promise<ComboResponse[]> => {
  const response = await fetch(`${API_URL}/admin/rifas/${uuidRifa}`, {
    method: 'GET',
    credentials: 'include',
    headers: getHeaders(false),
  });
  if (response.status === 404) return [];
  return handleResponse<ComboResponse[]>(response);
};

export const crearComboRifa = async (uuidRifa: string, payload: ComboPayload): Promise<ComboResponse> => {
  const response = await fetch(`${API_URL}/crear/admin/rifas/${uuidRifa}`, {
    method: 'POST',
    credentials: 'include',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse<ComboResponse>(response);
};

export const actualizarComboRifa = async (uuidCombo: string, payload: Partial<ComboPayload>): Promise<ComboResponse> => {
  const response = await fetch(`${API_URL}/actualizar/admin/${uuidCombo}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse<ComboResponse>(response);
};

export const eliminarComboRifa = async (uuidCombo: string): Promise<void> => {
  const response = await fetch(`${API_URL}/borrar/admin/${uuidCombo}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: getHeaders(false),
  });
  await handleResponse<void>(response);
};