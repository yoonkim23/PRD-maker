import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PRD Maker",
  description: "아이디어 한 줄로 해커톤용 PRD 만들기",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-text">
        <header className="border-b border-border bg-card">
          <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-4 px-4 py-3">
            <Link href="/" className="min-w-0">
              <p className="font-semibold">PRD Maker</p>
              <p className="truncate text-xs text-muted">아이디어를 바로 만들 수 있는 PRD로</p>
            </Link>
            <Link href="/specs" className="shrink-0 text-sm font-medium text-accent">
              내 PRD 목록
            </Link>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
