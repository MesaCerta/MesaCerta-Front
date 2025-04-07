import React from "react";
import styles from "@/app/(general)/dish/[id]/dishDetails.module.scss";
import useRenderStars from "@/app/shared/hooks/RenderStars/useRenderStars";
import { IListData, IDishData } from "@/app/shared/@types";
import useRatings from "@/app/shared/hooks/Rating/useRatings";
import { useRouter } from "next/navigation";

type DishRatingsSectionProps = {
  item: IDishData;
};

export const DishRatingsSection: React.FC<DishRatingsSectionProps> = ({
  item,
}) => {
  const itemType = "dish";
  const ratings = useRatings([item], itemType);
  const rating = ratings[item.id!];
  const router = useRouter();

  const stars = useRenderStars(rating ? rating.averageRating : 0);

  const handleViewReviews = () => {
    router.push(`/dish/${item.id}/reviews`);
  };

  return (
    <section className={styles.infoSection}>
      <div className={styles.ratings}>
        <h2>Pontuações e avaliações</h2>
        {rating ? (
          <div className={styles.overallRating}>
            <span className={styles.score}>
              {rating.averageRating.toFixed(1)}
            </span>
            <div className={styles.stars}>{stars}</div>
            <span className={styles.totalReviews}>
              {rating.totalReviews} avaliação
              {rating.totalReviews !== 1 ? "s" : ""}
            </span>
          </div>
        ) : (
          <p>Carregando avaliações...</p>
        )}
      </div>
      <button onClick={handleViewReviews} className={styles.reserveButton}>
        Ver Avaliações
      </button>
    </section>
  );
};
