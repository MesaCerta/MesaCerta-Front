import React, { useState } from "react";
import styles from "./navbar.module.scss";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/icons/logo_transparent.png";
import { useAuthContext } from "@/app/shared/contexts/Auth/AuthContext";
import { RestaurantRegistrationModal } from "../RestaurantRegistrationModal/RestaurantRegistrationModal";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const { user, setUser, setToken } = useAuthContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = () => {
    const confirmed = window.confirm("Você realmente deseja sair?");
    if (confirmed) {
      setUser(null);
      setToken(null);
      localStorage.clear();
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const displayName =
    user?.restaurants && user.restaurants.length > 0
      ? user.restaurants[0].name
      : user?.name;

  const restaurantId = user?.restaurants?.[0]?.id;

  const isHomeActive = pathname === "/" || pathname === "/home";
  const isUserProfileActive = user?.id && pathname === `/user/${user.id}`;

  return (
    <div className={styles.container}>
      <div className={styles.toplevel}>
        <Link href="/">
          <Image src={Logo} alt="navLogo" className={styles.logoImg} />
        </Link>
        <nav className={styles.navbar}>
          <div className={styles.navleft}>
            <Link
              href="/"
              className={`${styles.navLink} ${
                isHomeActive ? styles.activeLink : ""
              }`}
            >
              <span>Início</span>
            </Link>
            <Link
              href="/restaurant"
              className={`${styles.navLink} ${
                pathname.startsWith("/restaurant") ? styles.activeLink : ""
              }`}
            >
              <span>Restaurantes</span>
            </Link>
            <Link
              href="/dish"
              className={`${styles.navLink} ${
                pathname.startsWith("/dish") ? styles.activeLink : ""
              }`}
            >
              <span>Pratos</span>
            </Link>
          </div>

          <div className={styles.navright}>
            {user ? (
              <>
                {!user.restaurants?.length && (
                  <button
                    onClick={handleOpenModal}
                    className={styles.restaurantButton}
                  >
                    Tenho um estabelecimento
                  </button>
                )}
                {restaurantId ? (
                  <Link
                    href={`/restaurant/${restaurantId}`}
                    className={`${styles.navLink} ${
                      pathname === `/restaurant/${restaurantId}` ? styles.activeLink : ""
                    }`}
                  >
                    {displayName}
                  </Link>
                ) : (
                  <Link
                    href={`/user/${user.id}`}
                    className={`${styles.navLink} ${
                      isUserProfileActive ? styles.activeLink : ""
                    }`}
                  >
                    {displayName}
                  </Link>
                )}
                <button onClick={handleLogout} className={styles.logoutButton}>
                  Sair
                </button>
              </>
            ) : (
              <Link href="/login" className={styles.loginLink}>
                <p>Login</p>
              </Link>
            )}
          </div>
        </nav>
      </div>
      <RestaurantRegistrationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Navbar;
