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
  description:
    "Revolutionizing Finance with AI. Smart budgeting, investments, and stock predictions using cutting-edge AI models.",
  keywords: [
    "FinTech",
    "AI",
    "Finance",
    "Investment",
    "Budgeting",
    "FinSmart",
    "Stock Prediction",
    "Financial Planner",
    "Money Management",
    "AI Investing",
    "Personal Finance",
    "Financial Goals",
  ],
  authors: [
    { name: "FinSmart Team", url: "https://fin-smart-project.vercel.app" },
  ],
  creator: "FinSmart Team",
  publisher: "FinSmart",
  metadataBase: new URL("https://fin-smart-project.vercel.app"),
  openGraph: {
    title: "FinSmart",
    description:
      "Revolutionizing Finance with AI. Your smart companion for budgeting, investing, and financial growth.",
    url: "https://fin-smart-project.vercel.app",
    siteName: "FinSmart",
    type: "website",
    locale: "en_IN",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "icon",
        url: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        url: "/favicon-16x16.png",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#585eee" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        <Cursor />
        {children}
      </body>
    </html>
  );
}
