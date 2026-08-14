
import type { ApiResponse } from '../../types/api.type';
import type {
    DashboardAlertaView,
    DashboardCompraView,
    DashboardGanadorView,
    DashboardResumenView,
    DashboardVentaMensualView,
} from '../../types/dashboard.types';

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

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

const handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json().catch(() => ({}));
    return data.data || data;
};

const fetchDashboard = async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_URL}/dashboard${endpoint}`, {
        method: 'GET',
        credentials: 'include',
        headers: getHeaders(),
    });

    return handleResponse<ApiResponse<T> | T>(response).then((data) =>
        Array.isArray(data) || typeof data !== 'object' || data === null ? (data as T) : ((data as ApiResponse<T>).data ?? (data as T))
    );
};

export const getDashboardResumen = async (): Promise<DashboardResumenView> =>
    fetchDashboard<DashboardResumenView>('/resumen');

export const getVentasPorMes = async (): Promise<DashboardVentaMensualView[]> =>
    fetchDashboard<DashboardVentaMensualView[]>('/ventas-por-mes');

export const getUltimasCompras = async (): Promise<DashboardCompraView[]> =>
    fetchDashboard<DashboardCompraView[]>('/ultimas-compras');

export const getDashboardPendientes = async (): Promise<DashboardAlertaView[]> =>
    fetchDashboard<DashboardAlertaView[]>('/pendientes');

export const getUltimosGanadores = async (): Promise<DashboardGanadorView[]> =>
    fetchDashboard<DashboardGanadorView[]>('/ultimos-ganadores');

export const resumenDashboard = getDashboardResumen;