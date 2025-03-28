// Home.tsx
import { useState } from 'react';
import styles from './home.module.scss';
import { restaurants } from './restaurantsData';

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsPerPage = 3; // Número de cards visíveis por vez

  const [hoveredStars, setHoveredStars] = useState<{ [key: number]: number | null }>({});

const handleStarHover = (restaurantId: number, starIndex: number) => {
  setHoveredStars((prev) => ({
    ...prev,
    [restaurantId]: starIndex + 1,
  }));
};

const handleStarLeave = (restaurantId: number) => {
  setHoveredStars((prev) => ({
    ...prev,
    [restaurantId]: null,
  }));
};

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0
        ? Math.max(restaurants.length - cardsPerPage, 0)
        : prevIndex - cardsPerPage
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + cardsPerPage >= restaurants.length
        ? 0
        : prevIndex + cardsPerPage
    );
  };

  return (
    <div className={styles.container}>
      {/* Wrapper para o banner ocupar toda a largura */}
      <div className={styles.bannerWrapper}>
        {/* Banner com imagem de fundo */}
        <div
          className={styles.banner}
          style={{
            backgroundImage: `url('/wallpapperHome.jpg')`,
          }}
        >
          {/* Barra de pesquisa */}
          <div className={styles.searchBar}>
            <span className={styles.searchIcon}>🔍</span>
            <input type="text" placeholder="Pesquisar estabelecimento ou prato" />
          </div>
        </div>
      </div>

      {/* Título da seção */}
      <h2 className={styles.sectionTitle}>
        Relacionado aos estabelecimentos visitados por você
      </h2>

      {/* Carrossel de restaurantes */}
      <div className={styles.carousel}>
        <button className={styles.prevButton} onClick={handlePrev}>
          &lt;
        </button>
        <div
          className={styles.carouselTrack}
          style={{
            transform: `translateX(-${(currentIndex * 100) / cardsPerPage}%)`,
          }}
        >
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className={styles.carouselItem}>
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className={styles.restaurantImage}
                onError={() => console.log(`Erro ao carregar a imagem: ${restaurant.image}`)}
              />
              <h3 className={styles.restaurantName}>{restaurant.name}</h3>
              <div
                className={styles.rating}
                onMouseLeave={() => handleStarLeave(restaurant.id)}
              >
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={
                      i < (hoveredStars[restaurant.id] ?? restaurant.rating)
                        ? styles.starFilled
                        : styles.starEmpty
                    }
                    onMouseEnter={() => handleStarHover(restaurant.id, i)}
                  >
                    ★
                  </span>
                ))}
                <span className={styles.reviews}>
                  ({restaurant.reviews} avaliações)
                </span>
              </div>
            </div>
          ))}
        </div>
        <button className={styles.nextButton} onClick={handleNext}>
          &gt;
        </button>
      </div>
    </div>
  );
}