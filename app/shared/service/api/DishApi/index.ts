import { api, configHeaders } from "../api";

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

export const getAverageRatingDish = async (id: string) => {
  try {
    const response = await api.get(
      `/reviews-dishes/${id}/average-rating`,
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
