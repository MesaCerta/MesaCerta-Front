"use client";
import { useState, useEffect } from "react";
import Search from "@/app/shared/components/inputs/searchInput";
import styles from "./dish.module.scss";
import { ListDishes } from "@/app/shared/service";
import { IDishData } from "@/app/shared/@types";
import ListContainer from "@/app/shared/components/listItems/listContainer";
import ListItems from "@/app/shared/components/listItems";

export default function Dish() {
  const [, setSearchTerm] = useState("");
  const [dishes, setDishes] = useState<IDishData[]>([]);

  useEffect(() => {
    const fetchDishes = async () => {
      const fetchedDishes = await ListDishes();
      setDishes(fetchedDishes);
    };

    fetchDishes();
  }, []);

  return (
    <div className={styles.topLevel}>
      <Search onSearchChange={setSearchTerm} search={dishes} />
      <div className={styles.container}>
        <ListContainer
          fetchData={ListDishes}
          renderComponent={(items) => (
            <ListItems items={items} itemType={"dish"} />
          )}
        />
      </div>
    </div>
  );
}
