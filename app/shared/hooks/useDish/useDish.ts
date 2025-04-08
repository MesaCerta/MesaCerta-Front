import { useEffect, useState, useCallback } from "react";
import { IDishData } from "@/app/shared/@types";
import { getDishById } from "@/app/shared/service";

export const useDish = (dishId: string | undefined) => {
  const [dish, setDish] = useState<IDishData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDish = useCallback(async () => {
    if (!dishId) {
      setLoading(false);
      setDish(null);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const fetchedDish = await getDishById(dishId);
      setDish(fetchedDish);
    } catch (err) {
      console.error("Erro ao buscar dish:", err);
      setError(err instanceof Error ? err : new Error("Erro desconhecido"));
      setDish(null);
    } finally {
      setLoading(false);
    }
  }, [dishId]);

  useEffect(() => {
    fetchDish();
  }, [fetchDish]);

  return { dish, loading, error, refetch: fetchDish };
};
