"use client";
import { useState } from "react";
import { IEventProps, IUserData } from "../../@types";

const useHandleChangeUser = (initialData: Partial<IUserData> = {}) => {
  const [formData, setFormData] = useState<IUserData>({
    id: "",
    name: "",
    email: "",
    password: "",
    image: "",
    sex: "",
    address: "",
    phone: "",
    birthdate: "",
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

export default useHandleChangeUser;
