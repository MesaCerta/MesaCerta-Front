"use client";

import { AuthProvider } from "../shared/contexts/Auth/AuthContext";
import ClientLayout from "../shared/hooks/ClientLayout/ClientLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <ClientLayout>{children}</ClientLayout>
    </AuthProvider>
  );
}
