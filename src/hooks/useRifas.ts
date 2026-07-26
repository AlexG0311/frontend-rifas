import { useState, useEffect } from "react";
import { getRifas } from "../services/rifa.service";
import type { Rifa } from "../types/rifa.types";

export function useRifas() {
  const [rifas, setRifas] = useState<Rifa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getRifas()
      .then(setRifas)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { rifas, loading, error };
}
