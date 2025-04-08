import React from "react";
import { FaArrowLeft, FaEllipsisV } from "react-icons/fa";
import { useRouter } from "next/navigation";
import styles from "@/app/(general)/restaurant/[id]/restaurantDetails.module.scss";

interface HeaderProps {
  restaurantName: string;
  onEditClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  restaurantName,
  onEditClick,
}) => {
  const router = useRouter();

  return (
    <div className={styles.header}>
      <button className={styles.backButton} onClick={router.back}>
        <h1>
          <FaArrowLeft /> {restaurantName}
        </h1>
      </button>
      {onEditClick && (
        <button className={styles.editOptionsButton} onClick={onEditClick}>
          <FaEllipsisV />
        </button>
      )}
    </div>
  );
};
