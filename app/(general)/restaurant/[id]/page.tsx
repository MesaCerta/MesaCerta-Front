"use client";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import styles from "./restaurantDetails.module.scss";
import { useRestaurant } from "@/app/shared/hooks/useRestaurant/useRestaurant";
import { DetailsSection } from "../components/DetailsSection";
import { Header } from "../components/Header";
import { ImageGallery } from "../components/ImageGallery";
import { LocationSection } from "../components/LocationSection";
import { RatingsSection } from "../components/RatingsSection";
import { useAuthContext } from "@/app/shared/contexts";
import { RestaurantRegistrationModal } from "@/app/shared/components/RestaurantRegistrationModal/RestaurantRegistrationModal";

const RestaurantDetails = () => {
  const pathname = usePathname();
  const restaurantId = pathname.split("/").pop();
  const { user } = useAuthContext();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { restaurant, error, loading, refetch } = useRestaurant(restaurantId);

  const isOwner =
    user?.restaurants?.some((r) => r.id === restaurantId) ?? false;

  if (loading) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>Erro ao carregar dados do restaurante</div>
    );
  }

  if (!restaurant || !restaurant.id) {
    return <div className={styles.notFound}>Restaurante não encontrado</div>;
  }

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleUpdateSuccess = () => {
    handleCloseEditModal();
    refetch();
  };

  return (
    <div className={styles.container}>
      <Header
        restaurantName={restaurant.name}
        onEditClick={isOwner ? handleEditClick : undefined}
      />

      <ImageGallery
        image={restaurant.image || ""}
        restaurantName={restaurant.name}
      />

      <div className={styles.content}>
        <RatingsSection item={restaurant} />
        <DetailsSection
          phone={restaurant.phone}
          schedule={restaurant.schedule}
          restaurantId={restaurant.id}
        />
        <LocationSection
          address={restaurant.address}
          phone={restaurant.phone}
          schedule={restaurant.schedule}
          restaurantName={restaurant.name}
        />
      </div>

      {isEditModalOpen && (
        <RestaurantRegistrationModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onUpdateSuccess={handleUpdateSuccess}
          isEditMode={true}
          restaurantData={restaurant}
        />
      )}
    </div>
  );
};

export default RestaurantDetails;
