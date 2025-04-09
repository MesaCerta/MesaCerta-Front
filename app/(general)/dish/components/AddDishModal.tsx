import React, { useRef } from "react";
import styles from "./AddDishModal.module.scss";
import CustomInput from "@/app/shared/components/inputs/customInput";
import CustomSelect from "@/app/shared/components/inputs/customSelect";
import Image from "next/image";
import { useDishForm } from "@/app/shared/hooks/useDishForm";
import { compressImageFromUrl } from "@/app/shared/utils/imageCompression";
import { IDishData } from "@/app/shared/@types";
import { IoClose } from "react-icons/io5";

interface AddDishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isEditMode?: boolean;
  dishData?: IDishData | null;
}

const mealTypeOptions = [
  { value: "Café da manhã", label: "Café da Manhã" },
  { value: "Almoço", label: "Almoço" },
  { value: "Jantar", label: "Jantar" },
];

const AddDishModal: React.FC<AddDishModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  isEditMode = false,
  dishData = null,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    formData,
    imagePreview,
    error,
    isLoading,
    setImagePreview,
    handleChange,
    handleSubmit,
    updateImage,
    setError,
  } = useDishForm({
    onSuccess: () => {
      onSuccess();
      onClose();
    },
    onClose,
    isOpen,
    isEditMode,
    initialData: dishData,
  });

  if (!isOpen) return null;

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      let objectUrl = "";
      try {
        objectUrl = URL.createObjectURL(file);
        setImagePreview(objectUrl);

        const compressedImage = await compressImageFromUrl(objectUrl);
        updateImage(compressedImage);
      } catch (err) {
        console.error("Image processing error:", err);
        setError("Erro ao processar a imagem. Por favor, tente novamente.");
        setImagePreview(null);
      } finally {
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
        }
      }
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{isEditMode ? "Editar Prato" : "Adicionar Novo Prato"}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <IoClose />
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
                  fill
                  style={{ objectFit: "cover" }}
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
            placeholder="Descreva o prato (máx 500 caracteres)"
            value={formData.description}
            onChange={handleChange}
            type="textarea"
            required
          />

          <CustomInput
            id="price"
            name="price"
            label="Preço"
            placeholder="0.00"
            type="number"
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
            options={mealTypeOptions}
            required
          />

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.buttonContainer}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading
                ? "Salvando..."
                : isEditMode
                ? "Atualizar Prato"
                : "Adicionar Prato"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDishModal;
