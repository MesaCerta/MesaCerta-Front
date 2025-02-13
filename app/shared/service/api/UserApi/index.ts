import { ILoginData, IUserData } from "@/app/shared/@types";
import { api, configHeaders } from "../api";

export const createUser = async (userData: IUserData) => {
  try {
    const response = await api.post(`/users`, userData, configHeaders);
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
