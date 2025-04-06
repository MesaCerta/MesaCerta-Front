"use client";

import React from "react";
import styles from "@/app/(general)/dish/[id]/dishDetails.module.scss";
import { useRouter } from "next/navigation";
import { IRestaurantDetailsSectionProps } from "@/app/shared/@types";

export const RestaurantDetailsSection: React.FC<
  IRestaurantDetailsSectionProps
> = ({ restaurantId }) => {
  const router = useRouter();

  const handleNavigate = () => {
    router.push(`/restaurant/${restaurantId}`);
  };

  return (
    <section className={styles.infoSection}>
      <div className={styles.location}>
        <h2>Acessar detalhes do restaurante</h2>
        <div className={styles.contactInfo}></div>
        <button className={styles.reserveButton} onClick={handleNavigate}>
          Mais detalhes
        </button>
      </div>
    </section>
  );
};
