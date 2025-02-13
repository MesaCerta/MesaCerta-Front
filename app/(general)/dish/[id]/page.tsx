"use client";
import { IDishData } from "@/app/shared/@types";
import { getDishById } from "@/app/shared/service";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const DishDetails = () => {
  const [dish, setDish] = useState<IDishData | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchDish = async () => {
      const dishId = pathname.split("/").pop();

      try {
        const fetchedDish = await getDishById(dishId!);
        setDish(fetchedDish);
      } catch (error) {
        console.error("Erro ao buscar restaurante:", error);
      }
    };
    fetchDish();
  }, [pathname]);

  if (!dish) {
    return null;
  }

  return (
    <div>
      <button onClick={router.back}>Voltar</button>
      <p>Nome do prato: {dish.name}</p>
      <p>Imagem do prato: {dish.image}</p>
      <p>Descrição do prato: {dish.description}</p>
      <p>Preço do prato: {dish.price}</p>
      <p>Tipo do prato: {dish.mealType}</p>
    </div>
  );
};

export default DishDetails;
