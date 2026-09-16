'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_PROFILE, MOCK_LISTINGS, MOCK_ORDERS } from '../../mock/mockData';
import { ShieldCheck, Wallet, Copy, Check, Lock, KeyRound, Award, Star } from 'lucide-react';

export default function ProfilePage() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'listings' | 'orders' | 'vault'>('listings');

  const handleCopyWallet = () => {
    navigator.clipboard.writeText(MOCK_PROFILE.walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Profile Header Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <img
              src={MOCK_PROFILE.avatarUrl}
              alt={MOCK_PROFILE.username}
              className="size-16 rounded-full border-2 border-brand object-cover shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-foreground">{MOCK_PROFILE.username}</h1>
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
                  <ShieldCheck className="size-3" /> Verified
                </span>
              </div>

              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <Wallet className="size-3.5 text-brand" />
                <span className="font-mono text-foreground">{MOCK_PROFILE.walletAddress}</span>
                <button
                  type="button"
                  onClick={handleCopyWallet}
                  className="text-brand hover:underline flex items-center gap-1 font-semibold"
                >
                  {copied ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div className="mt-2 flex items-center gap-4 text-xs font-semibold text-muted-foreground">
                <span>Member since {MOCK_PROFILE.memberSince}</span>
                <span>·</span>
                <span className="flex items-center gap-1 text-amber-500">
                  <Star className="size-3.5 fill-current" />
                  {MOCK_PROFILE.trustScore}% Trust Rating
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex gap-4 border-t border-border pt-4 sm:border-t-0 sm:pt-0">
            <div className="rounded-xl border border-border bg-background px-4 py-3 text-center">
              <span className="text-[10px] font-bold uppercase text-muted-foreground block">Total Volume</span>
              <span className="font-mono text-lg font-bold text-foreground">{MOCK_PROFILE.totalVolumeSol} SOL</span>
            </div>
            <div className="rounded-xl border border-border bg-background px-4 py-3 text-center">
              <span className="text-[10px] font-bold uppercase text-muted-foreground block">Completed Sales</span>
              <span className="font-mono text-lg font-bold text-emerald-500">{MOCK_PROFILE.completedOrdersCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8 border-b border-border">
        <div className="flex gap-6">
          <button
            type="button"
            onClick={() => setActiveTab('listings')}
            className={`border-b-2 pb-3 text-xs font-bold transition-colors ${
              activeTab === 'listings'
                ? 'border-brand text-brand'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            My Active Listings ({MOCK_LISTINGS.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`border-b-2 pb-3 text-xs font-bold transition-colors ${
              activeTab === 'orders'
                ? 'border-brand text-brand'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Order History ({MOCK_ORDERS.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('vault')}
            className={`border-b-2 pb-3 text-xs font-bold transition-colors ${
              activeTab === 'vault'
                ? 'border-brand text-brand'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Encrypted Credentials Vault Archive
          </button>
        </div>
      </div>

      {/* Tab 1: Active Listings */}
      {activeTab === 'listings' && (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {MOCK_LISTINGS.map((listing) => (
            <div key={listing.id} className="rounded-xl border border-border bg-card p-4 space-y-3">
              <div className="aspect-video overflow-hidden rounded-lg bg-muted">
                <img src={listing.image} alt={listing.title} className="h-full w-full object-cover" />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-brand">{listing.game}</span>
                <span className="font-mono font-bold text-foreground">{listing.priceSol} SOL</span>
              </div>
              <h3 className="text-xs font-bold text-foreground line-clamp-1">{listing.title}</h3>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Orders */}
      {activeTab === 'orders' && (
        <div className="mt-6 space-y-3">
          {MOCK_ORDERS.map((order) => (
            <div key={order.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-brand">{order.id}</span>
                  <span className="text-xs font-bold text-foreground">{order.listingTitle}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Status: {order.status} · Date: {order.createdAt}
                </div>
              </div>
              <div className="font-mono text-sm font-bold text-foreground">{order.priceSol} SOL</div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Encrypted Credentials Vault Archive */}
      {activeTab === 'vault' && (
        <div className="mt-6 space-y-3">
          <div className="rounded-xl bg-brand/10 border border-brand/30 p-4 text-xs text-brand flex items-center gap-2">
            <Lock className="size-4 shrink-0" />
            <span>Archive of all decrypted account credentials purchased through GamerEscrow.</span>
          </div>

          {MOCK_ORDERS.map((order) => (
            <div key={order.id} className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <KeyRound className="size-4 text-brand" />
                  <span className="text-xs font-bold text-foreground">{order.listingTitle}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Username: <span className="font-mono text-foreground">{order.secretPayload.username}</span> · Pass: <span className="font-mono text-emerald-500">••••••••••••</span>
                </div>
              </div>

              <Link
                href="/orders"
                className="rounded-lg bg-brand/10 border border-brand/30 px-3 py-1.5 text-xs font-bold text-brand hover:bg-brand/20"
              >
                Open Decrypt Box
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
