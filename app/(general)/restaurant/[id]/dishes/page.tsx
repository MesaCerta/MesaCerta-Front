"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getDishByRestaurantId } from "@/app/shared/service/api/DishApi";
import { getRestaurantById } from "@/app/shared/service/api/RestaurantApi";
import { IDishData, IRestaurantData } from "@/app/shared/@types";
import styles from "./dishes.module.scss";
import { FaStar } from "react-icons/fa";
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
  const router = useRouter();
  const { user } = useAuthContext();
  const [selectedDish, setSelectedDish] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedDishes, fetchedRestaurant] = await Promise.all([
          getDishByRestaurantId(params.id),
          getRestaurantById(params.id),
        ]);
        setDishes(fetchedDishes);
        setRestaurant(fetchedRestaurant);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [params.id]);

  const handleDishClick = (dishId: string | undefined) => {
    if (dishId) {
      router.push(`/dish/${dishId}`);
    }
  };

  const handleRateClick = (e: React.MouseEvent, dish: IDishData) => {
    e.stopPropagation();
    setSelectedDish({ id: dish.id!, name: dish.name });
  };

  const handleCloseModal = () => {
    setSelectedDish(null);
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleAddSuccess = () => {
    // Recarrega os pratos após adicionar um novo
    getDishByRestaurantId(params.id).then(setDishes);
  };

  // Verifica se o usuário é o dono do restaurante
  const isRestaurantOwner =
    user?.restaurants?.some((r) => r.id === params.id) ?? false;

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
        {dishes.map((dish) => (
          <div
            key={dish.id}
            className={styles.dishCard}
            onClick={() => handleDishClick(dish.id)}
          >
            <div className={styles.dishInfo}>
              <h3>{dish.name}</h3>
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
            <div className={styles.dishImage}>
              {dish.image ? (
                <Image
                  src={dish.image}
                  alt={dish.name}
                  width={96}
                  height={96}
                  objectFit="cover"
                />
              ) : (
                <Image
                  src="/dish_default.jpg"
                  alt={dish.name}
                  width={96}
                  height={96}
                  objectFit="cover"
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedDish && (
        <RatingModal
          isOpen={true}
          onClose={handleCloseModal}
          dishId={selectedDish.id}
          dishName={selectedDish.name}
        />
      )}

      <AddDishModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSuccess={handleAddSuccess}
      />
    </div>
  );
}
