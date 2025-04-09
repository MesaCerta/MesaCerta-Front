"use client";
import { usePathname } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import styles from "./dishDetails.module.scss";
import { ImageGallery } from "../../restaurant/components/ImageGallery";
import { Header } from "../../restaurant/components/Header";
import { useDish } from "@/app/shared/hooks/useDish/useDish";
import { RestaurantDetailsSection } from "../components/RestaurantDetailsSection";
import { DishRatingsSection } from "../components/DishRatingsSection";
import { IRestaurantData, IDishData } from "@/app/shared/@types";
import { getRestaurantById } from "@/app/shared/service";
import { RestaurantLocationSection } from "../components/RestaurantLocationSection";
import { useAuthContext } from "@/app/shared/contexts";
import AddDishModal from "@/app/(general)/dish/components/AddDishModal";

const DishDetails = () => {
  const pathname = usePathname();
  const dishId = pathname.split("/").pop();

  const {
    dish,
    error: dishError,
    loading: dishLoading,
    refetch: refetchDish,
  } = useDish(dishId);

  const [restaurant, setRestaurant] = useState<IRestaurantData | null>(null);
  const [loadingRestaurant, setLoadingRestaurant] = useState(true);
  const { user } = useAuthContext();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (dish?.restaurantId) {
      setLoadingRestaurant(true);
      getRestaurantById(dish.restaurantId)
        .then((data) => setRestaurant(data))
        .catch((err) => {
          console.error("Erro ao buscar restaurante:", err);
          setRestaurant(null);
        })
        .finally(() => setLoadingRestaurant(false));
    }
  }, [dish?.restaurantId]);

  const isOwner =
    user?.restaurants?.some((r) => r.id === dish?.restaurantId) ?? false;

  const handleOpenEditModal = () => {
    if (dish) {
      setIsEditModalOpen(true);
    }
  };

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
  }, []);

  const handleUpdateSuccess = useCallback(() => {
    handleCloseEditModal();
    refetchDish();
  }, [handleCloseEditModal, refetchDish]);

  if (dishLoading || loadingRestaurant) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  if (dishError) {
    return <div className={styles.error}>Erro ao carregar dados do prato</div>;
  }

  if (!dish) {
    return <div className={styles.notFound}>Prato não encontrado</div>;
  }

  return (
    <div className={styles.container}>
      <Header
        restaurantName={dish.name}
        onEditClick={isOwner ? handleOpenEditModal : undefined}
      />

      <p className={styles.dishDescriptionMain}>{dish.description}</p>

      <ImageGallery image={dish.image || ""} restaurantName={dish.name} />

      <div className={styles.content}>
        <DishRatingsSection item={dish} />
        {restaurant && (
          <>
            <RestaurantDetailsSection restaurantId={dish.restaurantId} />
            <RestaurantLocationSection
              address={restaurant.address}
              phone={restaurant.phone}
              schedule={restaurant.schedule}
              restaurantName={restaurant.name}
              dishName={dish.name}
            />
          </>
        )}
        {!restaurant && !loadingRestaurant && (
          <p>Não foi possível carregar detalhes do restaurante.</p>
        )}
      </div>

      {dish && (
        <AddDishModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSuccess={handleUpdateSuccess}
          isEditMode={true}
          dishData={dish}
        />
      )}
    </div>
  );
};

export default DishDetails;
