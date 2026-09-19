'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Stepper } from '../../../components/ui/Stepper';
import { CountdownTimer } from '../../../components/ui/CountdownTimer';
import { DecryptBox } from '../../../components/ui/DecryptBox';
import { DisputeModal } from '../../../components/modals/DisputeModal';
import { Shield, Copy, Check, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction } from '@solana/web3.js';
import {
  buildReleaseFundsInstruction,
  buildOpenDisputeInstruction,
  getListingPda,
} from '../../../lib/anchorClient';
import {
  fetchListingById,
  updateListingStatus,
  createDisputeRecord,
  ListingRecord,
} from '../../../lib/supabaseClient';

export default function OrderDetailPage() {
  const params = useParams();
  const orderIdParam = params?.id as string;

  const [selectedOrder, setSelectedOrder] = useState<ListingRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDisputeOpen, setIsDisputeOpen] = useState(false);
  const [isReleasing, setIsReleasing] = useState(false);
  const [releasedSuccess, setReleasedSuccess] = useState(false);
  const [copiedVault, setCopiedVault] = useState(false);

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  useEffect(() => {
    async function loadOrder() {
      if (!orderIdParam) { setLoading(false); return; }
      const dbListing = await fetchListingById(orderIdParam);
      setSelectedOrder(dbListing);
      setLoading(false);
    }
    loadOrder();
  }, [orderIdParam]);

  const handleCopyVault = () => {
    if (!selectedOrder?.vault_pda) return;
    navigator.clipboard.writeText(selectedOrder.vault_pda);
    setCopiedVault(true);
    setTimeout(() => setCopiedVault(false), 2000);
  };

  const handleReleaseFunds = async () => {
    if (!selectedOrder) return;
    setIsReleasing(true);
    try {
      if (publicKey && sendTransaction) {
        try {
          const sellerKey = new PublicKey(
            selectedOrder.seller_pubkey && selectedOrder.seller_pubkey.length >= 32
              ? selectedOrder.seller_pubkey
              : publicKey
          );
          const listingKey =
            selectedOrder.escrow_pda && selectedOrder.escrow_pda.length >= 32
              ? new PublicKey(selectedOrder.escrow_pda)
              : getListingPda(sellerKey, new Uint8Array(32).fill(1))[0];

          const ix = await buildReleaseFundsInstruction(publicKey, sellerKey, listingKey);
          const tx = new Transaction().add(ix);
          const latest = await connection.getLatestBlockhash('confirmed');
          tx.recentBlockhash = latest.blockhash;
          tx.feePayer = publicKey;

          await sendTransaction(tx, connection);
          await updateListingStatus(selectedOrder.id, 'Completed');

          setIsReleasing(false);
          setReleasedSuccess(true);
          setSelectedOrder((prev) => prev ? { ...prev, status: 'Completed' as const } : prev);
        } catch (chainErr) {
          console.error('[ReleaseFunds] On-chain instruction failed:', chainErr);
          alert('Transaction failed or was rejected. Please try again.');
        }
      }
    } finally {
      setIsReleasing(false);
    }
  };

  const handleDisputeSubmit = async (reason: string, details: string, file: File | null) => {
    if (!selectedOrder) return;
    try {
      if (publicKey && sendTransaction) {
        try {
          const sellerKey = new PublicKey(
            selectedOrder.seller_pubkey && selectedOrder.seller_pubkey.length >= 32
              ? selectedOrder.seller_pubkey
              : publicKey
          );
          const listingKey =
            selectedOrder.escrow_pda && selectedOrder.escrow_pda.length >= 32
              ? new PublicKey(selectedOrder.escrow_pda)
              : getListingPda(sellerKey, new Uint8Array(32).fill(1))[0];

          const ix = await buildOpenDisputeInstruction(publicKey, listingKey);
          const tx = new Transaction().add(ix);
          const latest = await connection.getLatestBlockhash('confirmed');
          tx.recentBlockhash = latest.blockhash;
          tx.feePayer = publicKey;
          await sendTransaction(tx, connection);

          let evidenceUrl = '';
          if (file) {
            const { supabase } = await import('../../../lib/supabaseClient');
            const fileExt = file.name.split('.').pop();
            const fileName = `${selectedOrder.id}_${Date.now()}.${fileExt}`;
            const { data, error } = await supabase.storage.from('disputes').upload(fileName, file);
            if (!error && data) {
              const { data: { publicUrl } } = supabase.storage.from('disputes').getPublicUrl(data.path);
              evidenceUrl = publicUrl;
            } else {
              console.warn('File upload failed', error);
            }
          }

          await createDisputeRecord({
            listing_id: selectedOrder.id,
            initiator_pubkey: publicKey ? publicKey.toBase58() : (selectedOrder.buyer_pubkey || ''),
            reason,
            details,
            evidence_urls: evidenceUrl ? [evidenceUrl] : undefined,
            status: 'Open',
          });
          await updateListingStatus(selectedOrder.id, 'InDispute');
          setSelectedOrder((prev) => prev ? { ...prev, status: 'InDispute' as const } : prev);
        } catch (chainErr) {
          console.error('[Dispute] On-chain dispute failed:', chainErr);
          alert('The dispute process failed on the blokchain.');
        }
      } else {
        alert('Wallet not connected.');
      }
    } catch (err) {
      console.error('[Dispute] Submit error:', err);
      alert('An error occurred while submitting the dispute.');
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 text-center">
        <p className="text-muted-foreground text-sm">Orders are loading...</p>
      </div>
    );
  }

  if (!selectedOrder) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 text-center">
        <p className="text-muted-foreground text-sm">Order not found.</p>
        <Link href="/orders" className="mt-4 inline-block text-brand text-xs font-semibold hover:underline"> Return to Orders</Link>
      </div>
    );
  }

  const assetPrice = selectedOrder.price_sol;
  const platformFee = Number((assetPrice * 0.025).toFixed(4));
  const networkFee = 0.00025;
  const totalLocked = Number((assetPrice + platformFee + networkFee).toFixed(5));

  const isCompleted = selectedOrder.status === 'Completed';
  const isDisputed = selectedOrder.status === 'InDispute';

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />Return to Orders
        </Link>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-brand/20 bg-brand/[0.04] dark:bg-brand/[0.07] p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex size-11 items-center justify-center rounded-xl bg-brand/15 text-brand shrink-0">
                <Shield className="size-6 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl font-bold tracking-tight text-foreground">Active Escrow </h1>
                  <span className="rounded-md bg-brand/15 px-2.5 py-0.5 text-xs font-mono font-bold text-brand">
                    Order {selectedOrder.id.slice(0,8)}...
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span>Vault</span>
                  <span className="font-mono text-foreground">{selectedOrder.vault_pda || '�'}</span>
                  <button
                    type="button"
                    onClick={handleCopyVault}
                    className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {copiedVault ? <Check className="size-3.5 text-brand" /> : <Copy className="size-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:items-end">
              <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                Locked amount
              </span>
              <div className="font-mono text-3xl font-extrabold text-foreground">
                {selectedOrder.price_sol.toFixed(2)} SOL
              </div>
            </div>
          </div>
        </div>

        <div className="px-2">
          <Stepper currentStep={isCompleted ? 4 : isDisputed ? 3 : 2} />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col items-center justify-center">
            {!isCompleted && !isDisputed ? (
              <CountdownTimer initialSeconds={2570} />
            ) : isCompleted ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="flex size-14 items-center justify-center rounded-full bg-brand/15 text-brand mb-3">
                  <CheckCircle2 className="size-8" />
                </div>
                <h3 className="text-base font-bold text-foreground">Escrow completed</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                 The funds have been transfarred to the seller and the account transfer is complete.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="flex size-14 items-center justify-center rounded-full bg-rose-500/15 text-rose-500 mb-3">
                  <AlertTriangle className="size-8" />
                </div>
                <h3 className="text-base font-bold text-rose-500">Dispute in Progress</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                  The escrow is currently in dispute. Please wait for the resolution process to complete.
                </p>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground mb-4">Escrow details</h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Asset Price</span>
                  <span className="font-mono font-medium text-foreground">{assetPrice.toFixed(2)} SOL</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Platform fee(%2.5)</span>
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

            <div className="mt-6 rounded-xl border border-border/80 bg-muted/30 px-4 py-3 text-xs text-muted-foreground flex items-center justify-between">
              <span>
               Seller: <strong className="font-semibold text-foreground">
                  {selectedOrder.seller_pubkey ? selectedOrder.seller_pubkey.substring(0,6) + '...' : 'unknonw'}
                </strong>
              </span>
            </div>
          </div>
        </div>

        <DecryptBox
          username=""
          passwordReal=""
          email=""
          securityKeys={undefined}
          listingId={selectedOrder.id}
        />

        {!isCompleted && !isDisputed && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsDisputeOpen(true)}
              className="rounded-xl border border-border bg-card px-5 py-2.5 text-xs font-semibold text-muted-foreground hover:text-rose-500 hover:border-rose-500/40 transition-colors"
            >
              Report a problem / dispute
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
                  <span>Funds are being released...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-4" />
                  <span>Confirm & Release the funds</span>
                </>
              )}
            </button>
          </div>
        )}

        {releasedSuccess && (
          <div className="rounded-xl bg-brand/10 border border-brand/30 p-4 text-center text-xs font-bold text-brand flex items-center justify-center gap-2">
            <CheckCircle2 className="size-4" />
            <span>The funds have been transferred to the seller! Escrow transaction was completed on Solana.</span>
          </div>
        )}
      </div>

      <DisputeModal
        isOpen={isDisputeOpen}
        onClose={() => setIsDisputeOpen(false)}
        onSubmit={handleDisputeSubmit}
        orderId={selectedOrder.id}
      />
    </div>
  );
}


