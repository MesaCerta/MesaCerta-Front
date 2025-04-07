"use client";
import { useState, useEffect } from "react";
import Search from "@/app/shared/components/inputs/searchInput";
import styles from "./dish.module.scss";
import { ListDishes } from "@/app/shared/service";
import { IDishData } from "@/app/shared/@types";
import ListContainer from "@/app/shared/components/listItems/listContainer";
import ListItems from "@/app/shared/components/listItems";
import AddDishModal from "./components/AddDishModal";

export default function Dish() {
  const [, setSearchTerm] = useState("");
  const [dishes, setDishes] = useState<IDishData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchDishes = async () => {
      const fetchedDishes = await ListDishes();
      setDishes(fetchedDishes);
    };

    fetchDishes();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSuccess = () => {
    // Forçar a atualização do ListContainer
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <div className={styles.topLevel}>
      <Search onSearchChange={setSearchTerm} search={dishes} />
      <div className={styles.container}>
        <button className={styles.addDishButton} onClick={handleOpenModal}>
          Adicionar Prato
        </button>
        <ListContainer
          refreshTrigger={refreshKey}
          fetchData={ListDishes}
          renderComponent={(items) => (
            <ListItems items={items} itemType={"dish"} />
          )}
        />
      </div>
      <AddDishModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
