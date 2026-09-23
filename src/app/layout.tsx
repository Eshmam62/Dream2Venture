import type { Metadata } from "next";
import { Poppins, Lora } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Dream2Venture | Startup Investment Program",
  description: "Turn Your Disruptive Idea Into a Scalable Venture. Dream2Venture is a joint venture initiative committed to discovering next-gen student innovators.",
};

import SmoothScroll from "@/components/SmoothScroll";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${lora.variable} antialiased overflow-x-clip`}>
      <body className="min-h-screen flex flex-col bg-transparent text-slate-900 font-lora selection:bg-[#a95ef8] selection:text-white overflow-x-clip">
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
