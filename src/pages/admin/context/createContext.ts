import { createContext } from 'react';

export type Admin = {
  idAdministrador: string;
  idRol: number;
  idEstadoAdministrador: number;
  correo: string;
  nombre: string;
  rol: string; // <-- Es un string plano como "SUPERADMIN"

};

export type PropsContext = {
  admin: Admin | null;
  isAuthenticated: boolean;
  cerrarSesion: () => Promise<void>;
};  

export const ContextAuth = createContext<PropsContext | null>(null);