import React from 'react';
import Image from 'next/image';
import styles from '@/app/(general)/restaurant/[id]/restaurantDetails.module.scss';

export const DetailsSection: React.FC = () => {
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
        
        <div className={styles.priceRange}>
          <h3>Faixa de Preço</h3>
          <p>R$ 357,00 – R$ 946,00</p>
        </div>
        
        <div className={styles.cuisine}>
          <h3>Cozinha</h3>
          <p>Europeia</p>
        </div>
        
        <div className={styles.specialDishes}>
          <h3>Pratos Especiais</h3>
          <p>Opções vegetarianas</p>
        </div>
      </div>
      
      <button className={styles.verPratos}>Ver Pratos</button>
    </section>
  );
};