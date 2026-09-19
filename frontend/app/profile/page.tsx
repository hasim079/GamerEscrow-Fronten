'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Wallet, Copy, Check, Lock, KeyRound, Star } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { fetchSellerListings, fetchBuyerOrders, ListingRecord } from '../../lib/supabaseClient';

export default function ProfilePage() {
  const { publicKey } = useWallet();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'listings' | 'orders' | 'vault'>('listings');
  const [myListings, setMyListings] = useState<ListingRecord[]>([]);
  const [myOrders, setMyOrders] = useState<ListingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const displayAddress = publicKey ? publicKey.toBase58() : 'Cüzdan bağlı değil';
  const shortAddress = publicKey
    ? `${publicKey.toBase58().slice(0, 6)}...${publicKey.toBase58().slice(-4)}`
    : '—';

  useEffect(() => {
    if (!publicKey) { setLoading(false); return; }
    const pubkey = publicKey.toBase58();
    Promise.all([fetchSellerListings(pubkey), fetchBuyerOrders(pubkey)]).then(([listings, orders]) => {
      setMyListings(listings);
      setMyOrders(orders);
      setLoading(false);
    });
  }, [publicKey]);

  const handleCopyWallet = () => {
    navigator.clipboard.writeText(displayAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeListings = myListings.filter((l) => l.status === 'Listed');
  const completedOrders = myOrders.filter((o) => o.status === 'Completed');
  const totalVolume = completedOrders.reduce((sum, o) => sum + o.price_sol, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Profile Header Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-full border-2 border-brand bg-muted flex items-center justify-center text-2xl font-bold text-brand">
              {shortAddress.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-foreground font-mono">{shortAddress}</h1>
                {publicKey && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
                    <ShieldCheck className="size-3" /> Connected
                  </span>
                )}
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <Wallet className="size-3.5 text-brand" />
                <span className="font-mono text-foreground truncate max-w-[200px] sm:max-w-none">{displayAddress}</span>
                <button type="button" onClick={handleCopyWallet} className="text-brand hover:underline flex items-center gap-1 font-semibold">
                  {copied ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                  {copied ? 'Coppied' : 'Copy'}
                </button>
              </div>
              <div className="mt-2 flex items-center gap-4 text-xs font-semibold text-muted-foreground">
                <span className="flex items-center gap-1 text-amber-500">
                  <Star className="size-3.5 fill-current" />
                  GamerEscrow user
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex gap-4 border-t border-border pt-4 sm:border-t-0 sm:pt-0">
            <div className="rounded-xl border border-border bg-background px-4 py-3 text-center">
              <span className="text-[10px] font-bold uppercase text-muted-foreground block">Total volume </span>
              <span className="font-mono text-lg font-bold text-foreground">{loading ? '—' : `${totalVolume.toFixed(2)} SOL`}</span>
            </div>
            <div className="rounded-xl border border-border bg-background px-4 py-3 text-center">
              <span className="text-[10px] font-bold uppercase text-muted-foreground block">Completed Orders</span>
              <span className="font-mono text-lg font-bold text-emerald-500">{loading ? '—' : completedOrders.length}</span>
            </div>
          </div>
        </div>
      </div>

      {!publicKey && (
        <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-center text-sm text-amber-500 font-semibold">
          Please connect your wallet to view your profile.
        </div>
      )}

      {/* Tabs */}
      <div className="mt-8 border-b border-border">
        <div className="flex gap-6">
          <button type="button" onClick={() => setActiveTab('listings')}
            className={`border-b-2 pb-3 text-xs font-bold transition-colors ${activeTab === 'listings' ? 'border-brand text-brand' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
            Aktif İlanlarım ({loading ? '…' : activeListings.length})
          </button>
          <button type="button" onClick={() => setActiveTab('orders')}
            className={`border-b-2 pb-3 text-xs font-bold transition-colors ${activeTab === 'orders' ? 'border-brand text-brand' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
            Orders history ({loading ? '…' : myOrders.length})
          </button>
          <button type="button" onClick={() => setActiveTab('vault')}
            className={`border-b-2 pb-3 text-xs font-bold transition-colors ${activeTab === 'vault' ? 'border-brand text-brand' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
            Encrypted identity data
          </button>
        </div>
      </div>

      {/* Tab 1: Active Listings */}
      {activeTab === 'listings' && (
        <div className="mt-6">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : activeListings.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
              There are no active Listings yet.{' '}
              <Link href="/create-listing" className="text-brand font-semibold hover:underline">İlan oluştur →</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {activeListings.map((listing) => (
                <div key={listing.id} className="rounded-xl border border-border bg-card p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-brand">{listing.game}</span>
                    <span className="font-mono font-bold text-foreground">{listing.price_sol} SOL</span>
                  </div>
                  <h3 className="text-xs font-bold text-foreground line-clamp-1">{listing.title}</h3>
                  {listing.rank && <span className="text-[10px] text-muted-foreground">Rank: {listing.rank}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Orders */}
      {activeTab === 'orders' && (
        <div className="mt-6 space-y-3">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : myOrders.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
              You don't have any orders yet.
            </div>
          ) : (
            myOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-brand">{order.id.slice(0, 8)}…</span>
                    <span className="text-xs font-bold text-foreground">{order.title}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Durum: {order.status} · {order.created_at ? new Date(order.created_at).toLocaleDateString('tr-TR') : '—'}
                  </div>
                </div>
                <div className="font-mono text-sm font-bold text-foreground">{order.price_sol} SOL</div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Vault Archive */}
      {activeTab === 'vault' && (
        <div className="mt-6 space-y-3">
          <div className="rounded-xl bg-brand/10 border border-brand/30 p-4 text-xs text-brand flex items-center gap-2">
            <Lock className="size-4 shrink-0" />
            <span>Encrypted login credentials for accounts purchased via GamerEscrow.</span>
          </div>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : myOrders.filter((o) => o.status === 'InEscrow' || o.status === 'Completed').length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
              There are no encrypted login credentials to display.
            </div>
          ) : (
            myOrders.filter((o) => o.status === 'InEscrow' || o.status === 'Completed').map((order) => (
              <div key={order.id} className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <KeyRound className="size-4 text-brand" />
                    <span className="text-xs font-bold text-foreground">{order.title}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Game: <span className="font-mono text-foreground">{order.game}</span> · Password: <span className="font-mono text-emerald-500">••••••••••••</span>
                  </div>
                </div>
                <Link href="/orders" className="rounded-lg bg-brand/10 border border-brand/30 px-3 py-1.5 text-xs font-bold text-brand hover:bg-brand/20">
                  Unlock
                </Link>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
