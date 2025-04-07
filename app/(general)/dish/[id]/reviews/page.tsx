"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getReviewsByDishId } from "@/app/shared/service/api/ReviewsApi";
import { getDishById } from "@/app/shared/service/api/DishApi";
import styles from "./reviews.module.scss";
import { FaStar } from "react-icons/fa";
import { IReview } from "@/app/shared/@types";
import { RatingModal } from "@/app/shared/components/RatingModal/RatingModal";
import { useAuthContext } from "@/app/shared/contexts";

export default function DishReviews({ params }: { params: { id: string } }) {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dishName, setDishName] = useState("Prato");
  const [isRestaurantOwner, setIsRestaurantOwner] = useState(false);
  const router = useRouter();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedReviews, dish] = await Promise.all([
          getReviewsByDishId(params.id),
          getDishById(params.id),
        ]);

        // Verifica se o usuário é dono do restaurante do prato
        if (user?.restaurants && user.restaurants.length > 0) {
          const isOwner = user.restaurants.some(
            (r) => r.id === dish.restaurantId
          );
          setIsRestaurantOwner(isOwner);
        }

        const sortedReviews = [...fetchedReviews].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setReviews(sortedReviews);
        setDishName(dish.name);
      } catch (error) {
        setError("Erro ao carregar avaliações");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id, user]);

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={`${styles.star} ${index < rating ? styles.active : ""}`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    const fetchReviews = async () => {
      try {
        const fetchedReviews = await getReviewsByDishId(params.id);
        const sortedReviews = [...fetchedReviews].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setReviews(sortedReviews);
      } catch (error) {
        console.error("Error refreshing reviews:", error);
      }
    };
    fetchReviews();
  };

  if (loading) {
    return <div className={styles.loading}>Carregando avaliações...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => router.back()}>
          ← Voltar
        </button>
        <div className={styles.titleContainer}>
          <h1>Avaliações do Prato</h1>
          {!isRestaurantOwner && (
            <button
              className={styles.addReviewButton}
              onClick={handleOpenModal}
            >
              Adicionar Avaliação
            </button>
          )}
        </div>
      </div>

      <div className={styles.reviewsList}>
        {reviews.length === 0 ? (
          <p className={styles.noReviews}>
            Ainda não há avaliações para este prato.
          </p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className={styles.reviewCard}>
              <div className={styles.reviewHeader}>
                <div className={styles.stars}>{renderStars(review.rating)}</div>
                <span className={styles.date}>
                  {formatDate(review.createdAt)}
                </span>
              </div>
              <p className={styles.description}>{review.description}</p>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <RatingModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          dishId={params.id}
          dishName={dishName}
        />
      )}
    </div>
  );
}
