'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, ShieldCheck, Lock, Cpu } from 'lucide-react';

export function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--card-border)', backgroundColor: 'var(--card)', marginTop: 'auto' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
          }}
        >
          {/* Brand */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ display: 'flex', width: '2rem', height: '2rem', alignItems: 'center', justifyContent: 'center', borderRadius: '0.5rem', backgroundColor: 'var(--brand)', color: '#fff' }}>
                <Shield size={14} />
              </span>
              <span style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--fg)' }}>
                Gamer<span style={{ color: 'var(--brand)' }}>Escrow</span>
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--muted-fg)', lineHeight: 1.6, margin: 0 }}>
              The trustless Web3 marketplace for verified gaming accounts and digital assets. Powered by Solana smart contracts.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--brand)' }}>
              <ShieldCheck size={14} />
              <span>100% On-Chain Escrow Security</span>
            </div>
          </div>

          {/* Marketplace links */}
          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted-fg)', margin: '0 0 1rem' }}>
              Marketplace
            </h4>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {['/', '/create-listing', '/seller', '/orders'].map((href, i) => (
                <li key={href}>
                  <Link href={href} style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--muted-fg)', textDecoration: 'none' }}>
                    {['Browse Listings', 'Sell Gaming Account', 'Seller Dashboard', 'Track Orders'][i]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Escrow protocol */}
          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted-fg)', margin: '0 0 1rem' }}>
              Escrow Protocol
            </h4>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { icon: <Lock size={13} />, text: 'AES-256 Credential Vault' },
                { icon: <Cpu size={13} />, text: 'Solana Program PDA' },
                { icon: <ShieldCheck size={13} />, text: 'Arbitration & Anti-Scam' },
              ].map(({ icon, text }) => (
                <li key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--muted-fg)' }}>
                  <span style={{ color: 'var(--brand)' }}>{icon}</span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          style={{
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--card-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: 'var(--muted-fg)',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <p style={{ margin: 0 }}>© {new Date().getFullYear()} GamerEscrow. All rights reserved. Secured on Solana.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Terms of Service', 'Privacy Policy', 'Smart Contract'].map((t) => (
              <span key={t} style={{ cursor: 'pointer' }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
