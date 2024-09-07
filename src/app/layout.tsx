import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {ReactNode} from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rhine Var Playground",
  description: "The world's most intuitive and reliable strongly-typed collaborative library",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="zh-cn" style={{
      height: '100%'
    }}>
      <body className={inter.className} style={{
        height: '100%'
      }}>{children}</body>
    </html>
  );
}
