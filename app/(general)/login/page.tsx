"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import styles from "./login.module.scss";
import useHandleChangeUser from "@/app/shared/hooks/HandleChangeUser/useHandleChangeUser";
import { useAuthContext } from "@/app/shared/contexts";
import { loginUser } from "@/app/shared/service";
import CustomInput from "@/app/shared/components/inputs/customInput";

export default function Login() {
  const router = useRouter();
  const { formData, handleChange } = useHandleChangeUser();
  const [error, setError] = useState("");
  const { user, setUser, setToken } = useAuthContext();

  useEffect(() => {
    if (user) {
      router.push("/home");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      const data = await loginUser({ email, password });
      setUser(data.user);
      setToken(data.token);
      router.push("/home");
    } catch (err) {
      setError("Login falhou. Por favor, tente novamente.");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.formSection} formSection`}>
        <div className={styles.formContainer}>
          <h1 className={styles.title}>Login</h1>
          <form className={styles.form} onSubmit={handleSubmit}>
            <CustomInput
              type="email"
              id="email"
              label="Email"
              name="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <CustomInput
              type="password"
              id="password"
              name="password"
              placeholder="Senha"
              label="Senha"
              required
              value={formData.password}
              onChange={handleChange}
            />

            <button type="submit" className={styles.buttonSubmmit}>
              Login
            </button>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.inputGroup}>
              <div className={styles.lostPass}>
                <span>Esqueci minha senha</span>
              </div>
              <div className={styles.register}>
                <Link href="/register" className={styles.regiterLink}>
                  Registre-se
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className={styles.imageSection}>
        <Image
          src="/hallpaper_login.png"
          alt="Imagem de restaurante"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>
    </div>
  );
}
