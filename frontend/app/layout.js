import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Cursor from "@/components/Cursor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "FinSmart",
  description: "Revloutionizing Finance with AI.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>FinSmart</title>
        <link
          rel="preload"
          as="video"
          href="/videos/hero.mp4"
          type="video/mp4"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
