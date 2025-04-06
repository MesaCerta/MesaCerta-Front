import React, { useState } from "react";
import styles from "./ReservationModal.module.scss";
import { IoClose } from "react-icons/io5";
import { IScheduleData } from "@/app/shared/@types";
import {
  formatPeopleCount,
  formatWeekDay,
} from "@/app/shared/utils/textFormatters";
import { ReservationForm } from "./ReservationForm";
import { useReservationTime } from "@/app/shared/hooks/ReservationTime/useReservationTime";

interface BaseReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: IScheduleData[];
  phone: string;
  restaurantName: string;
}

interface DishReservationModalProps extends BaseReservationModalProps {
  dishName: string;
}

export const ReservationModal: React.FC<
  BaseReservationModalProps | DishReservationModalProps
> = ({ isOpen, onClose, schedule = [], phone, restaurantName, ...props }) => {
  const [people, setPeople] = useState(1);
  const {
    selectedDay,
    setSelectedDay,
    selectedTime,
    setSelectedTime,
    getTimeSlots,
  } = useReservationTime(schedule);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDay || !selectedTime) {
      alert("Por favor, selecione um dia e horário para a reserva.");
      return;
    }

    const formattedPhone = phone.replace(/\D/g, "");
    let message = `Olá, vim através do MesaCerta e gostaria de fazer uma reserva no ${restaurantName} para ${formatPeopleCount(
      people
    )} ${formatWeekDay(selectedDay)} às ${selectedTime}`;

    if ("dishName" in props && props.dishName) {
      message += `. Gostaria de reservar especificamente para o prato: ${props.dishName}`;
    }

    message += ".";

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");

    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <button className={styles.closeButton} onClick={onClose}>
            <IoClose />
          </button>
          <h2>Agende já seu horário!</h2>
        </div>

        <ReservationForm
          people={people}
          setPeople={setPeople}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          schedule={schedule}
          timeSlots={getTimeSlots()}
          dishName={"dishName" in props ? props.dishName : undefined}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};
