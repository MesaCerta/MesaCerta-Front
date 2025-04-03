"use client";
import { IRestaurantData } from "@/app/shared/@types";
import { getRestaurantById } from "@/app/shared/service";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import styles from "./restaurantDetails.module.scss";
import { FaStar, FaArrowLeft, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import Image from "next/image";

const RestaurantDetails = () => {
  const [restaurant, setRestaurant] = useState<IRestaurantData | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchRestaurant = async () => {
      const restaurantId = pathname.split("/").pop();

      try {
        const fetchedRestaurant = await getRestaurantById(restaurantId!);
        setRestaurant(fetchedRestaurant);
      } catch (error) {
        console.error("Erro ao buscar restaurante:", error);
      }
    };
    fetchRestaurant();
  }, [pathname]);

  if (!restaurant) {
    return null;
  }

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        color={index < Math.floor(rating) ? "#f8b400" : "#ddd"}
      />
    ));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={router.back}>
          <FaArrowLeft /> Voltar
        </button>
        <h1>{restaurant.name}</h1>
      </div>

      <div className={styles.imageGallery}>
        <div className={styles.mainImage}>
          <Image
            src={restaurant.image || '/placeholder-restaurant.jpg'}
            alt={restaurant.name || 'Restaurant image'}
            width={800}
            height={600}
          />
        </div>
        <Image
          src={restaurant.image || '/placeholder-restaurant.jpg'}
          alt={restaurant.name || 'Restaurant image'}
          width={400}
          height={300}
        />
        <Image
          src={restaurant.image || '/placeholder-restaurant.jpg'}
          alt={restaurant.name || 'Restaurant image'}
          width={400}
          height={300}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.leftColumn}>
          <section className={styles.infoSection}>
            <div className={styles.ratings}>
              <div className={styles.overallRating}>
                <span className={styles.score}>4,5</span>
                <div className={styles.stars}>{renderStars(4.5)}</div>
                <span className={styles.totalReviews}>1.500 avaliações</span>
              </div>
              <div className={styles.ratingCategories}>
                <div className={styles.category}>
                  <span>Comida</span>
                  <div className={styles.stars}>{renderStars(4.5)}</div>
                </div>
                <div className={styles.category}>
                  <span>Serviço</span>
                  <div className={styles.stars}>{renderStars(4.5)}</div>
                </div>
                <div className={styles.category}>
                  <span>Preço</span>
                  <div className={styles.stars}>{renderStars(4)}</div>
                </div>
                <div className={styles.category}>
                  <span>Ambiente</span>
                  <div className={styles.stars}>{renderStars(4.5)}</div>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.infoSection}>
            <div className={styles.details}>
              <div className={styles.priceRange}>
                <h3>Faixa de Preço</h3>
                <p>R$ 80,00 - R$ 150,00</p>
              </div>
              <div className={styles.cuisine}>
                <h3>Cozinha</h3>
                <p>{'restaurant.cuisine'}</p>
              </div>
              <div className={styles.specialDishes}>
                <h3>Pratos Especiais</h3>
                <div className={styles.dishesGrid}>
                  {[1, 2, 3, 4].map((index) => (
                    <Image
                      key={index}
                      src={restaurant.image || '/placeholder-dish.jpg'}
                      alt="Prato especial"
                      width={200}
                      height={150}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className={styles.rightColumn}>
          <section className={styles.infoSection}>
            <div className={styles.location}>
              <h2>Localização e contato</h2>
              <div className={styles.contactInfo}>
                <p>
                  <FaMapMarkerAlt />
                  {restaurant.address}
                </p>
                <p>
                  <FaPhone />
                  {restaurant.phone}
                </p>
                <p>
                  <FaEnvelope />
                  {'restaurant.email'}
                </p>
              </div>
              <button className={styles.reserveButton}>Reserve Aqui</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;
