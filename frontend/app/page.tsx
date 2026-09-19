import { fetchMarketplaceListings } from '../lib/supabaseClient';
import MarketplaceClient from './MarketplaceClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function MarketplacePage() {
  const listings = await fetchMarketplaceListings();
  return <MarketplaceClient initialListings={listings} />;
}
