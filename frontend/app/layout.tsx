import type { Metadata } from 'next';
import './global.css';
import { ThemeProvider } from '../components/ThemeContext';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const metadata: Metadata = {
  title: 'GamerEscrow — Trustless Marketplace for Gaming Assets',
  description: 'Buy and sell digital gaming accounts and assets with on-chain escrow. A minimalist, trustworthy Web3 marketplace secured on Solana.',
};

import { SolanaProvider } from '../components/SolanaProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="white" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#090d16" media="(prefers-color-scheme: dark)" />
      </head>
      <body style={{ margin: 0, padding: 0, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <SolanaProvider>
          <ThemeProvider>
            <Navbar />
            <div style={{ flex: 1 }}>{children}</div>
            <Footer />
          </ThemeProvider>
        </SolanaProvider>
      </body>
    </html>
  );
}
