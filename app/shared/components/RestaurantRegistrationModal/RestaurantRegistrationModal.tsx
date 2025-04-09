import React, { useState, useRef, useEffect } from "react";
import styles from "./restaurantRegistrationModal.module.scss";
import { useAuthContext } from "@/app/shared/contexts";
import { createRestaurant, updateRestaurant } from "@/app/shared/service";
import { phoneMask } from "@/app/shared/utils/Masks/masks";
import CustomInput from "@/app/shared/components/inputs/customInput/index";
import useHandleChangeRestaurant from "@/app/shared/hooks/HandleChangeRestaurant/useHandleChangeRestaurant";
import { cnpjMask } from "@/app/shared/utils/masks/cnpj";
import { ModalScheduleInput } from "../ModalScheduleInput/ModalScheduleInput";
import Image from "next/image";
import { compressImageFromUrl } from "@/app/shared/utils/imageCompression";
import { IRestaurantData, IScheduleData, IUserData } from "@/app/shared/@types";
import { IoClose } from "react-icons/io5";

interface RestaurantRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateSuccess?: () => void;
  isEditMode?: boolean;
  restaurantData?: IRestaurantData;
}

export const RestaurantRegistrationModal: React.FC<
  RestaurantRegistrationModalProps
> = ({
  isOpen,
  onClose,
  onUpdateSuccess,
  isEditMode = false,
  restaurantData,
}) => {
  const { user, setUser } = useAuthContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { formData, handleChange, setFormData } = useHandleChangeRestaurant(
    isEditMode && restaurantData
      ? restaurantData
      : {
          name: "",
          address: "",
          phone: "",
          cnpj: "",
          image: "",
          schedule: [],
          ownerId: user?.id || "",
        }
  );

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && restaurantData) {
        setFormData(restaurantData);
        setImagePreview(restaurantData.image || null);
      } else {
        setFormData({
          name: "",
          address: "",
          phone: "",
          cnpj: "",
          image: "",
          schedule: [],
          ownerId: user?.id || "",
        });
        setImagePreview(null);
      }
      setError("");
      setIsSubmitting(false);
    }
  }, [isOpen, isEditMode, restaurantData, setFormData, user?.id]);

  const handleCloseModal = () => {
    onClose();
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const compressedBase64 = await compressImageFromUrl(
          URL.createObjectURL(file)
        );
        setImagePreview(compressedBase64);
        setFormData((prev) => ({ ...prev, image: compressedBase64 }));
      } catch (error) {
        console.error("Erro ao processar imagem:", error);
        setError("Erro ao carregar a imagem.");
      }
    }
  };

  const handleScheduleChange = (newSchedule: IScheduleData[]) => {
    setFormData((prev) => ({ ...prev, schedule: newSchedule }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (
        !formData.name ||
        !formData.address ||
        !formData.phone ||
        !formData.cnpj ||
        !formData.schedule
      ) {
        setError("Por favor, preencha todos os campos obrigatórios.");
        setIsSubmitting(false);
        return;
      }
      if (!user?.id) {
        setError("Você precisa estar logado para realizar esta ação.");
        setIsSubmitting(false);
        return;
      }

      const dataToSubmit: { [key: string]: any } = {
        ...formData,
        ownerId: user.id,
      };

      const propertiesToRemove = [
        "id",
        "createdAt",
        "updatedAt",
        "reviews",
        "dishes",
      ];

      const cleanedDataToSubmit = { ...dataToSubmit };
      propertiesToRemove.forEach((prop) => delete cleanedDataToSubmit[prop]);

      cleanedDataToSubmit.ownerId = user.id;

      let response: IRestaurantData | { error: string };

      if (isEditMode && restaurantData?.id) {
        response = await updateRestaurant(
          restaurantData.id,
          cleanedDataToSubmit
        );
      } else {
        response = await createRestaurant(
          cleanedDataToSubmit as IRestaurantData
        );
      }

      if (response && "error" in response) {
        setError(response.error);
      } else if (response && response.id) {
        const updatedRestaurant = response as IRestaurantData;

        let nextUserState: IUserData | null = null;
        if (user) {
          if (!isEditMode) {
            nextUserState = {
              ...user,
              restaurants: [...(user.restaurants || []), updatedRestaurant],
            };
          } else {
            nextUserState = {
              ...user,
              restaurants:
                user.restaurants?.map((r) =>
                  r.id === updatedRestaurant.id ? updatedRestaurant : r
                ) || [],
            };
          }
        }

        setUser(nextUserState);

        if (onUpdateSuccess) {
          onUpdateSuccess();
        } else {
          onClose();
        }
      } else {
        setError("Ocorreu um erro desconhecido ao processar a resposta.");
      }
    } catch (err) {
      setError("Erro ao processar a requisição. Tente novamente.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalOverlay} onClick={handleCloseModal}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>
            {isEditMode ? "Editar Restaurante" : "Tenho um estabelecimento"}
          </h2>
          <button className={styles.closeButton} onClick={handleCloseModal}>
            <IoClose />
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div
            className={styles.imageUploadContainer}
            onClick={handleImageClick}
          >
            {imagePreview ? (
              <div className={styles.imagePreview}>
                <Image
                  src={imagePreview}
                  alt="Preview da Imagem"
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
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className={styles.hiddenInput}
            />
          </div>

          <CustomInput
            id="name"
            name="name"
            label="Nome do Restaurante"
            placeholder="Nome do Restaurante"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <CustomInput
            id="address"
            name="address"
            label="Endereço"
            placeholder="Endereço Completo"
            type="text"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <CustomInput
            id="phone"
            name="phone"
            label="Telefone"
            placeholder="(XX) XXXXX-XXXX"
            type="tel"
            mask={phoneMask}
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <CustomInput
            id="cnpj"
            name="cnpj"
            label="CNPJ"
            placeholder="XX.XXX.XXX/XXXX-XX"
            type="text"
            mask={cnpjMask}
            value={formData.cnpj}
            onChange={handleChange}
            required
          />

          <ModalScheduleInput
            onChange={handleScheduleChange}
            initialSchedule={formData.schedule}
          />

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.buttons}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleCloseModal}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Processando..."
                : isEditMode
                ? "Atualizar"
                : "Registrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
