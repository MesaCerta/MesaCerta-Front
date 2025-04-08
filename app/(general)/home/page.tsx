"use client";

import { useState, useEffect } from "react";
import Search from "@/app/shared/components/inputs/searchInput";
import styles from "./home.module.scss";
import { ListRestaurants, ListDishes } from "@/app/shared/service";
import { IRestaurantData, IDishData } from "@/app/shared/@types";
import ListContainer from "@/app/shared/components/listItems/listContainer";
import ListItems from "@/app/shared/components/listItems";

export default function Home() {
  const [, setSearchTerm] = useState("");
  const [restaurants, setRestaurants] = useState<IRestaurantData[]>([]);
  const [dishes, setDishes] = useState<IDishData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [fetchedRestaurants, fetchedDishes] = await Promise.all([
        ListRestaurants(),
        ListDishes()
      ]);
      setRestaurants(fetchedRestaurants);
      setDishes(fetchedDishes);
    };

    fetchData();
  }, []);

  return (
    <div className={styles.topLevel}>
      <Search onSearchChange={setSearchTerm} search={[...restaurants, ...dishes]} searchType="both" />
      <div className={styles.container}>
        <div className={styles.section}>
          <ListContainer
            fetchData={ListRestaurants}
            renderComponent={(items) => (
              <ListItems items={items} itemType={"restaurant"} />
            )}
          />
        </div>

        <div className={styles.sectionDishes}>
          <ListContainer
            fetchData={ListDishes}
            renderComponent={(items) => (
              <ListItems items={items} itemType={"dish"} />
            )}
          />
        </div>
      </div>
    </div>
  );
}
