import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import 'reactflow/dist/style.css';
import StyledComponentsRegistry from "@/lib/worksLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Summation ERP",
  description: "Summation ERP - Every ERP for Implement",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
