'use client';

import React, { useState, useMemo } from 'react';
import { Search, ShieldCheck, ChevronDown } from 'lucide-react';
import { MOCK_LISTINGS, Listing } from '../mock/mockData';
import { ListingCard } from '../components/ui/ListingCard';
import { BuyEscrowModal } from '../components/modals/BuyEscrowModal';

const CATEGORIES = ['All', 'FPS', 'MMORPG', 'Battle Royale', 'Racing', 'Strategy', 'Action RPG'];

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedBuyListing, setSelectedBuyListing] = useState<Listing | null>(null);

  const filteredListings = useMemo(() => {
    return MOCK_LISTINGS.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.game.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory =
        selectedCategory === 'All' ||
        item.category.toLowerCase() === selectedCategory.toLowerCase() ||
        item.game.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.priceSol - b.priceSol;
      if (sortBy === 'price-desc') return b.priceSol - a.priceSol;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <main>
      {/* ── Hero Section ─────────────────────────────────────── */}
      <section style={{ borderBottom: '1px solid var(--card-border)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '4rem 1.5rem' }}>
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'var(--brand)',
            }}
          >
            <ShieldCheck size={16} />
            On-chain escrow · zero counterparty risk
          </div>

          {/* H1 */}
          <h1
            style={{
              marginTop: '1rem',
              maxWidth: '48rem',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              lineHeight: 1.15,
              color: 'var(--fg)',
            }}
          >
            The trustless marketplace for premium gaming assets
          </h1>

          {/* Subtitle */}
          <p
            style={{
              marginTop: '1rem',
              maxWidth: '40rem',
              fontSize: '1rem',
              color: 'var(--muted-fg)',
              lineHeight: 1.6,
            }}
          >
            Buy and sell verified accounts, skins, and in-game assets. Funds stay locked in a Solana escrow vault until both sides confirm the handoff.
          </p>

          {/* Stats grid */}
          <dl
            style={{
              marginTop: '2.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              maxWidth: '32rem',
              borderRadius: '0.75rem',
              border: '1px solid var(--card-border)',
              overflow: 'hidden',
              gap: '1px',
              backgroundColor: 'var(--card-border)',
            }}
          >
            {[
              { value: '184,920 SOL', label: 'Volume Secured' },
              { value: '47,318', label: 'Assets Traded' },
              { value: '0.4%', label: 'Dispute Rate' },
            ].map((stat) => (
              <div key={stat.label} className="ge-stat-cell">
                <dd style={{ fontFamily: 'monospace', fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.025em', color: 'var(--fg)' }}>
                  {stat.value}
                </dd>
                <dt style={{ marginTop: '0.25rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted-fg)' }}>
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Sticky Filter Bar ─────────────────────────────────── */}
      <div
        className="header-blur"
        style={{
          position: 'sticky',
          top: '4rem',
          zIndex: 30,
          borderBottom: '1px solid var(--card-border)',
        }}
      >
        <div
          style={{
            maxWidth: '80rem',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            padding: '0.75rem 1.5rem',
          }}
        >
          {/* Row 1: Search */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '20rem' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--muted-fg)',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search accounts, games, skins"
              className="ge-input"
              style={{ paddingLeft: '2.25rem' }}
            />
          </div>

          {/* Row 2: Category pills + sort */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflowX: 'auto' }}>
            <div className="scrollbar-none" style={{ display: 'flex', gap: '0.375rem', overflowX: 'auto', paddingBottom: '2px' }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={selectedCategory === cat ? 'ge-pill-active' : 'ge-pill'}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort dropdown */}
            <div style={{ position: 'relative', flexShrink: 0, width: '10rem' }}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="ge-select"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown
                size={16}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  color: 'var(--muted-fg)',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Listings Grid ─────────────────────────────────────── */}
      <section style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '0.875rem', color: 'var(--muted-fg)', margin: 0 }}>
            {filteredListings.length} listings
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {filteredListings.map((item) => (
            <ListingCard
              key={item.id}
              listing={item}
              onBuyClick={(l) => setSelectedBuyListing(l)}
            />
          ))}
        </div>
      </section>

      <BuyEscrowModal
        isOpen={!!selectedBuyListing}
        onClose={() => setSelectedBuyListing(null)}
        listing={selectedBuyListing}
      />
    </main>
  );
}
