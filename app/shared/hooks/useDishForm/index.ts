import { useState, useEffect } from "react";
import { useAuthContext } from "@/app/shared/contexts";
import { createDish } from "@/app/shared/service/api/DishApi";

interface DishFormData {
  name: string;
  description: string;
  price: string;
  mealType: string;
  image: string;
}

interface UseDishFormProps {
  onSuccess: () => void;
  onClose: () => void;
  isOpen: boolean;
}

export const useDishForm = ({
  onSuccess,
  onClose,
  isOpen,
}: UseDishFormProps) => {
  const { user } = useAuthContext();
  const [formData, setFormData] = useState<DishFormData>({
    name: "",
    description: "",
    price: "",
    mealType: "",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      mealType: "",
      image: "",
    });
    setImagePreview(null);
    setError("");
  };

  const validateForm = (): boolean => {
    if (!user?.restaurants || user.restaurants.length === 0) {
      setError("Você precisa ter um restaurante para adicionar pratos.");
      return false;
    }

    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.mealType
    ) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return false;
    }

    return true;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!validateForm()) {
        setIsLoading(false);
        return;
      }

      const dishData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        restaurantId: user!.restaurants![0].id,
        mealType: formData.mealType,
        image: formData.image || undefined,
      };

      const response = await createDish(dishData);

      if ("error" in response) {
        setError(response.error);
      } else {
        resetForm();
        onSuccess();
        onClose();
      }
    } catch (err) {
      setError("Erro ao adicionar prato. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateImage = (compressedImage: string) => {
    setFormData((prev) => ({
      ...prev,
      image: compressedImage,
    }));
  };

  return {
    formData,
    imagePreview,
    error,
    isLoading,
    setImagePreview,
    handleChange,
    handleSubmit,
    updateImage,
    setError,
  };
};
