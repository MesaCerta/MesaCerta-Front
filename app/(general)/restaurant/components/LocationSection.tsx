import React, { useState } from "react";
import { FaMapMarkerAlt, FaPhone, FaClock } from "react-icons/fa";
import styles from "@/app/(general)/restaurant/[id]/restaurantDetails.module.scss";
import { ILocationSectionProps, IScheduleData } from "@/app/shared/@types";
import { ReservationModal } from "../../../shared/components/ReservationModal/ReservationModal";

const getTodaysSchedule = (
  schedule: IScheduleData[]
): IScheduleData | undefined => {
  if (!schedule) return undefined;

  const daysOfWeek = [
    "domingo",
    "segunda-feira",
    "terça-feira",
    "quarta-feira",
    "quinta-feira",
    "sexta-feira",
    "sábado",
  ];
  const todayIndex = new Date().getDay();
  const todayString = daysOfWeek[todayIndex];

  return schedule.find((item) => item.day.toLowerCase() === todayString);
};

export const LocationSection: React.FC<ILocationSectionProps> = ({
  address,
  phone,
  schedule,
  restaurantName,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const todaysSchedule = getTodaysSchedule(schedule);

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
          <p className={styles.scheduleInfo}>
            <FaClock />
            {todaysSchedule ? (
              <span>
                Hoje: {todaysSchedule.openingTime} -{" "}
                {todaysSchedule.closingTime}
              </span>
            ) : (
              <span>Fechado hoje</span>
            )}
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
      />
    </section>
  );
};
