import { useState, useEffect } from "react";
import { getNumerosRifa } from "../services/rifa.service";
import type { NumeroRifa } from "../types/rifa.types";

export function useNumerosRifa(uuidRifa: string | null) {
  const [numeros, setNumeros] = useState<NumeroRifa[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    if (!uuidRifa) return;

    setLoading(true);
    setError(null);
    getNumerosRifa(uuidRifa)
      .then(setNumeros)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [uuidRifa]);

  return { numeros, loading, error };
}
