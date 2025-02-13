import React from "react";
import styles from "./card.module.scss";
import {
  IListData,
  IRestaurantData,
  IDishData,
  ICardProps,
} from "@/app/shared/@types";
import useFormattedPrice from "../../../hooks/FormattedPrice/useFormattedPrice";
import useRenderStars from "../../../hooks/RenderStars/useRenderStars";

const CardList: React.FC<ICardProps> = ({ item, rating, onClick, itemType }) => {
  const isRestaurant = (item: IListData): item is IRestaurantData => {
    return itemType === "restaurant";
  };

  const isDish = (item: IListData): item is IDishData => {
    return itemType === "dish";
  };

  const formattedPrice = isDish(item) ? useFormattedPrice(item.price) : null;
  const stars = useRenderStars(rating ? rating.averageRating : 0);

  return (
    <div className={styles.card} onClick={(event) => onClick(event, item.id)}>
      <img
        src={item.image || "/restaurant_default.jpg"}
        alt={item.name}
        title={item.image ? "" : "Imagem padrão: Nenhuma foto disponível."}
      />
      <div className={styles.info}>
        <h3>{item.name}</h3>
        {isRestaurant(item) && <p>{item.address}</p>}
        {isRestaurant(item) && (
          <p>{`Horário: ${item.openingTime} - ${item.closingTime}`}</p>
        )}
        {isRestaurant(item) && <p>{item.phone}</p>}
        {isDish(item) && <p>{`Preço: ${formattedPrice}`}</p>}
        <div className={styles.rating}>
          {stars}
          <span className={styles.reviewCount}>
            {rating ? `${rating.totalReviews} avaliações` : "Carregando..."}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CardList;

