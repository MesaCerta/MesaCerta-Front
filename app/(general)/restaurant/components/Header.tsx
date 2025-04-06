import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import styles from "@/app/(general)/restaurant/[id]/restaurantDetails.module.scss";

interface HeaderProps {
  restaurantName: string;
}

export const Header: React.FC<HeaderProps> = ({ restaurantName }) => {
  const router = useRouter();

  return (
    <div className={styles.header}>
      <button className={styles.backButton} onClick={router.back}>
        <h1>
          <FaArrowLeft /> {restaurantName}
        </h1>
      </button>
    </div>
  );
};
