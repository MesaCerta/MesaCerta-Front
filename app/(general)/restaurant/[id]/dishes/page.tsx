"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getDishByRestaurantId } from "@/app/shared/service/api/DishApi";
import { IDishData } from "@/app/shared/@types";
import styles from "./dishes.module.scss";
import { FaStar } from "react-icons/fa";
import { RatingModal } from "@/app/shared/components/RatingModal/RatingModal";

export default function RestaurantDishes({ params }: { params: { id: string } }) {
  const [dishes, setDishes] = useState<IDishData[]>([]);
  const router = useRouter();
  const [selectedDish, setSelectedDish] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const fetchedDishes = await getDishByRestaurantId(params.id);
        setDishes(fetchedDishes);
      } catch (error) {
        console.error("Error fetching dishes:", error);
      }
    };

    fetchDishes();
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

  return (
    <div className={styles.container}>
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
                <button 
                  className={styles.rateButton}
                  onClick={(e) => handleRateClick(e, dish)}
                >
                  <FaStar /> Avaliar
                </button>
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
    </div>
  );
} 