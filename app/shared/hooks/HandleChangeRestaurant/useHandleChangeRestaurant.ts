"use client";
import { useState } from "react";
import { IEventProps, IRestaurantData } from "../../@types";

const useHandleChangeRestaurant = (
  initialData: Partial<IRestaurantData> = {}
) => {
  const [formData, setFormData] = useState<IRestaurantData>({
    name: '',
    address: '',
    phone: '',
    cnpj: '',
    image: '',
    schedule: [],
    ownerId: '',
    
    ...initialData,
  });

  const handleChange = ({ target }: IEventProps) => {
    const { name, value } = target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return {
    formData,
    handleChange,
    setFormData,
  };
};

export default useHandleChangeRestaurant;