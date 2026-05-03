import type { Metadata } from "next";
// @ts-ignore
import "./globals.css";

export const metadata: Metadata = {
  title: "VisionLink Tracker | AI Image Usage Search",
  description: "Track image usage across the web with VisionLink. Built by Aadesh Gund using Google Lens technology.",
  keywords: ["VisionLink", "Image Tracker", "Aadesh Gund", "Reverse Image Search", "SAKEC"],
  verification: {
    google: "ApyLmPbZeg9Yyqdbz88ETIwELLoG9gES_OBV1lz46zU",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}