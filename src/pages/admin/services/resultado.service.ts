// services/resultado.service.ts
import type {
  RegistrarSorteoPayload,
  RegistrarSorteoResponse,
  ProcesarResultadoPayload,
  ProcesarResultadoResponse,
  DeclararGanadorResponse,
  ActualizarEntregaPayload,
  ActualizarEntregaResponse,
  GanadorPublicoResponse,
  ResultadoRifaResponse,
} from '../types/resultado.type';

const API_URL = 'http://localhost:3000/api';

// Helper para manejar respuestas
export class ApiError extends Error {
  errorCode?: string;
  constructor(message: string, errorCode?: string) {
    super(message);
    this.name = 'ApiError';
    this.errorCode = errorCode;
  }
}

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


// Helper para crear headers con auth
const getHeaders = (withBody: boolean = true): HeadersInit => {
  const headers: HeadersInit = {};

  if (withBody) {
    headers['Content-Type'] = 'application/json';
  }

  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// ─── Endpoint 1: Registrar Sorteo de una Rifa ───
// POST /rifas/:uuidPublico/sorteo
export const registrarSorteoRifa = async (
  uuidPublico: string,
  payload: RegistrarSorteoPayload
): Promise<RegistrarSorteoResponse> => {
  try {
    const response = await fetch(`${API_URL}/rifas/${uuidPublico}/sorteo`, {
      method: 'POST',
      credentials: 'include',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse<RegistrarSorteoResponse>(response);
  } catch (error) {
    console.error('Error al registrar sorteo de rifa:', error);
    throw error;
  }
};

// ─── Endpoint 2: Procesar Resultado Oficial de Lotería (Masivo) ───
// POST /loterias/resultados/procesar
export const procesarResultadoLoteria = async (
  payload: ProcesarResultadoPayload
): Promise<ProcesarResultadoResponse> => {
  try {
    const response = await fetch(`${API_URL}/loterias/resultados/procesar`, {
      method: 'POST',
      credentials: 'include',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse<ProcesarResultadoResponse>(response);
  } catch (error) {
    console.error('Error al procesar resultado de lotería:', error);
    throw error;
  }
};

// ─── Endpoint 3: Declarar Ganador de la Rifa ───
// POST /rifas/:uuidPublico/declarar-ganador
export const declararGanador = async (
  uuidPublico: string
): Promise<DeclararGanadorResponse> => {
  try {
    const response = await fetch(`${API_URL}/rifas/${uuidPublico}/declarar-ganador`, {
      method: 'POST',
      credentials: 'include',
      headers: getHeaders(false),
    });
    return handleResponse<DeclararGanadorResponse>(response);
  } catch (error) {
    console.error('Error al declarar ganador:', error);
    throw error;
  }
};

// ─── Endpoint 4: Actualizar Estado de Entrega del Premio ───
// PATCH /rifas/:uuidPublico/ganador/entrega
export const actualizarEntrega = async (
  uuidPublico: string,
  payload: ActualizarEntregaPayload
): Promise<ActualizarEntregaResponse> => {
  try {
    const response = await fetch(`${API_URL}/rifas/${uuidPublico}/ganador/entrega`, {
      method: 'PATCH',
      credentials: 'include',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse<ActualizarEntregaResponse>(response); 
  } catch (error) {
    console.error('Error al actualizar entrega:', error);
    throw error;
  }
};

// ─── Endpoint 5: Obtener el Ganador de una Rifa (Público) ───
// GET /rifas/:uuidPublico/ganador
export const getGanadorRifa = async (
  uuidPublico: string
): Promise<GanadorPublicoResponse | null> => {
  try {
    const response = await fetch(`${API_URL}/rifas/${uuidPublico}/ganador`, {
      method: 'GET',
      credentials: 'include',
    });

     // 404 = aún no hay ganador declarado para esta rifa, es un estado válido, no un error
    if (response.status === 404) {
      return null;
    }
    
    return handleResponse<GanadorPublicoResponse>(response);
  } catch (error) {
    console.error('Error al obtener ganador de rifa:', error);
    throw error;
  }
};

// ─── Endpoint 6: Obtener el Resultado Oficial de la Rifa (Público) ───
// GET /rifas/:uuidPublico/resultado
export const getResultadoRifa = async (
  uuidPublico: string
): Promise<ResultadoRifaResponse | null> => {
  try {
    const response = await fetch(`${API_URL}/rifas/${uuidPublico}/resultado`, {
      method: 'GET',
      credentials: 'include',
    });

    // 404 = la rifa aún no tiene resultado registrado, es un estado válido, no un error
    if (response.status === 404) {
      return null;
    }

    return handleResponse<ResultadoRifaResponse>(response);
  } catch (error) {
    console.error('Error al obtener resultado de rifa:', error);
    throw error;
  }
};
