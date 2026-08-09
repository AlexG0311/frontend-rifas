import type { AuthServiceParams, AuthServiceResponse } from '../types/auth.type';
import type { ApiResponse } from '../types/api.type';

export const AuthService = async ({ correo, password }: AuthServiceParams) => {
  const response = await fetch(`http://localhost:3000/api/admin/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      correo,
      password,
    }),
  });
  const data: ApiResponse<AuthServiceResponse> = await response.json();
  return data.data;
};

export const Authme = async () => {
  const response = await fetch(`http://localhost:3000/api/admin/auth/me`, {
    method: 'GET',
    credentials: 'include',
  });
  const data: ApiResponse<AuthServiceResponse> = await response.json();
  return data.data;
};

export const CerrarSesion = async (): Promise<void> => {
  const response = await fetch('http://localhost:3000/api/admin/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('No se pudo cerrar la sesión');
  }
};