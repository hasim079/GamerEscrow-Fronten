'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_LISTINGS, MOCK_DRAFTS, MOCK_ORDERS } from '../../mock/mockData';
import { Plus, Link as LinkIcon, Package, Clock, TrendingUp, Upload, CheckCircle2 } from 'lucide-react';

export default function SellerDashboardPage() {
  const [activeTab, setActiveTab] = useState<'drafts' | 'active' | 'escrow' | 'completed'>('drafts');
  const [publishedIds, setPublishedIds] = useState<string[]>([]);

  const handlePublish = (id: string) => {
    setPublishedIds((prev) => [...prev, id]);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Seller Dashboard
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Manage your listings, escrows, and payouts.
          </p>
        </div>

        <Link
          href="/create-listing"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand px-5 py-2.5 text-xs font-bold text-black hover:bg-brand-hover active:scale-[0.98] transition-all shadow-sm self-start sm:self-auto"
        >
          <Plus className="size-4" />
          <span>New Listing</span>
        </Link>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Earnings */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="flex size-7 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground">
              <LinkIcon className="size-3.5" />
            </span>
            <span className="text-[11px] font-bold text-brand">+12.4%</span>
          </div>
          <div className="font-mono text-2xl font-extrabold text-foreground">128.6 SOL</div>
          <div className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase mt-1">
            TOTAL EARNINGS
          </div>
        </div>

        {/* Active Listings */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="flex size-7 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground">
              <Package className="size-3.5" />
            </span>
            <span className="text-[11px] font-bold text-brand">+1</span>
          </div>
          <div className="font-mono text-2xl font-extrabold text-foreground">3</div>
          <div className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase mt-1">
            ACTIVE LISTINGS
          </div>
        </div>

        {/* In Escrow */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="flex size-7 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground">
              <Clock className="size-3.5" />
            </span>
            <span className="text-[11px] font-medium text-muted-foreground">1 order</span>
          </div>
          <div className="font-mono text-2xl font-extrabold text-foreground">15.0 SOL</div>
          <div className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase mt-1">
            IN ESCROW
          </div>
        </div>

        {/* Conversion */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="flex size-7 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground">
              <TrendingUp className="size-3.5" />
            </span>
            <span className="text-[11px] font-bold text-brand">+4.2%</span>
          </div>
          <div className="font-mono text-2xl font-extrabold text-foreground">68%</div>
          <div className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase mt-1">
            CONVERSION
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex items-center gap-1 rounded-xl border border-border bg-muted/20 p-1 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('drafts')}
          className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
            activeTab === 'drafts'
              ? 'bg-card text-foreground font-bold shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Drafts
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('active')}
          className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
            activeTab === 'active'
              ? 'bg-card text-foreground font-bold shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Active
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('escrow')}
          className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
            activeTab === 'escrow'
              ? 'bg-card text-foreground font-bold shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Escrow
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('completed')}
          className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
            activeTab === 'completed'
              ? 'bg-card text-foreground font-bold shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Completed
        </button>
      </div>

      {/* Tab: Drafts */}
      {activeTab === 'drafts' && (
        <div className="space-y-3">
          {MOCK_DRAFTS.map((draft, idx) => {
            const isPublished = publishedIds.includes(draft.id);
            const image = idx === 0
              ? 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=300&q=80'
              : 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=300&q=80';

            return (
              <div
                key={draft.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={image}
                    alt={draft.title}
                    className="size-14 sm:size-16 rounded-xl object-cover border border-border shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="rounded-md border border-border/80 bg-muted/50 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                        Draft
                      </span>
                      <span className="font-mono text-xs font-bold text-foreground">
                        {draft.priceSol} SOL
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-foreground">{draft.title}</h3>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  {isPublished ? (
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand bg-brand/10 px-4 py-2 rounded-xl border border-brand/20">
                      <CheckCircle2 className="size-4" />
                      <span>Published to Solana</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handlePublish(draft.id)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-5 py-2 text-xs font-bold text-black hover:bg-brand-hover active:scale-[0.98] transition-all shadow-sm"
                    >
                      <Upload className="size-3.5" />
                      <span>Publish</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab: Active */}
      {activeTab === 'active' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_LISTINGS.slice(0, 3).map((listing) => (
            <div key={listing.id} className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm flex flex-col justify-between">
              <img
                src={listing.image}
                alt={listing.title}
                className="h-36 w-full object-cover"
              />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{listing.game}</span>
                    <span className="font-mono font-bold text-brand">{listing.priceSol} SOL</span>
                  </div>
                  <h4 className="text-sm font-bold text-foreground line-clamp-1">{listing.title}</h4>
                </div>
                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-brand font-semibold text-[11px]">Active in Vault</span>
                  <Link href={`/orders`} className="text-muted-foreground hover:text-foreground font-medium">
                    View &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Escrow */}
      {activeTab === 'escrow' && (
        <div className="space-y-3">
          {MOCK_ORDERS.map((order) => (
            <div key={order.id} className="flex items-center justify-between rounded-2xl border border-brand/20 bg-card p-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-brand">{order.id}</span>
                  <span className="text-xs font-bold text-foreground">{order.listingTitle}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Buyer: {order.buyerAddress} · Vault: {order.escrowVault}
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-sm font-extrabold text-foreground">{order.priceSol} SOL</div>
                <Link href={`/orders`} className="text-xs text-brand hover:underline font-semibold">
                  Track &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Completed */}
      {activeTab === 'completed' && (
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-brand/10 text-brand mx-auto mb-3">
            <CheckCircle2 className="size-6" />
          </div>
          <h3 className="text-sm font-bold text-foreground">Completed Handovers</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            All historic completed escrow releases have been recorded on the Solana ledger. Total payout: 128.6 SOL.
          </p>
        </div>
      )}
    </div>
  );
}
