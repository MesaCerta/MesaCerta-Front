import React from "react";
import styles from "./footer.module.scss";
import Image from "next/image";
import Logo from "@/public/icons/logo.png";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.leftSection}>
          <Image src={Logo} alt="logoFooter" className={styles.logo} />
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore.
            <a href="#"> Learn more</a>
          </p>
        </div>
        <div className={styles.rightSection}>
          <h4>FOLLOW US</h4>
          <div className={styles.socialIcons}>
            <a href="#">
              <FacebookIcon
                sx={{
                  width: "24px",
                  height: "24px",
                  color: "#000000",
                }}
              />
            </a>
            <a href="#">
              <InstagramIcon
                sx={{
                  width: "24px",
                  height: "24px",
                  color: "#000000",
                }}
              />
            </a>
            <a href="#">
              <TwitterIcon
                sx={{
                  width: "24px",
                  height: "24px",
                  color: "#000000",
                }}
              />
            </a>
          </div>
        </div>
      </div>
      <div className={styles.bottomBar}>
        <p>
          © 2024 Reviews. All Right Reserved. Designed by <strong>Tiago</strong>
        </p>
        <nav className={styles.navFooter}>
          <a href="#">Terms of Service</a>
          <a href="#">Privacy Policy</a>
        </nav>
      </div>
    </footer>
  );
}
