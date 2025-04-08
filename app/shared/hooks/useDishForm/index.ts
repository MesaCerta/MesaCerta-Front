import { useState, useEffect } from "react";
import { useAuthContext } from "@/app/shared/contexts";
import { createDish, updateDish } from "@/app/shared/service/api/DishApi";
import { IDishData } from "@/app/shared/@types";

interface DishFormData {
  name: string;
  description: string;
  price: string;
  mealType: string;
  image: string;
  restaurantId?: string;
}

interface UseDishFormProps {
  onSuccess: () => void;
  onClose: () => void;
  isOpen: boolean;
  isEditMode?: boolean;
  initialData?: IDishData | null;
}

export const useDishForm = ({
  onSuccess,
  onClose,
  isOpen,
  isEditMode = false,
  initialData = null,
}: UseDishFormProps) => {
  const { user } = useAuthContext();
  const [formData, setFormData] = useState<DishFormData>(() => ({
    name: "",
    description: "",
    price: "",
    mealType: "",
    image: "",
    restaurantId: user?.restaurants?.[0]?.id || "",
  }));
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setError("");
      setIsLoading(false);

      if (isEditMode && initialData) {
        const editFormData = {
          name: initialData.name,
          description: initialData.description,
          price: String(initialData.price ?? ""),
          mealType: initialData.mealType,
          image: initialData.image || "",
          restaurantId: initialData.restaurantId,
        };

        setFormData(editFormData);
        setImagePreview(initialData.image || null);
      } else if (!isEditMode) {
        const addFormData = {
          name: "",
          description: "",
          price: "",
          mealType: "",
          image: "",
          restaurantId: user?.restaurants?.[0]?.id || "",
        };

        setFormData(addFormData);
        setImagePreview(null);
      }
    }
  }, [isOpen, isEditMode, initialData, user?.restaurants]);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      mealType: "",
      image: "",
      restaurantId: user?.restaurants?.[0]?.id || "",
    });
    setImagePreview(null);
    setError("");
    setIsLoading(false);
  };

  const validateForm = (): boolean => {
    if (!user?.restaurants || user.restaurants.length === 0) {
      setError("Você precisa ter um restaurante para adicionar pratos.");
      return false;
    }
    if (!formData.restaurantId) {
      setError("ID do restaurante não associado. Não é possível salvar.");
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
    if (formData.description.length > 500) {
      setError("Descrição do prato não pode ter mais de 500 caracteres.");
      return false;
    }
    if (isNaN(parseFloat(formData.price))) {
      setError("O preço deve ser um número válido.");
      return false;
    }
    return true;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: DishFormData) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const dishPayload: Partial<IDishData> = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        mealType: formData.mealType,
        image: formData.image || undefined,
        restaurantId: formData.restaurantId,
      };

      let response;
      if (isEditMode && initialData?.id) {
        const updatePayload: Partial<IDishData> = {
          name: dishPayload.name,
          description: dishPayload.description,
          price: dishPayload.price,
          mealType: dishPayload.mealType,
          image: dishPayload.image,
        };
        response = await updateDish(initialData.id, updatePayload);
      } else {
        if (!dishPayload.restaurantId) throw new Error("Restaurant ID missing");
        response = await createDish(dishPayload as IDishData);
      }

      if (response && "error" in response) {
        setError(response.error);
      } else if (response) {
        resetForm();
        onSuccess();
      } else {
        setError("Ocorreu um erro desconhecido.");
      }
    } catch (err: any) {
      setError(err.message || "Erro ao salvar prato. Tente novamente.");
      console.error("Dish form submit error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateImage = (compressedImage: string) => {
    setFormData((prev: DishFormData) => ({
      ...prev,
      image: compressedImage,
    }));
    setImagePreview(compressedImage);
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
