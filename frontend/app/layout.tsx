import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Professional Dashboard",
  description:
    "A modern, high‑performance web application built with Next.js and Tailwind CSS. Experience smooth interactions and a clean, responsive design.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${poppins.variable} antialiased`} suppressHydrationWarning>
      <body className={`${poppins.className} min-h-screen bg-black text-white antialiased`}>
        <Providers>
          <div className="relative z-10 flex flex-col min-h-screen w-full">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}