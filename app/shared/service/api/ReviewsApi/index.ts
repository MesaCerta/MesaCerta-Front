import { AxiosError } from "axios";
import { api, configHeaders } from "../api";
import { IReviewDishData, IReviewRestaurantData } from "@/app/shared/@types";

export const createReviewDish = async (reviewData: IReviewDishData) => {
  try {
    const response = await api.post(`/reviews-dishes`, reviewData, configHeaders);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return {
        error: error.response.data.message || "Erro ao criar avaliação do prato.",
      };
    }
    throw error;
  }
};

export const listReviewDishes = async () => {
  try {
    const response = await api.get(`/reviews-dishes`, configHeaders);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return [];
    }
    throw error;
  }
};

export const createReviewRestaurant = async (reviewData: IReviewRestaurantData) => {
  try {
    const response = await api.post(`/reviews-restaurants`, reviewData, configHeaders);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return {
        error: error.response.data.message || "Erro ao criar avaliação do restaurante.",
      };
    }
    throw error;
  }
};

export const listReviewRestaurants = async () => {
  try {
    const response = await api.get(`/reviews-restaurants`, configHeaders);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return [];
    }
    throw error;
  }
};

export const getReviewsByRestaurantId = async (restaurantId: string) => {
  try {
    const response = await api.get(`/reviews-restaurants/restaurant/${restaurantId}`, configHeaders);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return [];
    }
    throw error;
  }
};

export const getReviewsByDishId = async (dishId: string) => {
  try {
    const response = await api.get(`/reviews-dishes/dish/${dishId}`, configHeaders);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return [];
    }
    throw error;
  }
};
