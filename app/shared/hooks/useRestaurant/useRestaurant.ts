import { useEffect, useState } from 'react';
import { IRestaurantData } from '@/app/shared/@types';
import { getRestaurantById } from '@/app/shared/service';

export const useRestaurant = (restaurantId: string | undefined) => {
  const [restaurant, setRestaurant] = useState<IRestaurantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!restaurantId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const fetchedRestaurant = await getRestaurantById(restaurantId);
        setRestaurant(fetchedRestaurant);
      } catch (error) {
        console.error("Erro ao buscar restaurante:", error);
        setError(error instanceof Error ? error : new Error('Erro desconhecido'));
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [restaurantId]);

  return { restaurant, loading, error };
};