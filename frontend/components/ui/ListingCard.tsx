'use client';

import React from 'react';
import Link from 'next/link';
import { Star, BadgeCheck } from 'lucide-react';
import { Listing } from '../../mock/mockData';

interface ListingCardProps {
  listing: Listing;
  onBuyClick?: (listing: Listing) => void;
}

export function ListingCard({ listing, onBuyClick }: ListingCardProps) {
  return (
    <div className="ge-card" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', backgroundColor: 'var(--muted-bg)' }}>
        <img
          src={(listing as any).image_url || listing.image || 'https://via.placeholder.com/400x225?text=No+Image'}
          alt={listing.title}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />

        {/* Left badges */}
        <div style={{ position: 'absolute', left: '0.75rem', top: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {listing.featured && (
            <span className="ge-badge-brand">Featured</span>
          )}
          {listing.verified && (
            <span className="ge-badge-brand-soft">
              <BadgeCheck size={12} />
              Verified
            </span>
          )}
        </div>

        {/* Right game tag */}
        <div style={{ position: 'absolute', right: '0.75rem', top: '0.75rem' }}>
          <span className="ge-badge-dark">{listing.game}</span>
        </div>
      </div>

      {/* Card body */}
      <div style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: '0.75rem', padding: '1rem' }}>
        {/* Rank + Rating */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--brand)' }}>
            {listing.rank}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--muted-fg)' }}>
            <Star size={12} style={{ fill: '#fbbf24', color: '#fbbf24' }} />
            {listing.rating}
          </span>
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.4, color: 'var(--fg)', margin: 0 }}>
          {listing.title}
        </h3>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
          {(listing.tags || []).slice(0, 3).map((tag, i) => (
            <span key={i} className="ge-badge-muted">{tag}</span>
          ))}
        </div>

        {/* Footer: Price + Buy */}
        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            borderTop: '1px solid var(--card-border)',
            paddingTop: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.6875rem', color: 'var(--muted-fg)' }}>Price</span>
            <span style={{ fontFamily: 'monospace', fontSize: '1.125rem', fontWeight: 600, color: 'var(--fg)' }}>
              {(listing as any).price_sol || listing.priceSol} SOL
            </span>
          </div>

          {onBuyClick ? (
            <button
              type="button"
              onClick={() => onBuyClick(listing)}
              className="ge-btn-primary-sm"
            >
              Buy Now
            </button>
          ) : (
            <Link href="/orders" className="ge-btn-primary-sm" style={{ textDecoration: 'none' }}>
              Buy Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
