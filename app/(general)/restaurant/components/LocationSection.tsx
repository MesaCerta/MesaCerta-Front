import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import styles from '@/app/(general)/restaurant/[id]/restaurantDetails.module.scss';

export const LocationSection: React.FC = () => {
  return (
    <section className={styles.infoSection}>
      <div className={styles.location}>
        <h2>Localização e contato</h2>
        <div className={styles.contactInfo}>
          <p>
            <FaMapMarkerAlt />
            Padre Orcolaga, 56, 20008 Donostia-San Sebastián Espanha
          </p>
          <p>
            <FaPhone />
            +55 87 9 9999 9999
          </p>
          <p>
            <FaEnvelope />
            Site
          </p>
          <p>
            <FaEnvelope />
            Email
          </p>
        </div>
        <button className={styles.reserveButton}>Reserve Aqui</button>
      </div>
    </section>
  );
};