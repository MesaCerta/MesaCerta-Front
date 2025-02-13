"use client";
import { useState, useEffect } from "react";
import Search from "@/app/shared/components/inputs/searchInput";
import styles from "./restaurant.module.scss";
import { ListRestaurants } from "@/app/shared/service";
import { IRestaurantData } from "@/app/shared/@types";
import ListContainer from "@/app/shared/components/listItems/listContainer";
import ListItems from "@/app/shared/components/listItems";

export default function Home() {
  const [, setSearchTerm] = useState("");
  const [restaurants, setRestaurants] = useState<IRestaurantData[]>([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      const fetchedRestaurants = await ListRestaurants();
      setRestaurants(fetchedRestaurants);
    };

    fetchRestaurants();
  }, []);

  return (
    <div className={styles.topLevel}>
      <Search onSearchChange={setSearchTerm} search={restaurants} />
      <div className={styles.container}>
        <ListContainer
          fetchData={ListRestaurants}
          renderComponent={(items) => (
            <ListItems items={items} itemType={"restaurant"} />
          )}
        />
      </div>
    </div>
  );
}
