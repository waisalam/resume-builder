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
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full animated-gradient-bg flex flex-col w-full overflow-x-hidden">
        <Providers>
          <div className="flex-1 flex items-center justify-center w-full">
            <div className="w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl p-6 md:p-10 transition-all duration-500 animate-fade-in">
                {children}
              </div>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}