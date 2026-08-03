
export type AuthServiceParams = {
  correo: string;
  password: string;
};

export type AuthServiceResponse = {
    token: string;
    admin: {
      idAdministrador: string;
      uuidPublico: string;
      nombre: string;
      apellido: string;
      correo: string;
      rol: { idRol: number, nombre: string };
    };
  };


