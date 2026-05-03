import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Image Usage Tracker",
  description: "Track where an image appears online using Google Lens results.",
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
