import React, { useState, ChangeEvent, useEffect } from "react";
import styles from "./customInput.module.scss";
import { ICustomInputProps } from "@/app/shared/@types";

const applyMask = (value: string, mask?: (value: string) => string): string => {
  return mask ? mask(String(value ?? "")) : String(value ?? "");
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
  const [internalValue, setInternalValue] = useState(() =>
    applyMask(value, mask)
  );

  useEffect(() => {
    const potentiallyNewMaskedValue = applyMask(value, mask);
    if (potentiallyNewMaskedValue !== internalValue) {
      setInternalValue(potentiallyNewMaskedValue);
    }
  }, [value, mask, internalValue]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = e.target.value;
    setInternalValue(applyMask(newValue, mask));
    onChange(e as ChangeEvent<HTMLInputElement>);
  };

  const InputComponent = type === "textarea" ? "textarea" : "input";
  const inputType = type === "textarea" ? undefined : type;

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}:
      </label>
      <InputComponent
        id={id}
        type={inputType}
        name={name}
        placeholder={placeholder}
        required={required}
        className={styles.input}
        value={internalValue}
        onChange={handleChange}
        rows={type === "textarea" ? 3 : undefined}
      />
    </div>
  );
}
