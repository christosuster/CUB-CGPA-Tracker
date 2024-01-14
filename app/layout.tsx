import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";

import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { UserProvider } from "@/components/context/UserContext";

export const metadata: Metadata = {
  title: "CUB CGPA Tracker",
  description: "Start tracking your CGPA today!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="transition-all dark flex flex-col items-center min-h-screen bg-background">
        <UserProvider>
          <Navbar />
          <main className="grow w-full p-5 flex justify-center items-center">
            {children}
          </main>
        </UserProvider>
        <Toaster richColors closeButton expand />
        <footer className="border-t p-2 text-center w-full ">
          <p>
            Developed by{" "}
            <a
              className="hover:underline hover:underline-offset-2 font-semibold hover:text-yellow-400"
              href="https://christosuster.me/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {" "}
              Christos Uster Biswas
            </a>
          </p>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
