
export type AuthServiceParams = {
  correo: string;
  password: string;
};

export type AuthServiceResponse = {
  idAdministrador: string;
  idRol: number;
  idEstadoAdministrador: number;
  correo: string;
  nombre: string;
  rol: string; // <-- Es un string plano como "SUPERADMIN"
  iat: number;
  exp: number;
  token?: string; // Lo dejamos opcional (?) por si tu API también manda el token en este mismo objeto
  };


