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
      </div>
    </section>
  );
};