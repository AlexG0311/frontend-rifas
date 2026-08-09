import { type ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ContextAuth } from './createContext';
import { CerrarSesion } from '../services/auth.service';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { adminAutorizaded, isLoading } = useAuth();

  // Mientras se verifica la sesión, no renderizamos nada (o un spinner)
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }
  return (
    <ContextAuth.Provider
      value={{
        admin: adminAutorizaded ?? null, 
        isAuthenticated: !!adminAutorizaded?.idAdministrador,
        cerrarSesion: CerrarSesion,
      }}
    >
      {children}
    </ContextAuth.Provider>
  );
};