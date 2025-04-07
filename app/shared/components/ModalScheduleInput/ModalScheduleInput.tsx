import React, { useState } from "react";
import styles from "./modalScheduleInput.module.scss";

interface Schedule {
  day: string;
  openingTime: string;
  closingTime: string;
}

interface ModalScheduleInputProps {
  onChange: (schedule: Schedule[]) => void;
}

export const ModalScheduleInput: React.FC<ModalScheduleInputProps> = ({
  onChange,
}) => {
  const [schedule, setSchedule] = useState<Schedule[]>([
    { day: "segunda-feira", openingTime: "", closingTime: "" },
    { day: "terça-feira", openingTime: "", closingTime: "" },
    { day: "quarta-feira", openingTime: "", closingTime: "" },
    { day: "quinta-feira", openingTime: "", closingTime: "" },
    { day: "sexta-feira", openingTime: "", closingTime: "" },
    { day: "sábado", openingTime: "", closingTime: "" },
    { day: "domingo", openingTime: "", closingTime: "" },
  ]);

  const [selectedDays, setSelectedDays] = useState<{ [key: string]: boolean }>(
    {}
  );

  const handleCheckboxChange = (index: number) => {
    const day = schedule[index].day;
    const newSelectedDays = { ...selectedDays };
    newSelectedDays[day] = !selectedDays[day];
    setSelectedDays(newSelectedDays);

    const newSchedule = [...schedule];
    if (!newSelectedDays[day]) {
      newSchedule[index].openingTime = "";
      newSchedule[index].closingTime = "";
    }
    setSchedule(newSchedule);
    onChange(
      newSchedule.filter(
        (s) => selectedDays[s.day] || s.openingTime || s.closingTime
      )
    );
  };

  const handleTimeChange = (
    index: number,
    field: "openingTime" | "closingTime",
    value: string
  ) => {
    const newSchedule = [...schedule];
    newSchedule[index][field] = value;
    setSchedule(newSchedule);
    onChange(
      newSchedule.filter(
        (s) => selectedDays[s.day] || s.openingTime || s.closingTime
      )
    );
  };

  return (
    <div className={styles.scheduleContainer}>
      <label className={styles.scheduleLabel}>Horários de Funcionamento:</label>
      <div className={styles.scheduleList}>
        {schedule.map((day, index) => (
          <div key={day.day} className={styles.scheduleRow}>
            <input
              type="checkbox"
              checked={selectedDays[day.day]}
              onChange={() => handleCheckboxChange(index)}
              className={styles.checkbox}
            />
            <span className={styles.dayLabel}>{day.day}</span>
            {selectedDays[day.day] && (
              <div className={styles.timeInputs}>
                <input
                  type="time"
                  value={day.openingTime}
                  onChange={(e) =>
                    handleTimeChange(index, "openingTime", e.target.value)
                  }
                  className={styles.timeInput}
                />
                <span>até</span>
                <input
                  type="time"
                  value={day.closingTime}
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
