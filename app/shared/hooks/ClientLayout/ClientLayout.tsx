"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "../../components/navbar";
import { useAuthContext } from "../../contexts";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthContext();

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/registerRestaurant";

  useEffect(() => {
    if (!user && !isAuthPage) {
      router.push("/login");
    }
  }, [user, isAuthPage, router]);

  return (
    <>
      {!isAuthPage && <Navbar />}
      {children}
      {/*       {!isAuthPage && <Footer />} */}{" "}
    </>
  );
}
