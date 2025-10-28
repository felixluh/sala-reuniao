import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Connect Coworking",
  description: "Sistema de Reservas de Salas de Coworking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}