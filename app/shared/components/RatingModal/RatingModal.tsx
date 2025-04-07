"use client";

import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import styles from "./RatingModal.module.scss";
import { createReviewDish } from "@/app/shared/service/api/ReviewsApi";
import { useAuthContext } from "../../contexts";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  dishId: string;
  dishName: string;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  dishId,
  dishName,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthContext();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!rating) {
      setError("Por favor, selecione uma classificação");
      return;
    }

    if (!description.trim()) {
      setError("Por favor, adicione um comentário");
      return;
    }

    if (!user?.id) {
      setError("Você precisa estar logado para avaliar");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createReviewDish({
        rating,
        description,
        userId: user.id,
        dishId,
      });

      if ("error" in response) {
        setError(response.error);
      } else {
        onClose();
      }
    } catch (err) {
      setError("Erro ao enviar avaliação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Avaliar {dishName}</h2>

        <div className={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`${styles.star} ${
                (hover || rating) >= star ? styles.active : ""
              }`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            />
          ))}
        </div>

        <textarea
          className={styles.commentInput}
          placeholder="Conte-nos sua experiência com este prato..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.buttons}>
          <button
            className={styles.cancelButton}
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={isSubmitting || Boolean(error)}
          >
            {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
          </button>
        </div>
      </div>
    </div>
  );
};
