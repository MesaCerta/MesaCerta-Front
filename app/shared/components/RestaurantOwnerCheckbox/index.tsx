import React from "react";
import styles from "../../../(general)/register/register.module.scss";

interface Props {
  isRestaurantOwner: boolean;
  onChange: (checked: boolean) => void;
}

export default function RestaurantOwnerCheckbox({
  isRestaurantOwner,
  onChange,
}: Props) {
  return (
    <div className={styles.checkboxContainer}>
      <input
        id="isRestaurantOwner"
        type="checkbox"
        className={styles.checkbox}
        checked={isRestaurantOwner}
        onChange={(e) => onChange(e.target.checked)}
      />
      <label htmlFor="isRestaurantOwner" className={styles.checkboxLabel}>
        Sou dono de restaurante?
      </label>
    </div>
  );
}
