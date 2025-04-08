import { useEffect, useState, useCallback } from "react";
import { IRestaurantData } from "@/app/shared/@types";
import { getRestaurantById } from "@/app/shared/service";

export const useRestaurant = (restaurantId: string | undefined) => {
  const [restaurant, setRestaurant] = useState<IRestaurantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Wrap fetch logic in useCallback so it can be called manually
  const fetchRestaurant = useCallback(async () => {
    if (!restaurantId) {
      setLoading(false);
      setRestaurant(null); // Clear restaurant data if no ID
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null); // Clear previous errors
      const fetchedRestaurant = await getRestaurantById(restaurantId);
      setRestaurant(fetchedRestaurant);
    } catch (err) {
      // Changed error variable name to avoid conflict
      console.error("Erro ao buscar restaurante:", err);
      setError(err instanceof Error ? err : new Error("Erro desconhecido"));
      setRestaurant(null); // Clear restaurant data on error
    } finally {
      setLoading(false);
    }
  }, [restaurantId]); // Dependency array includes restaurantId

  // Initial fetch on mount or when restaurantId changes
  useEffect(() => {
    fetchRestaurant();
  }, [fetchRestaurant]); // Depend on the memoized fetchRestaurant function

  // Expose the fetch function as refetch
  return { restaurant, loading, error, refetch: fetchRestaurant };
};
