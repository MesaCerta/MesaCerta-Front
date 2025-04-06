"use client";
import { usePathname } from "next/navigation";
import React from "react";
import styles from "./restaurantDetails.module.scss";
import { useRestaurant } from "@/app/shared/hooks/useRestaurant/useRestaurant";
import { DetailsSection } from "../components/DetailsSection";
import { Header } from "../components/Header";
import { ImageGallery } from "../components/ImageGallery";
import { LocationSection } from "../components/LocationSection";
import { RatingsSection } from "../components/RatingsSection";

const RestaurantDetails = () => {
  const pathname = usePathname();
  const restaurantId = pathname.split("/").pop();

  const { restaurant, error } = useRestaurant(restaurantId);

  if (error) {
    return (
      <div className={styles.error}>Erro ao carregar dados do restaurante</div>
    );
  }

  if (!restaurant) {
    return <div className={styles.notFound}>Restaurante não encontrado</div>;
  }

  return (
    <div className={styles.container}>
      <Header restaurantName={restaurant.name} />

      <ImageGallery
        image={restaurant.image || ""}
        restaurantName={restaurant.name}
      />

      <div className={styles.content}>
        <RatingsSection item={restaurant} />
        <DetailsSection
          phone={restaurant.phone}
          schedule={restaurant.schedule}
        />
        <LocationSection
          address={restaurant.address}
          phone={restaurant.phone}
          schedule={restaurant.schedule}
          restaurantName={restaurant.name}
        />
      </div>
    </div>
  );
};

export default RestaurantDetails;
