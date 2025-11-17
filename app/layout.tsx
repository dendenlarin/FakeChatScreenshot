import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fake Chat Screenshot Generator",
  description: "Generate fake messenger screenshots for Telegram, WhatsApp, Viber, and VK",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
