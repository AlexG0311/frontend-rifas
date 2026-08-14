import type { CompraResponse } from '../types/compra.type';

const API_URL = `${import.meta.env.VITE_API_URL}/api`;
import { ApiError } from '../pages/admin/services/resultado.service';// reutiliza la misma clase de error ya existente
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

export const crearCompra = async (uuidPublico:string): Promise<CompraResponse> => {
  const response = await fetch(`${API_URL}/reservas/${uuidPublico}/comprar`, {
    method: 'POST',
    credentials: 'include',
    headers: {
        'Content-Type':'application/json'
    }
  });
  return handleResponse<CompraResponse>(response);
};

export const getCompra = async (uuidPublico: string): Promise<CompraResponse> => {
  const response = await fetch(`${API_URL}/compras/${uuidPublico}`, {
    method: 'GET',
    credentials: 'include',
  });
  return handleResponse<CompraResponse>(response);
};