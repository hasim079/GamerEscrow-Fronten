'use client';

import React, { useState } from 'react';
import { MOCK_DISPUTES, DisputeItem } from '../../mock/mockData';
import { Eye, Shield, CheckCircle2, X, AlertTriangle, ArrowRight, TrendingUp } from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'disputes' | 'analytics' | 'moderation'>('disputes');
  const [disputes, setDisputes] = useState<DisputeItem[]>(MOCK_DISPUTES);
  const [selectedDispute, setSelectedDispute] = useState<DisputeItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resolutionMessage, setResolutionMessage] = useState<string | null>(null);

  const handleArbitrationAction = (action: 'Refund Buyer' | 'Release to Seller') => {
    if (!selectedDispute) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const newStatus = action === 'Refund Buyer' ? 'Resolved - Refunded' : 'Resolved - Released';
      const updated = { ...selectedDispute, status: newStatus as any };
      setDisputes((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
      setSelectedDispute(updated);
      setResolutionMessage(`Arbitration finalized: ${action}. Solana PDA instructions broadcasted.`);
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Admin Panel</h1>
          <span className="rounded-full border border-brand/30 bg-brand/10 px-2.5 py-0.5 text-xs font-semibold text-brand">
            Moderator
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Resolve disputes, monitor volume, and moderate listings.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex items-center gap-2 border-b border-border pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('disputes')}
          className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
            activeTab === 'disputes'
              ? 'bg-muted/80 text-foreground font-bold'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Disputes
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
            activeTab === 'analytics'
              ? 'bg-muted/80 text-foreground font-bold'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Analytics
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('moderation')}
          className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
            activeTab === 'moderation'
              ? 'bg-muted/80 text-foreground font-bold'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Moderation
        </button>
      </div>

      {/* Disputes Tab Content */}
      {activeTab === 'disputes' && (
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/80 bg-muted/20 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-3.5">ORDER</th>
                  <th className="px-5 py-3.5">PARTIES</th>
                  <th className="px-5 py-3.5">REASON</th>
                  <th className="px-5 py-3.5">AMOUNT</th>
                  <th className="px-5 py-3.5">STATUS</th>
                  <th className="px-5 py-3.5 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {disputes.map((item) => {
                  const parties = `${item.buyerAddress} vs ${item.sellerAddress}`;
                  const isOpen = item.status === 'Pending Review';

                  return (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-4 font-mono font-medium text-foreground whitespace-nowrap">
                        {item.orderId}
                      </td>
                      <td className="px-5 py-4 font-medium text-foreground whitespace-nowrap">
                        {parties}
                      </td>
                      <td className="px-5 py-4 text-muted-foreground max-w-xs truncate">
                        {item.buyerProof.text}
                      </td>
                      <td className="px-5 py-4 font-mono font-semibold text-foreground whitespace-nowrap">
                        {item.amountSol.toFixed(1)} SOL
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        {isOpen ? (
                          <span className="rounded-md bg-brand/15 px-2 py-0.5 text-[11px] font-bold text-brand">
                            Open
                          </span>
                        ) : item.status.includes('Resolved') ? (
                          <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                            Resolved
                          </span>
                        ) : (
                          <span className="rounded-md bg-amber-500/15 px-2 py-0.5 text-[11px] font-bold text-amber-500">
                            Reviewing
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDispute(item);
                            setResolutionMessage(null);
                          }}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-muted/40 px-3 py-1.5 text-xs font-semibold text-foreground hover:border-brand/40 hover:text-brand transition-all"
                        >
                          <Eye className="size-3.5" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Analytics Tab Content */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="rounded-2xl border border-border bg-card p-5">
            <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
              Escrow Volume Handled
            </span>
            <div className="mt-2 font-mono text-2xl font-extrabold text-foreground">184,920 SOL</div>
            <span className="text-xs text-brand font-semibold">+14.2% this month</span>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
              Total Dispute Rate
            </span>
            <div className="mt-2 font-mono text-2xl font-extrabold text-foreground">0.4%</div>
            <span className="text-xs text-brand font-semibold">99.6% smooth settlements</span>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
              Average Resolution Time
            </span>
            <div className="mt-2 font-mono text-2xl font-extrabold text-foreground">3.2 hours</div>
            <span className="text-xs text-muted-foreground">Admin multisig SLA &lt; 6h</span>
          </div>
        </div>
      )}

      {/* Moderation Tab Content */}
      {activeTab === 'moderation' && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-sm font-bold text-foreground mb-2">Automated Vault Safeguards</h3>
          <p className="text-xs text-muted-foreground max-w-lg mb-4 leading-relaxed">
            All listing credentials are client-side encrypted via AES-256 before broadcasting to Solana. Vault balances remain protected by program authority PDA until handoff is confirmed or arbitration triggered.
          </p>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand">
            <Shield className="size-4" />
            <span>Smart Contract Security Audit Status: PASSED</span>
          </div>
        </div>
      )}

      {/* Inspect Modal: Side-by-Side Proof Evidence */}
      {selectedDispute && (
        <div className="ge-modal-backdrop animate-in">
          <div className="ge-modal max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-brand">{selectedDispute.orderId}</span>
                  <span className="text-xs text-muted-foreground">· {selectedDispute.game}</span>
                </div>
                <h3 className="text-base font-bold text-foreground mt-0.5">
                  Arbitration Inspection: {selectedDispute.listingTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDispute(null)}
                className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Resolution Message */}
            {resolutionMessage && (
              <div className="mt-4 rounded-xl bg-brand/10 border border-brand/30 p-3.5 text-xs font-bold text-brand flex items-center gap-2">
                <CheckCircle2 className="size-4" />
                <span>{resolutionMessage}</span>
              </div>
            )}

            {/* Frozen Amount Banner */}
            <div className="mt-4 flex items-center justify-between rounded-xl bg-muted/30 border border-border/80 p-3 text-xs">
              <span className="text-muted-foreground">Disputed Vault Amount:</span>
              <span className="font-mono text-sm font-extrabold text-foreground">
                {selectedDispute.amountSol} SOL
              </span>
            </div>

            {/* Side-by-Side Evidence Columns */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Buyer Claim */}
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/[0.04] p-4 space-y-2.5">
                <div className="flex items-center justify-between border-b border-rose-500/20 pb-2">
                  <span className="text-xs font-bold text-rose-500">Buyer Claim</span>
                  <span className="font-mono text-[10px] text-muted-foreground">{selectedDispute.buyerAddress}</span>
                </div>
                <p className="text-xs text-foreground leading-relaxed">
                  {selectedDispute.buyerProof.text}
                </p>
                {selectedDispute.buyerProof.attachments[0] && (
                  <div className="pt-2">
                    <span className="text-[10px] font-semibold text-muted-foreground block mb-1">
                      Uploaded Proof
                    </span>
                    <img
                      src={selectedDispute.buyerProof.attachments[0]}
                      alt="Buyer Proof"
                      className="h-28 w-full rounded-lg object-cover border border-border"
                    />
                  </div>
                )}
              </div>

              {/* Seller Response */}
              <div className="rounded-xl border border-brand/20 bg-brand/[0.04] p-4 space-y-2.5">
                <div className="flex items-center justify-between border-b border-brand/20 pb-2">
                  <span className="text-xs font-bold text-brand">Seller Response</span>
                  <span className="font-mono text-[10px] text-muted-foreground">{selectedDispute.sellerAddress}</span>
                </div>
                <p className="text-xs text-foreground leading-relaxed">
                  {selectedDispute.sellerProof.text}
                </p>
                {selectedDispute.sellerProof.attachments[0] && (
                  <div className="pt-2">
                    <span className="text-[10px] font-semibold text-muted-foreground block mb-1">
                      Uploaded Screenshot
                    </span>
                    <img
                      src={selectedDispute.sellerProof.attachments[0]}
                      alt="Seller Proof"
                      className="h-28 w-full rounded-lg object-cover border border-border"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Arbitration Action Buttons */}
            <div className="mt-6 flex items-center justify-end gap-3 border-t border-border pt-4">
              <button
                type="button"
                onClick={() => handleArbitrationAction('Refund Buyer')}
                disabled={isProcessing}
                className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2.5 text-xs font-bold text-rose-500 hover:bg-rose-500/20 transition-all"
              >
                Refund Buyer
              </button>
              <button
                type="button"
                onClick={() => handleArbitrationAction('Release to Seller')}
                disabled={isProcessing}
                className="rounded-xl bg-brand px-5 py-2.5 text-xs font-bold text-black hover:bg-brand-hover transition-all shadow-sm"
              >
                Release to Seller
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
