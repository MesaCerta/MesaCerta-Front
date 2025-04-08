"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getDishByRestaurantId } from "@/app/shared/service/api/DishApi";
import { getRestaurantById } from "@/app/shared/service/api/RestaurantApi";
import { IDishData, IRestaurantData } from "@/app/shared/@types";
import styles from "./dishes.module.scss";
import { FaStar, FaEllipsisV } from "react-icons/fa";
import { RatingModal } from "@/app/shared/components/RatingModal/RatingModal";
import { useAuthContext } from "@/app/shared/contexts";
import AddDishModal from "@/app/(general)/dish/components/AddDishModal";

export default function RestaurantDishes({
  params,
}: {
  params: { id: string };
}) {
  const [dishes, setDishes] = useState<IDishData[]>([]);
  const [restaurant, setRestaurant] = useState<IRestaurantData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuthContext();
  const [selectedDishRating, setSelectedDishRating] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingDishData, setEditingDishData] = useState<IDishData | null>(
    null
  );

  const fetchDishesAndRestaurant = useCallback(async () => {
    setLoading(true);
    try {
      const [fetchedDishes, fetchedRestaurant] = await Promise.all([
        getDishByRestaurantId(params.id),
        getRestaurantById(params.id),
      ]);
      setDishes(fetchedDishes || []);
      setRestaurant(fetchedRestaurant);
    } catch (error) {
      console.error("Error fetching data:", error);
      setDishes([]);
      setRestaurant(null);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchDishesAndRestaurant();
  }, [fetchDishesAndRestaurant]);

  const handleDishClick = (dishId: string | undefined) => {
    if (dishId) {
      router.push(`/dish/${dishId}`);
    }
  };

  const handleRateClick = (e: React.MouseEvent, dish: IDishData) => {
    e.stopPropagation();
    setSelectedDishRating({ id: dish.id!, name: dish.name });
  };

  const handleCloseRatingModal = () => {
    setSelectedDishRating(null);
  };

  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setEditingDishData(null);
    setIsDishModalOpen(true);
  };

  const handleOpenEditModal = (dish: IDishData) => {
    setIsEditMode(true);
    setEditingDishData(dish);
    setIsDishModalOpen(true);
  };

  const handleCloseDishModal = useCallback(() => {
    setIsDishModalOpen(false);
    setEditingDishData(null);
    setIsEditMode(false);
  }, []);

  const handleDishUpdateSuccess = useCallback(() => {
    handleCloseDishModal();
    fetchDishesAndRestaurant();
  }, [handleCloseDishModal, fetchDishesAndRestaurant]);

  const isRestaurantOwner =
    user?.restaurants?.some((r) => r.id === params.id) ?? false;

  if (loading) {
    return <div className={styles.loading}>Carregando pratos...</div>;
  }

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => router.back()}>
        ← Voltar
      </button>
      {isRestaurantOwner && (
        <button className={styles.addDishButton} onClick={handleOpenAddModal}>
          Adicionar Prato
        </button>
      )}
      <div className={styles.dishesList}>
        {dishes.length === 0 && !loading && (
          <p className={styles.noDishes}>Nenhum prato cadastrado ainda.</p>
        )}
        {dishes.map((dish) => (
          <div
            key={dish.id}
            className={styles.dishCard}
            onClick={
              isRestaurantOwner ? undefined : () => handleDishClick(dish.id)
            }
          >
            <div className={styles.dishInfo}>
              <div className={styles.dishHeader}>
                <h3
                  className={styles.dishTitle}
                  onClick={() => handleDishClick(dish.id)}
                >
                  {dish.name}
                </h3>
              </div>
              <p className={styles.description}>{dish.description}</p>
              <p className={styles.mealType}>Tipo: {dish.mealType}</p>
              <div className={styles.priceAndRating}>
                <p className={styles.price}>
                  R$ {Number(dish.price).toFixed(2)}
                </p>
                {!isRestaurantOwner && (
                  <button
                    className={styles.rateButton}
                    onClick={(e) => handleRateClick(e, dish)}
                  >
                    <FaStar /> Avaliar
                  </button>
                )}
              </div>
            </div>
            <div
              className={styles.dishImageContainer}
              onClick={() => handleDishClick(dish.id)}
            >
              {dish.image ? (
                <Image
                  src={dish.image}
                  alt={dish.name}
                  width={96}
                  height={96}
                  objectFit="cover"
                  className={styles.dishImage}
                />
              ) : (
                <Image
                  src="/dish_default.jpg"
                  alt={dish.name}
                  width={96}
                  height={96}
                  objectFit="cover"
                  className={styles.dishImage}
                />
              )}
              {isRestaurantOwner && (
                <button
                  className={styles.editDishIconButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEditModal(dish);
                  }}
                  aria-label="Editar prato"
                >
                  <FaEllipsisV />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedDishRating && (
        <RatingModal
          isOpen={true}
          onClose={handleCloseRatingModal}
          dishId={selectedDishRating.id}
          dishName={selectedDishRating.name}
        />
      )}

      <AddDishModal
        isOpen={isDishModalOpen}
        onClose={handleCloseDishModal}
        onSuccess={handleDishUpdateSuccess}
        isEditMode={isEditMode}
        dishData={editingDishData}
      />
    </div>
  );
}
