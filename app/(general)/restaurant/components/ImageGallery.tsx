import React from 'react';
import Image from 'next/image';
import styles from '@/app/(general)/restaurant/[id]/restaurantDetails.module.scss';

interface ImageGalleryProps {
  image: string;
  restaurantName: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ image, restaurantName }) => {
  const defaultImage = '/restaurant_default.jpg';
  
  return (
    <div className={styles.imageGallery}>
      <div className={styles.mainImage}>
        <Image
          src={image || defaultImage}
          alt={restaurantName || 'Restaurant image'}
          width={534}
          height={398}
        />
      </div>
      <div className={styles.secondaryImagesContainer}>
        <div className={styles.secondaryImage}>
          <Image
            src={image || defaultImage}
            alt={`${restaurantName || 'Restaurant'} kitchen`}
            width={340}
            height={190}
          />
        </div>
        <div className={styles.secondaryImage}>
          <Image
            src={image || defaultImage}
            alt={`${restaurantName || 'Restaurant'} ambience`}
            width={340}
            height={190}
          />
        </div>
      </div>
      <div className={styles.rightImage}>
        <Image
          src={image || defaultImage}
          alt={`${restaurantName || 'Restaurant'} dishes`}
          width={419}
          height={398}
        />
      </div>
    </div>
  );
};