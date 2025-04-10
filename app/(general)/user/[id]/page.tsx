"use client";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import styles from "./userProfile.module.scss";
import { useAuthContext } from "@/app/shared/contexts";
import { UserRegistrationModal } from "@/app/shared/components/UserRegistrationModal/UserRegistrationModal";
import { updateUser } from "@/app/shared/service/api/UserApi";
import { IUserData } from "@/app/shared/@types";
import { FaUser } from "react-icons/fa";
import Image from "next/image";

const getGenderDisplay = (gender: string) => {
  switch (gender) {
    case "Male":
      return "Masculino";
    case "Female":
      return "Feminino";
    case "Other":
      return "Outro";
    default:
      return gender;
  }
};

const UserProfile = () => {
  const pathname = usePathname();
  const userId = pathname.split("/").pop() || "";
  const { user: currentUser } = useAuthContext();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [user, setUser] = useState(currentUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const isCurrentUser = currentUser?.id === userId;

  if (loading) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  if (error) {
    return <div className={styles.error}>Erro ao carregar dados do usuário</div>;
  }

  if (!user || !user.id) {
    return <div className={styles.notFound}>Usuário não encontrado</div>;
  }

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleUpdateSuccess = async (updatedData: Partial<IUserData>) => {
    try {
      await updateUser(user.id!, updatedData);
      setUser(prev => prev ? { ...prev, ...updatedData } as IUserData : null);
      handleCloseEditModal();
    } catch (err) {
      setError('Erro ao atualizar dados do usuário');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.coverPhoto}>
        <div className={styles.profilePicture}>
          {!imageError && user.image ? (
            user.image.startsWith('data:image') ? (
              <Image 
                src={user.image} 
                alt={user.name}
                layout="fill"
                objectFit="cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <img 
                src={user.image} 
                alt={user.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={() => setImageError(true)}
              />
            )
          ) : (
            <div className={styles.defaultAvatar}>
              <FaUser size={60} />
            </div>
          )}
        </div>
      </div>

      <div className={styles.profileInfo}>
        <div className={styles.header}>
          <h1>{user.name}</h1>
          {isCurrentUser && (
            <button onClick={handleEditClick} className={styles.editButton}>
              Editar Perfil
            </button>
          )}
        </div>

        <div className={styles.details}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Email:</span>
            <span>{user.email}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Telefone:</span>
            <span>{user.phone}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Endereço:</span>
            <span>{user.address}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Data de Nascimento:</span>
            <span>{user.birthdate ? new Date(user.birthdate).toLocaleDateString() : ""}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Gênero:</span>
            <span>{getGenderDisplay(user.sex!)}</span>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <UserRegistrationModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onUpdateSuccess={handleUpdateSuccess}
          isEditMode={true}
          userData={user}
        />
      )}
    </div>
  );
};

export default UserProfile;
