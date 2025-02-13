"use client";
import React, { useEffect, useState } from "react";
import styles from "./register.module.scss";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useHandleChangeUser from "@/app/shared/hooks/HandleChangeUser/useHandleChangeUser";
import { useAuthContext } from "@/app/shared/contexts";
import { createUser, loginUser } from "@/app/shared/service";
import { phoneMask } from "@/app/shared/utils/Masks/masks";
import CustomInput from "@/app/shared/components/inputs/customInput/index";
import CustomSelect from "@/app/shared/components/inputs/customSelect";

export default function Register() {
  const router = useRouter();
  const { formData, handleChange } = useHandleChangeUser();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { user, setUser, setToken } = useAuthContext();

  useEffect(() => {
    if (user) {
      router.push("/home");
    }
  }, [user, router]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      setError("As senhas não coincidem. Tente novamente.");
      return;
    }

    const { id, ...dataToSend } = formData;

    try {
      await createUser(dataToSend);

      const loginData = await loginUser({
        email: formData.email,
        password: formData.password,
      });
      setUser(loginData.user);
      setToken(loginData.token);

      alert("Registro realizado com sucesso!");
      router.push("/home");
    } catch (err) {
      setError("O registro falhou. Por favor, tente novamente.");
      setSuccess("");
    }
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
            id="email"
            name="email"
            placeholder="Email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            type="email"
          />
          <CustomSelect
            id="sex"
            name="sex"
            label="Sexo"
            value={formData.sex!}
            onChange={handleChange}
            options={[
              { value: "Male", label: "Masculino" },
              { value: "Female", label: "Feminino" },
              { value: "Other", label: "Outro" },
            ]}
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
            id="phone"
            name="phone"
            placeholder="(11) 98765-4321"
            label="Telefone"
            value={formData.phone}
            onChange={handleChange}
            type="phone"
            mask={phoneMask}
          />
          <CustomInput
            id="birthdate"
            name="birthdate"
            placeholder=""
            label="Data de Nascimento"
            value={formData.birthdate ?? ""}
            onChange={handleChange}
            type="date"
          />

          <CustomInput
            id="password"
            name="password"
            type="password"
            placeholder="Senha"
            label="Senha"
            value={formData.password}
            onChange={handleChange}
          />
          <CustomInput
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirmar Senha"
            label="Confirmar Senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
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
