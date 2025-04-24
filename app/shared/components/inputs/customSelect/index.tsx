import React from "react";
import styles from "./customSelect.module.scss";
import { ICustomSelectProps } from "@/app/shared/@types";

export default function CustomSelect({
  id,
  name,
  required = true,
  value,
  onChange,
  label,
  options,
}: ICustomSelectProps) {
  const labelClass = `${styles.label} ${id === "sex" ? styles.whiteText : ""}`;

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={labelClass}>
        {label}:
      </label>
      <select
        id={id}
        name={name}
        required={required}
        className={styles.input}
        value={value}
        onChange={onChange}
      >
        <option value="">Selecione</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
