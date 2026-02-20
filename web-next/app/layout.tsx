import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "참새작 점수 계산기",
  description: "참새작 점수 계산기",
};

export default function RootLayout(
  { children }: Readonly<{ children: ReactNode }>,
) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
