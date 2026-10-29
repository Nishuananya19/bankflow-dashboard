import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BankFlow | Digital Banking',
  description: 'A fictional digital banking dashboard demo',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
