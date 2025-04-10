import React, { useState, useRef, useEffect } from "react";
import { IUserData } from "@/app/shared/@types";
import styles from "./UserRegistrationModal.module.scss";
import { updateUser } from "@/app/shared/service/api/UserApi";
import Image from "next/image";
import { compressImageFromUrl } from "@/app/shared/utils/imageCompression";
import { IoClose } from "react-icons/io5";
import { useAuthContext } from "@/app/shared/contexts";

type Sex = "Male" | "Female" | "Other";

type UpdateUserData = {
  name: string;
  cpf: string;
  image?: string;
  sex: Sex;
  address: string;
  phone: string;
  birthdate: string;
};

interface UserRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateSuccess: (updatedData: Partial<IUserData>) => void;
  isEditMode?: boolean;
  userData?: IUserData;
}

export const UserRegistrationModal: React.FC<UserRegistrationModalProps> = ({
  isOpen,
  onClose,
  onUpdateSuccess,
  isEditMode = false,
  userData,
}) => {
  const { user: currentUser, setUser } = useAuthContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(
    userData?.image || null
  );

  const [formData, setFormData] = useState<UpdateUserData>({
    name: userData?.name || "",
    cpf: userData?.cpf || "",
    image: userData?.image || "",
    sex: (userData?.sex as Sex) || "Other",
    address: userData?.address || "",
    phone: userData?.phone || "",
    birthdate: userData?.birthdate
      ? new Date(userData.birthdate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (userData && isOpen) {
      setFormData({
        name: userData.name,
        cpf: userData.cpf,
        image: userData.image || "",
        sex: (userData.sex as Sex) || "Other",
        address: userData.address,
        phone: userData.phone,
        birthdate: userData.birthdate
          ? new Date(userData.birthdate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      });
      setImagePreview(userData.image || null);
    }
  }, [userData, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const compressedBase64 = await compressImageFromUrl(
          URL.createObjectURL(e.target.files[0])
        );
        setImagePreview(compressedBase64);
        setFormData((prev) => ({ ...prev, image: compressedBase64 }));
      } catch (error) {
        console.error("Erro ao processar imagem:", error);
        setError("Erro ao carregar a imagem.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!currentUser?.id) {
        setError("Usuário não encontrado");
        return;
      }

      const updateData: Partial<UpdateUserData> = {};

      const basicFields: (keyof Omit<
        UpdateUserData,
        "sex" | "image" | "birthdate"
      >)[] = ["name", "cpf", "address", "phone"];

      basicFields.forEach((field) => {
        if (formData[field] !== userData?.[field]) {
          updateData[field] = formData[field];
        }
      });

      if (formData.sex !== userData?.sex) {
        updateData.sex = formData.sex;
      }

      if (formData.image !== userData?.image) {
        updateData.image = formData.image;
      }

      const newBirthdate = formData.birthdate
        ? new Date(formData.birthdate + "T00:00:00.000Z").toISOString()
        : undefined;
      if (newBirthdate !== userData?.birthdate) {
        updateData.birthdate = newBirthdate;
      }

      if (Object.keys(updateData).length === 0) {
        onClose();
        return;
      }

      const updatedUserResponse = await updateUser(currentUser.id, updateData);

      if (updatedUserResponse) {
        const updatedUserData = {
          ...currentUser,
          ...updateData,
        };

        setUser(updatedUserData);
        onUpdateSuccess(updateData);
        onClose();
      }
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Erro ao atualizar usuário");
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>{isEditMode ? "Editar Perfil" : "Cadastrar Usuário"}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <IoClose />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div
            className={styles.imageUploadContainer}
            onClick={handleImageClick}
          >
            {imagePreview ? (
              <div className={styles.imagePreview}>
                {imagePreview.startsWith("data:image") ? (
                  <Image
                    src={imagePreview}
                    alt="Preview da Imagem"
                    layout="fill"
                    objectFit="cover"
                  />
                ) : (
                  <img
                    src={imagePreview}
                    alt="Preview da Imagem"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                )}
              </div>
            ) : (
              <div className={styles.uploadPlaceholder}>
                <span>Clique para adicionar uma foto de perfil</span>
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

          <div className={styles.formGroup}>
            <label htmlFor="name">Nome</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone">Telefone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="address">Endereço</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="birthdate">Data de Nascimento</label>
            <input
              type="date"
              id="birthdate"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="sex">Gênero</label>
            <select
              id="sex"
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              required
              className={styles.select}
            >
              <option value="Male">Masculino</option>
              <option value="Female">Feminino</option>
              <option value="Other">Outro</option>
            </select>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancelar
            </button>
            <button type="submit" className={styles.submitButton}>
              {isEditMode ? "Atualizar" : "Cadastrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
