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
        size={16}
        color={index < Math.floor(rating) ? "#f8b400" : "#ddd"}
      />
    ));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={router.back}>
          <FaArrowLeft /> Nome do Estabelecimento
        </button>
        <h1>{restaurant.name}</h1>
      </div>

      <div className={styles.imageGallery}>
        <div className={styles.mainImage}>
          <Image
            src={restaurant.image || '/restaurant_default.jpg'}
            alt={restaurant.name || 'Restaurant image'}
            width={534}
            height={398}
          />
        </div>
        <div className={styles.secondaryImagesContainer}>
          <div className={styles.secondaryImage}>
            <Image
              src={restaurant.image || '/restaurant_default.jpg'}
              alt={restaurant.name || 'Restaurant kitchen'}
              width={340}
              height={190}
            />
          </div>
          <div className={styles.secondaryImage}>
            <Image
              src={restaurant.image || '/restaurant_default.jpg'}
              alt={restaurant.name || 'Restaurant ambience'}
              width={340}
              height={190}
            />
          </div>
        </div>
        <div className={styles.rightImage}>
          <Image
            src={restaurant.image || '/restaurant_default.jpg'}
            alt={restaurant.name || 'Restaurant dishes'}
            width={419}
            height={398}
          />
        </div>
      </div>

      <div className={styles.content}>
        <section className={styles.infoSection}>
          <div className={styles.ratings}>
            <h2>Pontuações e avaliações</h2>
            <div className={styles.overallRating}>
              <span className={styles.score}>4,5</span>
              <div className={styles.stars}>{renderStars(4.5)}</div>
              <span className={styles.totalReviews}>1.500 avaliações</span>
            </div>
            <p>Nº 48 de 682 restaurantes em Donostia-San Sebastián</p>
            <h3>Pontuações</h3>
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
      </div>
    </div>
  );
};

export default RestaurantDetails;
