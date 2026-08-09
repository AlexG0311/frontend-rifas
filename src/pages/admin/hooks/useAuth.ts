import { Authme } from "../services/auth.service";
import { useState, useEffect, useCallback } from "react";
import type { AuthServiceResponse } from "../types/auth.type";

export const useAuth = () => {
  const [adminAutorizaded, setAdminAutorizated] = useState<AuthServiceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const obtenerAdminConAutorizacion = useCallback(async () => {
    try {
      setIsLoading(true);
      const adminWithAutorizacion = await Authme();
      setAdminAutorizated(adminWithAutorizacion);
    } catch (error) {
      console.error("Error al verificar autorización:", error);
      setAdminAutorizated(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    obtenerAdminConAutorizacion();
  }, [obtenerAdminConAutorizacion]);

  return { adminAutorizaded, isLoading, obtenerAdminConAutorizacion };
};