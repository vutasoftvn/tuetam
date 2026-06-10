import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bé Tập Tô Màu",
  description: "Tablet coloring studio for young children.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
