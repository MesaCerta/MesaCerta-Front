import React from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { useRouter } from "next/navigation";
import styles from "./listItems.module.scss";
import useMediaQuery from "@mui/material/useMediaQuery";
import { IListData } from "@/app/shared/@types";
import useRatings from "../../hooks/Rating/useRatings";
import CardList from "./cardList";

interface ListItemsProps<T extends IListData> {
  items: T[];
  itemType: "restaurant" | "dish";
}

const ListItems = <T extends IListData>({
  items,
  itemType,
}: ListItemsProps<T>) => {
  const router = useRouter();
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const isMediumScreen = useMediaQuery("(max-width: 1024px)");
  const slidesToShow = isSmallScreen ? 1 : isMediumScreen ? 2 : 3;

  const ratings = useRatings(items, itemType);

  const handleCardClick = (
    event: React.MouseEvent<HTMLDivElement>,
    id: string | undefined
  ) => {
    if (id) {
      router.push(`/${itemType}/${id}`);
    }
  };

  if (items.length === 0) {
    return (
      <p>
        Nenhum {itemType === "restaurant" ? "restaurante" : "prato"} encontrado.
      </p>
    );
  }

  return (
    <div className={styles.listContainer}>
      <h2 className={styles.title}>
        Relacionado aos {itemType === "restaurant" ? "restaurantes" : "pratos"}{" "}
        vistos por você
      </h2>
      <div className={styles.sliderContainer}>
        <Splide
          options={{
            type: "slide",
            perPage:
              items.length === 1 ? 1 : items.length === 2 ? 2 : slidesToShow,
            perMove: 1,
            gap: items.length <= 2 ? "20px" : "10px", // Ajuste o gap para 1 ou 2 itens
            pagination: true,
            
            arrows: items.length >= 4, // Esconde as setas se houver menos de 4 itens
            breakpoints: {
              1024: {
                perPage: items.length === 1 ? 1 : items.length === 2 ? 2 : 2,
              },
              768: {
                perPage: 1,
              },
            },
          }}
        >
          {items.map((item) => (
            <SplideSlide key={item.id}>
              <div
                className={`${styles.cardWrapper} ${
                  items.length === 1
                    ? "singleItem"
                    : items.length === 2
                    ? "twoItems"
                    : ""
                }`}
                style={{ marginBottom: "30px" }}
              >
                <CardList
                  item={item}
                  rating={ratings[item.id]}
                  itemType={itemType}
                  onClick={(e) => handleCardClick(e, item.id)}
                />
              </div>
            </SplideSlide>
          ))}
        </Splide>
      </div>
    </div>
  );
};

export default ListItems;
