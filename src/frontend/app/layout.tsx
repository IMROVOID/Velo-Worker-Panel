import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Velo Panel",
  description: "Advanced Velo Management Panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} antialiased flex min-h-screen bg-background text-foreground`}
      >
        <Sidebar />
        <main className="flex-1 p-0 lg:p-0 overflow-y-auto h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
