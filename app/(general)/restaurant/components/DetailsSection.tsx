import React from 'react';
import Image from 'next/image';
import styles from '@/app/(general)/restaurant/[id]/restaurantDetails.module.scss';
import { IDetailsSectionProps } from '@/app/shared/@types';

export const DetailsSection: React.FC<IDetailsSectionProps> = () => {
  return (
    <section className={styles.detailsSection}>
      <h2>Detalhes</h2>
      <div className={styles.details}>
        <div className={styles.dishesGrid}>
          <Image
            src="/dish_default.jpg"
            alt="Prato especial"
            width={100}
            height={100}
          />
          <Image
            src="/dish_default.jpg"
            alt="Prato especial"
            width={100}
            height={100}
          />
          <Image
            src="/dish_default.jpg"
            alt="Prato especial"
            width={100}
            height={100}
          />
          <Image
            src="/dish_default.jpg"
            alt="Prato especial"
            width={100}
            height={100}
          />
        </div>
      </div>
      
      <button className={styles.verPratos}>Ver Pratos</button>
    </section>
  );
};