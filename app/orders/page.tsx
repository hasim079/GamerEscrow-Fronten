'use client';

import React, { useState } from 'react';
import { MOCK_ORDERS, EscrowOrder } from '../../mock/mockData';
import { Stepper } from '../../components/ui/Stepper';
import { CountdownTimer } from '../../components/ui/CountdownTimer';
import { DecryptBox } from '../../components/ui/DecryptBox';
import { DisputeModal } from '../../components/modals/DisputeModal';
import { Shield, Copy, Check, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<EscrowOrder>(MOCK_ORDERS[0]);
  const [ordersList, setOrdersList] = useState<EscrowOrder[]>(MOCK_ORDERS);
  const [isDisputeOpen, setIsDisputeOpen] = useState(false);
  const [isReleasing, setIsReleasing] = useState(false);
  const [releasedSuccess, setReleasedSuccess] = useState(false);
  const [copiedVault, setCopiedVault] = useState(false);

  const handleCopyVault = () => {
    navigator.clipboard.writeText(selectedOrder.escrowVault);
    setCopiedVault(true);
    setTimeout(() => setCopiedVault(false), 2000);
  };

  const handleReleaseFunds = () => {
    setIsReleasing(true);
    setTimeout(() => {
      setIsReleasing(false);
      setReleasedSuccess(true);
      
      const updated = {
        ...selectedOrder,
        status: 'Completed' as const,
        currentStep: 4,
      };
      setSelectedOrder(updated);
      setOrdersList((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    }, 1200);
  };

  const handleDisputeSubmit = (reason: string, details: string) => {
    const updated = {
      ...selectedOrder,
      status: 'Disputed' as const,
      disputeReason: `${reason}: ${details}`,
    };
    setSelectedOrder(updated);
    setOrdersList((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
  };

  // Fees calculations
  const assetPrice = selectedOrder.priceSol;
  const platformFee = Number((assetPrice * 0.025).toFixed(4));
  const networkFee = 0.00025;
  const totalLocked = Number((assetPrice + platformFee + networkFee).toFixed(5));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Order switcher tabs if multiple orders exist */}
      {ordersList.length > 1 && (
        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {ordersList.map((order) => {
            const isSelected = selectedOrder.id === order.id;
            return (
              <button
                key={order.id}
                type="button"
                onClick={() => {
                  setSelectedOrder(order);
                  setReleasedSuccess(false);
                }}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-brand text-black font-bold shadow-sm'
                    : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                {order.id} · {order.game}
              </button>
            );
          })}
        </div>
      )}

      <div className="space-y-6">
        {/* Hero Banner: Escrow Active */}
        <div className="rounded-2xl border border-brand/20 bg-brand/[0.04] dark:bg-brand/[0.07] p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex size-11 items-center justify-center rounded-xl bg-brand/15 text-brand shrink-0">
                <Shield className="size-6 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl font-bold tracking-tight text-foreground">Escrow Active</h1>
                  <span className="rounded-md bg-brand/15 px-2.5 py-0.5 text-xs font-mono font-bold text-brand">
                    Order {selectedOrder.id}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span>Vault</span>
                  <span className="font-mono text-foreground">{selectedOrder.escrowVault}</span>
                  <button
                    type="button"
                    onClick={handleCopyVault}
                    className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                    title="Copy Vault Address"
                  >
                    {copiedVault ? <Check className="size-3.5 text-brand" /> : <Copy className="size-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:items-end">
              <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                LOCKED AMOUNT
              </span>
              <div className="font-mono text-3xl font-extrabold text-foreground">
                {selectedOrder.priceSol.toFixed(1)} SOL
              </div>
            </div>
          </div>
        </div>

        {/* Stepper Progress Bar */}
        <div className="px-2">
          <Stepper currentStep={selectedOrder.currentStep} />
        </div>

        {/* Middle Two-Column Grid: Circular Timer + Escrow Breakdown */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Left: Circular Countdown Timer */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col items-center justify-center">
            {selectedOrder.status !== 'Completed' && selectedOrder.status !== 'Disputed' ? (
              <CountdownTimer initialSeconds={2570} />
            ) : selectedOrder.status === 'Completed' ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="flex size-14 items-center justify-center rounded-full bg-brand/15 text-brand mb-3">
                  <CheckCircle2 className="size-8" />
                </div>
                <h3 className="text-base font-bold text-foreground">Escrow Completed</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                  Funds have been released to the seller. Account handover finalized.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="flex size-14 items-center justify-center rounded-full bg-rose-500/15 text-rose-500 mb-3">
                  <AlertTriangle className="size-8" />
                </div>
                <h3 className="text-base font-bold text-rose-500">Dispute Under Review</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                  Vault funds are frozen. Moderator arbitration is in progress.
                </p>
              </div>
            )}
          </div>

          {/* Right: Escrow Breakdown */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground mb-4">Escrow breakdown</h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Asset price</span>
                  <span className="font-mono font-medium text-foreground">{assetPrice.toFixed(2)} SOL</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Platform fee (2.5%)</span>
                  <span className="font-mono font-medium text-foreground">{platformFee} SOL</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Network fee</span>
                  <span className="font-mono font-medium text-foreground">{networkFee} SOL</span>
                </div>

                <div className="border-t border-border pt-3">
                  <div className="flex items-center justify-between text-sm font-bold text-foreground">
                    <span>Total locked</span>
                    <span className="font-mono text-base">{totalLocked} SOL</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Seller Pill Box */}
            <div className="mt-6 rounded-xl border border-border/80 bg-muted/30 px-4 py-3 text-xs text-muted-foreground flex items-center justify-between">
              <span>
                Seller: <strong className="font-semibold text-foreground">{selectedOrder.sellerUsername}</strong> · Rating 5.0
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Card: Account Credentials */}
        <DecryptBox
          username={selectedOrder.secretPayload.username}
          passwordReal={selectedOrder.secretPayload.passwordReal}
          email={selectedOrder.secretPayload.email}
          securityKeys={selectedOrder.secretPayload.securityKeys}
        />

        {/* Action Buttons */}
        {selectedOrder.status !== 'Completed' && selectedOrder.status !== 'Disputed' && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsDisputeOpen(true)}
              className="rounded-xl border border-border bg-card px-5 py-2.5 text-xs font-semibold text-muted-foreground hover:text-rose-500 hover:border-rose-500/40 transition-colors"
            >
              Report Issue / Dispute
            </button>

            <button
              type="button"
              onClick={handleReleaseFunds}
              disabled={isReleasing}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-2.5 text-xs font-bold text-black hover:bg-brand-hover active:scale-[0.98] transition-all shadow-sm"
            >
              {isReleasing ? (
                <>
                  <span className="size-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Releasing Vault Funds...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-4" />
                  <span>Confirm & Release Funds</span>
                </>
              )}
            </button>
          </div>
        )}

        {releasedSuccess && (
          <div className="rounded-xl bg-brand/10 border border-brand/30 p-4 text-center text-xs font-bold text-brand flex items-center justify-center gap-2">
            <CheckCircle2 className="size-4" />
            <span>Funds Released to Seller! Escrow Transaction Finalized on Solana.</span>
          </div>
        )}
      </div>

      {/* Dispute Modal */}
      <DisputeModal
        isOpen={isDisputeOpen}
        onClose={() => setIsDisputeOpen(false)}
        onSubmit={handleDisputeSubmit}
        orderId={selectedOrder.id}
      />
    </div>
  );
}
