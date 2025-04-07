import React, { useState, useRef, useEffect } from "react";
import styles from "./AddDishModal.module.scss";
import CustomInput from "@/app/shared/components/inputs/customInput";
import CustomSelect from "@/app/shared/components/inputs/customSelect";
import { useAuthContext } from "@/app/shared/contexts";
import { createDish } from "@/app/shared/service/api/DishApi";
import { NumericFormat } from "react-number-format";
import Image from "next/image";

interface AddDishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const initialFormState = {
  name: "",
  description: "",
  price: "",
  mealType: "",
  image: "",
};

const AddDishModal: React.FC<AddDishModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuthContext();
  const [formData, setFormData] = useState(initialFormState);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setFormData(initialFormState);
      setImagePreview(null);
      setError("");
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!user?.restaurants || user.restaurants.length === 0) {
        setError("Você precisa ter um restaurante para adicionar pratos.");
        setIsLoading(false);
        return;
      }

      if (
        !formData.name ||
        !formData.description ||
        !formData.price ||
        !formData.mealType
      ) {
        setError("Por favor, preencha todos os campos obrigatórios.");
        setIsLoading(false);
        return;
      }

      const dishData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        restaurantId: user.restaurants[0].id,
        mealType: formData.mealType,
        image: formData.image || undefined,
      };

      const response = await createDish(dishData);

      if ("error" in response) {
        setError(response.error);
      } else {
        setFormData(initialFormState);
        setImagePreview(null);
        onSuccess();
        onClose();
      }
    } catch (err) {
      setError("Erro ao adicionar prato. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Adicionar Novo Prato</h2>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div
            className={styles.imageUploadContainer}
            onClick={handleImageClick}
          >
            {imagePreview ? (
              <div className={styles.imagePreview}>
                <Image
                  src={imagePreview}
                  alt="Preview"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            ) : (
              <div className={styles.uploadPlaceholder}>
                <span>Clique para adicionar uma imagem</span>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className={styles.hiddenInput}
            />
          </div>

          <CustomInput
            id="name"
            name="name"
            label="Nome do Prato"
            placeholder="Ex: Pizza Margherita"
            value={formData.name}
            onChange={handleChange}
            type="text"
            required
          />

          <CustomInput
            id="description"
            name="description"
            label="Descrição"
            placeholder="Descreva o prato"
            value={formData.description}
            onChange={handleChange}
            type="text"
            required
          />

          <CustomInput
            id="price"
            name="price"
            label="Preço"
            placeholder="0.00"
            type="price"
            value={formData.price}
            onChange={handleChange}
            required
          />

          <CustomSelect
            id="mealType"
            name="mealType"
            label="Tipo de Refeição"
            value={formData.mealType}
            onChange={handleChange}
            options={[
              { value: "Café da manhã", label: "Café da Manhã" },
              { value: "Almoço", label: "Almoço" },
              { value: "Jantar", label: "Jantar" },
            ]}
            required
          />

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.buttonContainer}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? "Adicionando..." : "Adicionar Prato"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDishModal;
