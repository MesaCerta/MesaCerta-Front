import React from 'react';
import styles from '@/app/(general)/restaurant/[id]/restaurantDetails.module.scss';
import { StarRating } from './StarRating';

export const RatingsSection: React.FC = () => {
  return (
    <section className={styles.infoSection}>
      <div className={styles.ratings}>
        <h2>Pontuações e avaliações</h2>
        <div className={styles.overallRating}>
          <span className={styles.score}>4,5</span>
          <div className={styles.stars}>
            <StarRating rating={4.5} />
          </div>
          <span className={styles.totalReviews}>1.500 avaliações</span>
        </div>
        <p>Nº 48 de 682 restaurantes em Donostia-San Sebastián</p>
        <h3>Pontuações</h3>
        <div className={styles.ratingCategories}>
          <div className={styles.category}>
            <span>Comida</span>
            <div className={styles.stars}>
              <StarRating rating={4.5} />
            </div>
          </div>
          <div className={styles.category}>
            <span>Serviço</span>
            <div className={styles.stars}>
              <StarRating rating={4.5} />
            </div>
          </div>
          <div className={styles.category}>
            <span>Preço</span>
            <div className={styles.stars}>
              <StarRating rating={4} />
            </div>
          </div>
          <div className={styles.category}>
            <span>Ambiente</span>
            <div className={styles.stars}>
              <StarRating rating={4.5} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};