'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Sun, Moon, Wallet, Menu, X, Copy, Check, LogOut } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { WalletModal } from '../modals/WalletModal';

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [walletConnected, setWalletConnected] = useState(true);
  const [walletAddress, setWalletAddress] = useState('7XKQ...9FR2');
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Marketplace', href: '/' },
    { name: 'Create Listing', href: '/create-listing' },
    { name: 'Dashboard', href: '/seller' },
    { name: 'Orders', href: '/orders' },
    { name: 'Admin', href: '/admin' },
  ];

  const isNavActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href === '/create-listing') return pathname === '/create-listing' || pathname.startsWith('/create');
    if (href === '/seller') return pathname === '/seller' || pathname.startsWith('/dashboard');
    if (href === '/orders') return pathname.startsWith('/orders');
    if (href === '/admin') return pathname.startsWith('/admin');
    return pathname === href;
  };

  const handleWalletConnect = (address: string) => {
    setWalletAddress(address.length > 10 ? `${address.slice(0, 4)}...${address.slice(-4)}` : address);
    setWalletConnected(true);
    setIsWalletOpen(false);
  };

  const handleCopyWallet = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText('7XKQnZ8dW9FR2v1z4X3n7mKP0m1zX4v9a8f2k3x8qL');
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleDisconnect = (e: React.MouseEvent) => {
    e.stopPropagation();
    setWalletConnected(false);
  };

  return (
    <>
      <header
        className="header-blur sticky top-0 z-40 border-b border-border bg-page/80 backdrop-blur-md transition-colors"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 text-decoration-none">
              <span className="flex size-8 items-center justify-center rounded-xl bg-brand text-black font-bold shadow-sm">
                <Shield className="size-4 stroke-[2.2]" />
              </span>
              <span className="text-base font-bold tracking-tight text-foreground">
                GamerEscrow
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = isNavActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${isActive
                        ? 'text-foreground font-bold'
                        : 'text-muted-foreground hover:text-foreground'
                      }`}
                  >
                    {item.name}
                    {isActive && (
                      <span className="absolute -bottom-[21px] left-0 h-0.5 w-full rounded-full bg-brand" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: Badge + Theme + Wallet + Hamburger */}
          <div className="flex items-center gap-3">
            {/* Solana Mainnet badge */}
            <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-foreground">
              <span className="size-1.5 rounded-full bg-brand animate-pulse" />
              <span>Solana Mainnet</span>
            </div>

            {/* Theme toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex size-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>

            {/* Wallet button */}
            {walletConnected ? (
              <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-mono font-semibold text-foreground shadow-sm">
                <span className="size-1.5 rounded-full bg-brand" />
                <span>{walletAddress}</span>
                <span className="text-muted-foreground font-sans">42.8 SOL</span>
                <button
                  type="button"
                  onClick={handleCopyWallet}
                  className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                  title="Copy address"
                >
                  {copiedAddress ? <Check className="size-3.5 text-brand" /> : <Copy className="size-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="p-1 text-muted-foreground hover:text-rose-500 transition-colors"
                  title="Disconnect wallet"
                >
                  <LogOut className="size-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsWalletOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-xs font-bold text-black hover:bg-brand-hover active:scale-[0.98] transition-all shadow-sm"
              >
                <Wallet className="size-4" />
                <span>Connect Wallet</span>
              </button>
            )}

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex size-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground lg:hidden"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-border bg-card px-4 py-3 lg:hidden animate-in">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = isNavActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`rounded-lg px-3 py-2 text-xs font-semibold ${isActive
                        ? 'bg-brand/10 text-brand font-bold'
                        : 'text-muted-foreground hover:text-foreground'
                      }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      <WalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        onConnect={handleWalletConnect}
      />
    </>
  );
}
