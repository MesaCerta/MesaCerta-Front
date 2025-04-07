import { IListData } from "@/app/shared/@types";
import { useEffect, useState } from "react";

interface ListContainerProps<T> {
  fetchData: () => Promise<T[]>;
  renderComponent: (items: T[]) => JSX.Element;
  refreshTrigger?: number;
}

const ListContainer = <T extends IListData>({
  fetchData,
  renderComponent,
  refreshTrigger = 0,
}: ListContainerProps<T>) => {
  const [items, setItems] = useState<T[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const fetchedItems = await fetchData();
        const sortedItems = fetchedItems.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        setItems(sortedItems);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchItems();
  }, [fetchData, refreshTrigger]);

  return renderComponent(items);
};

export default ListContainer;
