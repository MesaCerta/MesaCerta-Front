import { ILoginData, IUserData } from "@/app/shared/@types";
import { api, configHeaders } from "../api";

export const createUser = async (userData: IUserData) => {
  try {
    const { restaurants, ...userWithoutRestaurants } = userData;

    const response = await api.post(
      `/users`,
      userWithoutRestaurants,
      configHeaders
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (userData: ILoginData) => {
  try {
    const response = await api.post(`/users/login`, userData, configHeaders);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (
  userId: string,
  userData: Partial<IUserData>
) => {
  try {
    const response = await api.patch(
      `/users/${userId}`,
      userData,
      configHeaders
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
