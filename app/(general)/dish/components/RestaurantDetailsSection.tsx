"use client";

import React, { useEffect, useState } from "react";
import styles from "@/app/(general)/dish/[id]/dishDetails.module.scss";
import { useRouter } from "next/navigation";
import {
  IRestaurantDetailsSectionProps,
  IRestaurantData,
} from "@/app/shared/@types";
import { getRestaurantById } from "@/app/shared/service/api/RestaurantApi";

export const RestaurantDetailsSection: React.FC<
  IRestaurantDetailsSectionProps
> = ({ restaurantId }) => {
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<IRestaurantData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        setIsLoading(true);
        if (restaurantId) {
          const response = await getRestaurantById(restaurantId);
          if (!("error" in response)) {
            setRestaurant(response);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do restaurante:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [restaurantId]);

  const handleNavigate = () => {
    if (restaurantId) {
      router.push(`/restaurant/${restaurantId}`);
    }
  };

  return (
    <section className={styles.infoSection}>
      <div className={styles.location}>
        <h2>Acessar detalhes do restaurante</h2>
        <div className={styles.contactInfo}>
          {isLoading ? (
            <p>Carregando...</p>
          ) : restaurant ? (
            <p>{restaurant.name}</p>
          ) : (
            <p>Restaurante não encontrado</p>
          )}
        </div>
        <button className={styles.reserveButton} onClick={handleNavigate}>
          Mais detalhes
        </button>
      </div>
    </section>
  );
};
