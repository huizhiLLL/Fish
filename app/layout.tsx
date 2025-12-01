import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "🐟️'s Leaderboard",
  description: '基于 Next.js + Prisma + Neon 的速拧练习榜单',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

