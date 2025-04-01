import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400"],
});

export const metadata: Metadata = {
  title: "Sovra Nations",
  description: "Create, join, and manage virtual nations on a digital map of the United States",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} antialiased bg-[#120e14] font-light`}
      >
        <AuthProvider>
          <Navbar />
          <main className="bg-[#120e14]">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
