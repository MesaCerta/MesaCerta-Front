"use client";

import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import styles from '../RatingModal/RatingModal.module.scss';
import { createReviewRestaurant } from '@/app/shared/service/api/ReviewsApi';
import { useAuthContext } from '../../contexts';

interface RestaurantRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantId: string;
  restaurantName: string;
}

export const RestaurantRatingModal: React.FC<RestaurantRatingModalProps> = ({
  isOpen,
  onClose,
  restaurantId,
  restaurantName,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [description, setDescription] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthContext();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!rating) {
      setError('Por favor, selecione uma classificação');
      return;
    }

    if (!description.trim()) {
      setError('Por favor, adicione um comentário');
      return;
    }

    if (!user?.id) {
      setError('Você precisa estar logado para avaliar');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createReviewRestaurant({
        rating,
        description,
        userId: user.id,
        restaurantId,
      });

      if ('error' in response) {
        setError(response.error);
      } else {
        onClose();
      }
    } catch (err) {
      setError('Erro ao enviar avaliação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <h2>Avaliar {restaurantName}</h2>
        
        <div className={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`${styles.star} ${
                (hover || rating) >= star ? styles.active : ''
              }`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            />
          ))}
        </div>

        <textarea
          className={styles.commentInput}
          placeholder="Conte-nos sua experiência com este restaurante..."
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
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Avaliação'}
          </button>
        </div>
      </div>
    </div>
  );
}; 