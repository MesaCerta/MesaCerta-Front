import React, { useState, ChangeEvent } from "react";
import styles from "@/app/(general)/register/register.module.scss";
import { ICustomInputProps } from "@/app/shared/@types";

const applyMask = (value: string, mask?: (value: string) => string): string => {
  return mask ? mask(value) : value;
};

export default function CustomInput({
  id,
  name,
  placeholder,
  required = true,
  value,
  onChange,
  type,
  label,
  mask,
}: ICustomInputProps) {
  const [maskedValue, setMaskedValue] = useState(() => applyMask(value, mask));

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setMaskedValue(applyMask(newValue, mask));
    onChange(e);
  };

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}:
      </label>
      <input
        id={id}
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        className={styles.input}
        value={maskedValue}
        onChange={handleChange}
      />
    </div>
  );
}
