"use client";
import { IRestaurantData } from "@/app/shared/@types";
import { getRestaurantById } from "@/app/shared/service";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const RestaurantDetails = () => {
  const [restaurant, setRestaurant] = useState<IRestaurantData | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchRestaurant = async () => {
      const restaurantId = pathname.split("/").pop();

      try {
        const fetchedRestaurant = await getRestaurantById(restaurantId!);
        setRestaurant(fetchedRestaurant);
      } catch (error) {
        console.error("Erro ao buscar restaurante:", error);
      }
    };
    fetchRestaurant();
  }, [pathname]);

  if (!restaurant) {
    return null;
  }

  return (
    <div>
      <button onClick={router.back}>Voltar</button>
      <p>Nome do restaurante: {restaurant.name}</p>
      <p>Imagem do restaurante: {restaurant.image}</p>
      <p>Telefone do restaurante: {restaurant.phone}</p>
      <p>Endereço do restaurante: {restaurant.address}</p>
    </div>
  );
};

export default RestaurantDetails;
