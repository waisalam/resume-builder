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
      <body className="min-h-screen animated-backdrop flex flex-col w-full overflow-x-hidden">
        <Providers>
          <div className="flex-1 flex items-center justify-center w-full">
            <div className="w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
              <main className="glass rounded-2xl p-8 md:p-12 border-2 border-cyan-400/40 shadow-[0_0_15px_rgba(34,211,238,0.6)] transition-all duration-500 animate-fade-in">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}