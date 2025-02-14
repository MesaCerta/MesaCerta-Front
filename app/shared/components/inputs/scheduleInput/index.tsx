import React, { useState, ChangeEvent } from "react";
import styles from "@/app/(general)/register/register.module.scss";

const weekDays = [
  "segunda-feira",
  "terça-feira",
  "quarta-feira",
  "quinta-feira",
  "sexta-feira",
  "sábado",
  "domingo",
];

interface ScheduleEntry {
  day: string;
  openingTime: string;
  closingTime: string;
}

interface Props {
  onChange: (schedule: ScheduleEntry[]) => void;
}

const ScheduleInput: React.FC<Props> = ({ onChange }) => {
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);

  const handleCheckboxChange = (day: string, checked: boolean) => {
    if (checked) {
      setSchedule((prev) => {
        const newSchedule = [
          ...prev,
          { day, openingTime: "", closingTime: "" },
        ];
        onChange(newSchedule);
        return newSchedule;
      });
    } else {
      setSchedule((prev) => {
        const newSchedule = prev.filter((entry) => entry.day !== day);
        onChange(newSchedule);
        return newSchedule;
      });
    }
  };

  const handleTimeChange = (
    day: string,
    field: "openingTime" | "closingTime",
    value: string
  ) => {
    setSchedule((prev) => {
      const updatedSchedule = prev.map((entry) =>
        entry.day === day ? { ...entry, [field]: value } : entry
      );
      onChange(updatedSchedule);
      return updatedSchedule;
    });
  };

  return (
    <div className={styles.field}>
      <label className={styles.label}>Horários de Funcionamento:</label>
      {weekDays.map((day) => {
        const isChecked = schedule.some((entry) => entry.day === day);
        const scheduleEntry = schedule.find((entry) => entry.day === day);

        return (
          <div key={day} className={styles.checkboxContainer}>
            <label>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => handleCheckboxChange(day, e.target.checked)}
              />
              {day}
            </label>

            {isChecked && (
              <div className={styles.timeInputs}>
                <input
                  type="time"
                  value={scheduleEntry?.openingTime || ""}
                  onChange={(e) =>
                    handleTimeChange(day, "openingTime", e.target.value)
                  }
                  placeholder="Abertura"
                />
                <input
                  type="time"
                  value={scheduleEntry?.closingTime || ""}
                  onChange={(e) =>
                    handleTimeChange(day, "closingTime", e.target.value)
                  }
                  placeholder="Fechamento"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ScheduleInput;
