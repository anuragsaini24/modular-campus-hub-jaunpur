import type { Metadata } from 'next';
import './globals.css';
import { CampusShell } from '@/components/shell/CampusShell';

export const metadata: Metadata = {
  title: 'Campus Hub — PIT Jaunpur (Hacktoberfest Hack Day)',
  description:
    'Modular Campus Hub featuring AI College Assistant powered by Google Gemma 4, Local Grounded RAG, and Backboard persistent context for Prasad Institute of Technology.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0a0e17] text-slate-100 antialiased">
        <CampusShell>{children}</CampusShell>
      </body>
    </html>
  );
}
