import { useEffect, useState } from "react";
import { IDishData } from "@/app/shared/@types";
import { getDishById } from "@/app/shared/service";

export const useDish = (dishId: string | undefined) => {
  const [dish, setDish] = useState<IDishData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDish = async () => {
      if (!dishId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const fetchedDish = await getDishById(dishId);
        setDish(fetchedDish);
      } catch (error) {
        console.error("Erro ao buscar dish:", error);
        setError(
          error instanceof Error ? error : new Error("Erro desconhecido")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDish();
  }, [dishId]);

  return { dish, loading, error };
};
