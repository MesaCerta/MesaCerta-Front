"use client";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import styles from "./dishDetails.module.scss";
import { ImageGallery } from "../../restaurant/components/ImageGallery";
import { Header } from "../../restaurant/components/Header";
import { useDish } from "@/app/shared/hooks/useDish/useDish";
import { RestaurantDetailsSection } from "../components/RestaurantDetailsSection";
import { DishRatingsSection } from "../components/DishRatingsSection";
import { IRestaurantData } from "@/app/shared/@types";
import { getRestaurantById } from "@/app/shared/service";
import { RestaurantLocationSection } from "../components/RestaurantLocationSection";

const DishDetails = () => {
  const pathname = usePathname();
  const dishId = pathname.split("/").pop();

  const { dish, error } = useDish(dishId);

  const [restaurant, setRestaurant] = useState<IRestaurantData | null>(null);

  useEffect(() => {
    if (dish?.restaurantId) {
      getRestaurantById(dish.restaurantId)
        .then((data) => setRestaurant(data))
        .catch((err) => console.error("Erro ao buscar restaurante:", err));
    }
  }, [dish?.restaurantId]);

  if (error) {
    return <div className={styles.error}>Erro ao carregar dados do prato</div>;
  }

  if (!dish) {
    return <div className={styles.notFound}>Prato não encontrado</div>;
  }

  return (
    <div className={styles.container}>
      <Header restaurantName={dish.name} />

      <ImageGallery image={dish.image || ""} restaurantName={dish.name} />

      <div className={styles.content}>
        <DishRatingsSection item={dish} />
        <RestaurantDetailsSection restaurantId={dish.restaurantId} />
        <RestaurantLocationSection
          address={restaurant?.address!}
          phone={restaurant?.phone!}
          schedule={restaurant?.schedule!}
          restaurantName={restaurant?.name!}
          dishName={dish.name}
        />
      </div>
    </div>
  );
};

export default DishDetails;
