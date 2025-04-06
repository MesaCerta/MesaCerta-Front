import React from "react";
import { FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import styles from "@/app/(general)/dish/[id]/dishDetails.module.scss";
import { ILocationSectionProps } from "@/app/shared/@types";

export const RestaurantLocationSection: React.FC<ILocationSectionProps> = ({
  address,
  phone,
}) => {
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
        <button className={styles.reserveButton}>Reserve Aqui</button>
      </div>
    </section>
  );
};
