import { useState, useEffect } from "react";
import { IScheduleData } from "@/app/shared/@types";

export const useReservationTime = (schedule: IScheduleData[] = []) => {
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const generateTimeSlots = (
    openingTime: string,
    closingTime: string
  ): string[] => {
    const slots: string[] = [];
    const [openHour, openMinute] = openingTime.split(":").map(Number);
    const [closeHour, closeMinute] = closingTime.split(":").map(Number);

    const startMinutes = openHour * 60 + openMinute;
    const endMinutes = closeHour * 60 + closeMinute;

    for (let minutes = startMinutes; minutes < endMinutes; minutes += 30) {
      const hour = Math.floor(minutes / 60);
      const minute = minutes % 60;
      slots.push(
        `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`
      );
    }

    return slots;
  };

  const getTimeSlots = () => {
    const daySchedule = schedule?.find((s) => s.day === selectedDay);
    if (!daySchedule) return [];
    return generateTimeSlots(daySchedule.openingTime, daySchedule.closingTime);
  };

  // Inicializar o dia selecionado quando o schedule mudar
  useEffect(() => {
    if (schedule?.length > 0) {
      setSelectedDay(schedule[0].day);
    }
  }, [schedule]);

  // Atualizar horário quando o dia mudar
  useEffect(() => {
    if (selectedDay) {
      const timeSlots = getTimeSlots();
      setSelectedTime(timeSlots[0] || "");
    }
  }, [selectedDay]);

  return {
    selectedDay,
    setSelectedDay,
    selectedTime,
    setSelectedTime,
    getTimeSlots,
  };
};
