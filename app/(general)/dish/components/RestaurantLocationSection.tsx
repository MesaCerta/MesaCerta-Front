import React, { useState } from "react";
import { FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import styles from "@/app/(general)/dish/[id]/dishDetails.module.scss";
import { ILocationSectionProps } from "@/app/shared/@types";
import { ReservationModal } from "@/app/shared/components/ReservationModal/ReservationModal";

interface RestaurantLocationSectionProps extends ILocationSectionProps {
  dishName: string;
  restaurantName: string;
}

export const RestaurantLocationSection: React.FC<
  RestaurantLocationSectionProps
> = ({ address, phone, schedule, dishName, restaurantName }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <section className={styles.infoSection}>
      <div className={styles.location}>
        <h2>Localização e contato</h2>
        <div className={styles.contactInfo}>
          <p>
            <FaMapMarkerAlt />
            {address}
          </p>
          <p>
            <FaPhone />
            {phone}
          </p>
        </div>
        <button className={styles.reserveButton} onClick={handleOpenModal}>
          Reserve Aqui
        </button>
      </div>

      <ReservationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        schedule={schedule}
        phone={phone}
        restaurantName={restaurantName}
        dishName={dishName}
      />
    </section>
  );
};
