import React, { useState, useEffect } from "react";
import styles from "./modalScheduleInput.module.scss";
import { IScheduleData } from "@/app/shared/@types";

interface ScheduleEntry extends IScheduleData {}

interface ModalScheduleInputProps {
  onChange: (schedule: ScheduleEntry[]) => void;
  initialSchedule?: ScheduleEntry[];
}

const ALL_DAYS = [
  "segunda-feira",
  "terça-feira",
  "quarta-feira",
  "quinta-feira",
  "sexta-feira",
  "sábado",
  "domingo",
];

const initializeSelectedDays = (
  initialSchedule?: ScheduleEntry[]
): { [key: string]: boolean } => {
  const selected: { [key: string]: boolean } = {};
  const initialDays = new Set(initialSchedule?.map((item) => item.day) || []);
  ALL_DAYS.forEach((day) => {
    selected[day] = initialDays.has(day);
  });
  return selected;
};

export const ModalScheduleInput: React.FC<ModalScheduleInputProps> = ({
  onChange,
  initialSchedule,
}) => {
  const [schedule, setSchedule] = useState<ScheduleEntry[]>(() => {
    const initialMap = new Map<string, ScheduleEntry>();
    if (initialSchedule) {
      initialSchedule.forEach((item) => initialMap.set(item.day, item));
    }
    return ALL_DAYS.map(
      (day) => initialMap.get(day) || { day, openingTime: "", closingTime: "" }
    );
  });

  const [selectedDays, setSelectedDays] = useState<{ [key: string]: boolean }>(
    () => initializeSelectedDays(initialSchedule)
  );

  useEffect(() => {
    const initialMap = new Map<string, ScheduleEntry>();
    if (initialSchedule) {
      initialSchedule.forEach((item) => initialMap.set(item.day, item));
    }
    const newSchedule = ALL_DAYS.map(
      (day) => initialMap.get(day) || { day, openingTime: "", closingTime: "" }
    );
    setSchedule(newSchedule);

    setSelectedDays(initializeSelectedDays(initialSchedule));
  }, [initialSchedule]);

  const updateSchedule = (
    newSchedule: ScheduleEntry[],
    newSelectedDays: { [key: string]: boolean }
  ) => {
    const activeSchedule = newSchedule.filter(
      (s) => newSelectedDays[s.day] === true
    );
    onChange(activeSchedule);
  };

  const handleCheckboxChange = (index: number) => {
    const day = schedule[index].day;
    const newSelectedDays = {
      ...selectedDays,
      [day]: !selectedDays[day],
    };

    setSelectedDays(newSelectedDays);

    const newSchedule = [...schedule];
    if (!newSelectedDays[day]) {
      newSchedule[index].openingTime = "";
      newSchedule[index].closingTime = "";
    }

    updateSchedule(newSchedule, newSelectedDays);
  };

  const handleTimeChange = (
    index: number,
    field: "openingTime" | "closingTime",
    value: string
  ) => {
    const newSchedule = [...schedule];
    newSchedule[index][field] = value;
    setSchedule(newSchedule);

    const day = newSchedule[index].day;
    const newSelectedDays = { ...selectedDays };
    if (value && !newSelectedDays[day]) {
      newSelectedDays[day] = true;
      setSelectedDays(newSelectedDays);
    }

    updateSchedule(newSchedule, newSelectedDays);
  };

  return (
    <div className={styles.scheduleContainer}>
      <label className={styles.scheduleLabel}>Horários de Funcionamento:</label>
      <div className={styles.scheduleList}>
        {schedule.map((dayEntry, index) => (
          <div key={dayEntry.day} className={styles.scheduleRow}>
            <input
              type="checkbox"
              checked={selectedDays[dayEntry.day] || false}
              onChange={() => handleCheckboxChange(index)}
              className={styles.checkbox}
            />
            <span className={styles.dayLabel}>{dayEntry.day}</span>
            {selectedDays[dayEntry.day] && (
              <div className={styles.timeInputs}>
                <input
                  type="time"
                  value={dayEntry.openingTime}
                  onChange={(e) =>
                    handleTimeChange(index, "openingTime", e.target.value)
                  }
                  className={styles.timeInput}
                />
                <span>até</span>
                <input
                  type="time"
                  value={dayEntry.closingTime}
                  onChange={(e) =>
                    handleTimeChange(index, "closingTime", e.target.value)
                  }
                  className={styles.timeInput}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
