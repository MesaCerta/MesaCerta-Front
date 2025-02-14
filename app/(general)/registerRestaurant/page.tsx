"use client";
import React, { useState } from "react";
import styles from "./registerRestaurant.module.scss";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/app/shared/contexts";
import { createRestaurant } from "@/app/shared/service";
import { phoneMask } from "@/app/shared/utils/Masks/masks";
import CustomInput from "@/app/shared/components/inputs/customInput/index";
import useHandleChangeRestaurant from "@/app/shared/hooks/HandleChangeRestaurant/useHandleChangeRestaurant";
import { cnpjMask } from "@/app/shared/utils/masks/cnpj";
import ScheduleInput from "@/app/shared/components/inputs/scheduleInput";

export default function Register() {
  const router = useRouter();
  const { formData, handleChange, setFormData } = useHandleChangeRestaurant();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { user } = useAuthContext();

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    try {
      const restaurantData = await createRestaurant({
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        cnpj: formData.cnpj,
        schedule: formData.schedule,
        ownerId: user!.id,
      });
      console.log(restaurantData);
      alert("Registro realizado com sucesso!");
      router.push("/home");
    } catch (err) {
      setError("O registro falhou. Por favor, tente novamente.");
      setSuccess("");
    }
  };

  const handleScheduleChange = (newSchedule: any) => {
    setFormData((prev) => ({
      ...prev,
      schedule: newSchedule,
    }));
  };

  return (
    <div className={styles.topLevel}>
      <div className={styles.container}>
        <h1 className={styles.title}>Registro</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <CustomInput
            id="name"
            name="name"
            placeholder="Nome"
            type="text"
            label="Nome"
            value={formData.name}
            onChange={handleChange}
          />
          <CustomInput
            id="address"
            name="address"
            type="text"
            placeholder="Endereço"
            label="Endereço"
            value={formData.address}
            onChange={handleChange}
          />
          <CustomInput
            id="cnpj"
            name="cnpj"
            placeholder="00.000.000/0000-00"
            label="CNPJ"
            value={formData.cnpj}
            onChange={handleChange}
            type="cpf"
            mask={cnpjMask}
          />
          <CustomInput
            id="phone"
            name="phone"
            placeholder="(11) 98765-4321"
            label="Telefone"
            value={formData.phone}
            onChange={handleChange}
            type="phone"
            mask={phoneMask}
          />
          <ScheduleInput onChange={handleScheduleChange} />
          <button type="submit" className={styles.buttonSubmmit}>
            Registrar
          </button>

          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}

          <div className={styles.register}>
            <span>
              Já tem uma conta?{" "}
              <Link href="/login" className={styles.regiterLink}>
                Faça login
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
