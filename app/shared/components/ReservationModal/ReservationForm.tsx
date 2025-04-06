import React from "react";
import styles from "./ReservationModal.module.scss";
import { IScheduleData } from "@/app/shared/@types";

interface ReservationFormProps {
  people: number;
  setPeople: (value: number) => void;
  selectedDay: string;
  setSelectedDay: (value: string) => void;
  selectedTime: string;
  setSelectedTime: (value: string) => void;
  schedule: IScheduleData[];
  timeSlots: string[];
  dishName?: string;
  onSubmit: (e: React.FormEvent) => void;
}

export const ReservationForm: React.FC<ReservationFormProps> = ({
  people,
  setPeople,
  selectedDay,
  setSelectedDay,
  selectedTime,
  setSelectedTime,
  schedule,
  timeSlots,
  dishName,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div className={styles.formGroup}>
        <label>Quantas pessoas:</label>
        <input
          type="number"
          min="1"
          max="20"
          value={people}
          onChange={(e) => setPeople(parseInt(e.target.value))}
          className={styles.numberInput}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Selecione um dia:</label>
        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          className={styles.select}
        >
          <option value="">Selecione um dia</option>
          {schedule?.map((s) => (
            <option key={s.day} value={s.day}>
              {s.day.charAt(0).toUpperCase() + s.day.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label>Selecione um horário:</label>
        <select
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          className={styles.select}
          disabled={!selectedDay}
        >
          <option value="">Selecione um horário</option>
          {timeSlots.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
      </div>

      {dishName && (
        <div className={styles.dishInfo}>
          <p>
            Reserva para o prato: <strong>{dishName}</strong>
          </p>
        </div>
      )}

      <button type="submit" className={styles.agendarButton}>
        Agendar
      </button>
    </form>
  );
};
