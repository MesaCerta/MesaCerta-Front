import { IListData } from "@/app/shared/@types";
import { useEffect, useState } from "react";

interface ListContainerProps<T> {
  fetchData: () => Promise<T[]>;
  renderComponent: (items: T[]) => JSX.Element;
}

const ListContainer = <T extends IListData>({
  fetchData,
  renderComponent,
}: ListContainerProps<T>) => {
  const [items, setItems] = useState<T[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const fetchedItems = await fetchData();
        const sortedItems = fetchedItems.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setItems(sortedItems);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchItems();
  }, [fetchData]);

  return renderComponent(items);
};

export default ListContainer;
