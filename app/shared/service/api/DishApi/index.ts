import { api, configHeaders } from "../api";
import { IDishData } from "@/app/shared/@types";
import { AxiosError } from "axios";

export const ListDishes = async () => {
  try {
    const response = await api.get(`/dishes`, configHeaders);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response && error.response.status === 404) {
        return [];
      }
    }
    throw error;
  }
};

export const getDishById = async (id: string) => {
  try {
    const response = await api.get(`/dishes/${id}`, configHeaders);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDishByRestaurantId = async (restaurantId: string) => {
  try {
    const response = await api.get(
      `/dishes/restaurant/${restaurantId}`,
      configHeaders
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAverageRatingDish = async (id: string) => {
  try {
    const response = await api.get(
      `/reviews-dishes/${id}/average-dishes`,
      configHeaders
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response && error.response.status === 404) {
        return {
          averageRating: 0,
          totalReviews: 0,
        }; // Retorna 0 caso não encontre o restaurante ou não haja avaliações
      }
    }
    throw error;
  }
};

export const createDish = async (dishData: IDishData) => {
  try {
    const response = await api.post(`/dishes`, dishData, configHeaders);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        return { error: error.response.data.message || "Erro ao criar prato." };
      }
    }
    throw error;
  }
};
