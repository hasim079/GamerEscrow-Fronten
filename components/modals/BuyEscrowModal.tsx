'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import { Listing } from '../../mock/mockData';

interface BuyEscrowModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: Listing | null;
}

export function BuyEscrowModal({ isOpen, onClose, listing }: BuyEscrowModalProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !listing) return null;

  const feeSol = +(listing.priceSol * 0.01).toFixed(3);
  const totalSol = +(listing.priceSol + feeSol).toFixed(3);

  const handleConfirmLock = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onClose();
      router.push('/orders');
    }, 1500);
  };

  return (
    <div className="ge-modal-backdrop" onClick={onClose}>
      <div className="ge-modal" style={{ maxWidth: '28rem' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--card-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ display: 'flex', width: '2.5rem', height: '2.5rem', alignItems: 'center', justifyContent: 'center', borderRadius: '0.75rem', backgroundColor: 'rgba(16,185,129,0.1)', color: 'var(--brand)' }}>
              <Lock size={18} />
            </span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--fg)' }}>Lock Funds in Solana Vault</h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--muted-fg)' }}>Order Escrow Initialization</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="ge-btn-icon">
            <X size={18} />
          </button>
        </div>

        {/* Listing summary */}
        <div style={{ border: '1px solid var(--card-border)', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <img src={listing.image} alt={listing.title} style={{ width: '3rem', height: '3rem', borderRadius: '0.5rem', objectFit: 'cover' }} />
            <div>
              <span style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--brand)' }}>{listing.game} · {listing.rank}</span>
              <h4 style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: 'var(--fg)' }}>{listing.title}</h4>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            {[
              { label: 'Listing Price', value: `${listing.priceSol} SOL` },
              { label: 'Protocol Fee (1%)', value: `${feeSol} SOL` },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                <span style={{ color: 'var(--muted-fg)' }}>{label}</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--fg)' }}>{value}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--card-border)', fontSize: '0.875rem', fontWeight: 700 }}>
              <span style={{ color: 'var(--fg)' }}>Total to Lock</span>
              <span style={{ fontFamily: 'monospace', color: 'var(--brand)' }}>{totalSol} SOL</span>
            </div>
          </div>
        </div>

        {/* Trust indicator */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.6875rem', color: 'var(--brand)', backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '1.25rem' }}>
          <ShieldCheck size={14} style={{ flexShrink: 0, marginTop: 2 }} />
          <span>Funds are locked safely in a Solana smart contract vault. The seller receives SOL only after you confirm the account handoff.</span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button type="button" onClick={onClose} style={{ flex: 1, borderRadius: '0.75rem', border: '1px solid var(--card-border)', backgroundColor: 'var(--bg)', padding: '0.75rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted-fg)', cursor: 'pointer' }}>
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmLock}
            disabled={isProcessing}
            className="ge-btn-primary"
            style={{ flex: 2, height: 'auto', padding: '0.75rem', borderRadius: '0.75rem' }}
          >
            {isProcessing ? (
              <>
                <span style={{ width: '0.875rem', height: '0.875rem', border: '2px solid rgba(255,255,255,0.5)', borderTop: '2px solid #fff', borderRadius: '9999px', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                Depositing...
              </>
            ) : (
              <>
                Confirm & Deposit SOL <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
