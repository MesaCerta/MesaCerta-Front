import React, { useState, useRef } from "react";
import styles from "./restaurantRegistrationModal.module.scss";
import { useAuthContext } from "@/app/shared/contexts";
import { createRestaurant } from "@/app/shared/service";
import { phoneMask } from "@/app/shared/utils/Masks/masks";
import CustomInput from "@/app/shared/components/inputs/customInput/index";
import useHandleChangeRestaurant from "@/app/shared/hooks/HandleChangeRestaurant/useHandleChangeRestaurant";
import { cnpjMask } from "@/app/shared/utils/masks/cnpj";
import { ModalScheduleInput } from "../ModalScheduleInput/ModalScheduleInput";
import Image from "next/image";
import { compressImageFromUrl } from "@/app/shared/utils/imageCompression";

interface RestaurantRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RestaurantRegistrationModal: React.FC<
  RestaurantRegistrationModalProps
> = ({ isOpen, onClose }) => {
  const { formData, handleChange, setFormData } = useHandleChangeRestaurant();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, setUser } = useAuthContext();

  const resetStates = () => {
    setError("");
    setSuccess("");
    setImagePreview(null);
    setFormData({
      name: "",
      address: "",
      phone: "",
      cnpj: "",
      image: "",
      schedule: [],
      ownerId: "",
    });
  };

  const handleCloseModal = () => {
    resetStates();
    onClose();
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imageUrl = URL.createObjectURL(file);
        setImagePreview(imageUrl);

        const compressedImage = await compressImageFromUrl(imageUrl);
        setFormData((prev) => ({
          ...prev,
          image: compressedImage,
        }));

        // Limpar a URL criada para evitar vazamento de memória
        URL.revokeObjectURL(imageUrl);
      } catch (err) {
        setError("Erro ao processar a imagem. Por favor, tente novamente.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name?.trim()) {
      setError("O nome do restaurante é obrigatório");
      return;
    }
    if (!formData.address?.trim()) {
      setError("O endereço é obrigatório");
      return;
    }
    if (!formData.phone?.trim()) {
      setError("O telefone é obrigatório");
      return;
    }
    if (!formData.cnpj?.trim()) {
      setError("O CNPJ é obrigatório");
      return;
    }
    if (!formData.schedule || formData.schedule.length === 0) {
      setError("O horário de funcionamento é obrigatório");
      return;
    }

    try {
      const response = await createRestaurant({
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        cnpj: formData.cnpj,
        schedule: formData.schedule,
        image: formData.image,
        ownerId: user!.id,
      });

      if ("error" in response) {
        setError(response.error);
        return;
      }

      if (user) {
        setUser({
          ...user,
          restaurants: [...(user.restaurants || []), response],
        });
      }

      setSuccess("Registro realizado com sucesso!");
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError("O registro falhou. Por favor, tente novamente.");
      setSuccess("");
    }
  };

  const handleScheduleChange = (newSchedule: any) => {
    setFormData((prev) => ({
      ...prev,
      schedule: newSchedule,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleCloseModal}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Registrar Restaurante</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
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
            placeholder="Nome"
            type="text"
            label="Nome"
            value={formData.name}
            onChange={handleChange}
          />

          <CustomInput
            id="address"
            name="address"
            type="text"
            placeholder="Endereço"
            label="Endereço"
            value={formData.address}
            onChange={handleChange}
          />

          <CustomInput
            id="cnpj"
            name="cnpj"
            placeholder="00.000.000/0000-00"
            label="CNPJ"
            value={formData.cnpj}
            onChange={handleChange}
            type="cnpj"
            mask={cnpjMask}
          />

          <CustomInput
            id="phone"
            name="phone"
            placeholder="(11) 98765-4321"
            label="Telefone"
            value={formData.phone}
            onChange={handleChange}
            type="phone"
            mask={phoneMask}
          />

          <ModalScheduleInput onChange={handleScheduleChange} />

          <div className={styles.buttons}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleCloseModal}
            >
              Cancelar
            </button>
            <button type="submit" className={styles.submitButton}>
              Registrar
            </button>
          </div>

          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}
        </form>
      </div>
    </div>
  );
};
