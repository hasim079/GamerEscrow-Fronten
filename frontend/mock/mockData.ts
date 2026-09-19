export interface Listing {
  id: string;
  escrowPda?: string;
  game: 'Valorant' | 'CS2' | 'LoL' | 'Steam' | 'Vanguard Strike' | 'Ashen Realm' | 'Aethermoor' | 'Dropzone 99' | 'Velocity X' | 'Void Command';
  gameSlug: string;
  category: 'FPS' | 'MMORPG' | 'Battle Royale' | 'Racing' | 'Strategy' | 'Action RPG' | 'MOBA';
  title: string;
  rank: string;
  rating: number;
  priceSol: number;
  priceUsd: number;
  seller: {
    address: string;
    username: string;
    verified: boolean;
    rating: number;
    completedSales: number;
  };
  featured: boolean;
  verified: boolean;
  image: string;
  tags: string[];
  description: string;
  escrowDetails: {
    vaultAddress: string;
    timelockHours: number;
    inspectionPeriodHours: number;
  };
}

export interface DraftListing {
  id: string;
  game: string;
  title: string;
  priceSol: number;
  lastEdited: string;
  category: string;
}

export interface EscrowOrder {
  id: string;
  listingId: string;
  listingTitle: string;
  game: string;
  gameImage: string;
  priceSol: number;
  priceUsd: number;
  sellerAddress: string;
  sellerUsername: string;
  buyerAddress: string;
  status: 'Vault Locked' | 'Credentials Sent' | 'Buyer Reviewing' | 'Completed' | 'Disputed';
  currentStep: number; // 1: Lock Funds, 2: Receive Info, 3: Inspect/Test, 4: Complete
  createdAt: string;
  expiresAt: string; // ISO string or timestamp
  escrowVault: string;
  secretPayload: {
    username: string;
    passwordMasked: string;
    passwordReal: string;
    email: string;
    securityKeys?: string;
  };
  disputeReason?: string;
}

export interface DisputeItem {
  id: string;
  orderId: string;
  listingTitle: string;
  game: string;
  amountSol: number;
  buyerAddress: string;
  buyerProof: {
    text: string;
    attachments: string[];
  };
  sellerAddress: string;
  sellerProof: {
    text: string;
    attachments: string[];
  };
  createdAt: string;
  status: 'Pending Review' | 'Resolved - Refunded' | 'Resolved - Released';
  vaultAddress?: string;
}

export interface UserProfile {
  username: string;
  walletAddress: string;
  verified: boolean;
  memberSince: string;
  totalVolumeSol: number;
  trustScore: number;
  avatarUrl: string;
  activeListingsCount: number;
  completedOrdersCount: number;
}

export const MOCK_STATS = {
  volumeSecuredSol: 184920,
  assetsTraded: 47318,
  disputeRatePct: 0.4,
  solPriceUsd: 145.0,
};

export const MOCK_PROFILE: UserProfile = {
  username: 'Radiant_Trader_99',
  walletAddress: '7xKX89q2Wp0m1zX4v9a8f2k3x8qL',
  verified: true,
  memberSince: 'March 2024',
  totalVolumeSol: 248.5,
  trustScore: 99.4,
  avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=300&q=80',
  activeListingsCount: 3,
  completedOrdersCount: 28,
};

export const MOCK_CATEGORIES = [
  'All',
  'Valorant',
  'CS2',
  'LoL',
  'Steam',
  'FPS',
  'MMORPG',
  'Battle Royale',
  'Racing',
  'Strategy',
  'Action RPG',
];

export const MOCK_LISTINGS: Listing[] = [
  {
    id: 'list-1',
    game: 'Valorant',
    gameSlug: 'valorant',
    category: 'FPS',
    title: 'Radiant Account · Full Agent Roster',
    rank: 'Radiant',
    rating: 4.9,
    priceSol: 12.5,
    priceUsd: 1812.5,
    seller: {
      address: '7xKX...9q2W',
      username: 'ApexTrader',
      verified: true,
      rating: 4.98,
      completedSales: 142,
    },
    featured: true,
    verified: true,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    tags: ['Prime Vandal', 'Elderflame', 'Reaver Set'],
    description: 'Stacked competitive FPS account with peak Radiant status (Top 500). Contains 14 Knife skins, complete battle passes from Season 1 to 8, and full agent unlocks.',
    escrowDetails: {
      vaultAddress: 'EscrowV1_9a8f2k...3x8q',
      timelockHours: 24,
      inspectionPeriodHours: 12,
    },
  },
  {
    id: 'list-2',
    game: 'CS2',
    gameSlug: 'cs2',
    category: 'FPS',
    title: 'Global Elite · Karambit Fade FN 0.01',
    rank: 'Global Elite',
    rating: 5.0,
    priceSol: 24.0,
    priceUsd: 3480.0,
    seller: {
      address: '3mPR...88vL',
      username: 'SkinVaults',
      verified: true,
      rating: 5.0,
      completedSales: 210,
    },
    featured: true,
    verified: true,
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
    tags: ['Karambit Fade', 'Howl FT', 'Medusa MW'],
    description: 'Prime CS2 account with 3,500 hours logged. Inventory includes Karambit Fade FN (98% fade), M4A4 Howl FT, and AWP Medusa. Full original creation email included.',
    escrowDetails: {
      vaultAddress: 'EscrowV1_4b7x1z...8y2p',
      timelockHours: 48,
      inspectionPeriodHours: 24,
    },
  },
  {
    id: 'list-3',
    game: 'LoL',
    gameSlug: 'lol',
    category: 'MOBA',
    title: 'Challenger S13 · PAX Sivir & All Champions',
    rank: 'Challenger',
    rating: 4.8,
    priceSol: 9.8,
    priceUsd: 1421.0,
    seller: {
      address: '5zQQ...11kP',
      username: 'MidGapGod',
      verified: true,
      rating: 4.85,
      completedSales: 45,
    },
    featured: false,
    verified: true,
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    tags: ['PAX Sivir', 'Challenger Jacket', '500k Blue Essence'],
    description: 'Rare legacy League of Legends account with unobtainable PAX Sivir skin, 168 Champions unlocked, 450+ total skins including 6 Ultimate skins.',
    escrowDetails: {
      vaultAddress: 'EscrowV1_7v2m9p...1q4w',
      timelockHours: 24,
      inspectionPeriodHours: 12,
    },
  },
  {
    id: 'list-4',
    game: 'Steam',
    gameSlug: 'steam',
    category: 'FPS',
    title: '15-Year Old Steam Level 100 · 450 Games',
    rank: 'Level 100',
    rating: 4.9,
    priceSol: 18.5,
    priceUsd: 2682.5,
    seller: {
      address: '9pLK...44mA',
      username: 'SteamCollector',
      verified: true,
      rating: 4.95,
      completedSales: 98,
    },
    featured: false,
    verified: true,
    image: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=800&q=80',
    tags: ['15-Year Coin', '450 AAA Games', 'Steam Level 100'],
    description: 'Clean Steam account without any VAC or community bans. Contains 450+ AAA titles (Cyberpunk, Elden Ring, GTA V, RDR2), Level 100 profile badge.',
    escrowDetails: {
      vaultAddress: 'EscrowV1_2c9v8x...6m3n',
      timelockHours: 24,
      inspectionPeriodHours: 12,
    },
  },
  {
    id: 'list-5',
    game: 'Vanguard Strike',
    gameSlug: 'vanguard-strike',
    category: 'FPS',
    title: 'Immortal 3 Account · Champions Vandal Bundle',
    rank: 'Immortal 3',
    rating: 4.6,
    priceSol: 7.5,
    priceUsd: 1087.5,
    seller: {
      address: '2wXX...77bC',
      username: 'VanguardMain',
      verified: false,
      rating: 4.62,
      completedSales: 19,
    },
    featured: false,
    verified: false,
    image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80',
    tags: ['Champions 2021', 'Kuronami Knife', 'Sovereign Ghost'],
    description: 'Immortal 3 rank account with high MMR (+24 per win). Includes rare Champions 2021 Vandal bundle and Kuronami melee.',
    escrowDetails: {
      vaultAddress: 'EscrowV1_8m4n2b...9v1x',
      timelockHours: 12,
      inspectionPeriodHours: 6,
    },
  },
  {
    id: 'list-6',
    game: 'Ashen Realm',
    gameSlug: 'ashen-realm',
    category: 'Action RPG',
    title: 'Level 100 Sorceress · Uber Unique Vault',
    rank: 'Level 100',
    rating: 4.7,
    priceSol: 11.2,
    priceUsd: 1624.0,
    seller: {
      address: '4nYY...33zT',
      username: 'SorceressPro',
      verified: true,
      rating: 4.88,
      completedSales: 51,
    },
    featured: false,
    verified: true,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    tags: ['Harlequin Crest', 'Starless Skies', 'Grandfather'],
    description: 'Maxed endgame Sorceress with all Uber Uniques (Shako, Starless Skies, Grandfather). Clears T100 Pit in under 2 minutes.',
    escrowDetails: {
      vaultAddress: 'EscrowV1_1z3x5v...7b9n',
      timelockHours: 24,
      inspectionPeriodHours: 12,
    },
  },
];

export const MOCK_DRAFTS: DraftListing[] = [
  {
    id: 'draft-101',
    game: 'Vanguard Strike',
    title: 'Immortal Account - 22 Knife Skins',
    priceSol: 9.4,
    lastEdited: '2 hours ago',
    category: 'FPS',
  },
  {
    id: 'draft-102',
    game: 'Dropzone 99',
    title: 'Max Prestige - All Operators',
    priceSol: 5.1,
    lastEdited: '1 day ago',
    category: 'Battle Royale',
  },
];

export const MOCK_ORDERS: EscrowOrder[] = [
  {
    id: '#161-1047',
    listingId: 'list-1',
    listingTitle: 'Immortal Account - 22 Knife Skins',
    game: 'Vanguard Strike',
    gameImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    priceSol: 15.0,
    priceUsd: 2175.0,
    sellerAddress: 'raven.sol (7xKX...9q2W)',
    sellerUsername: 'raven.sol',
    buyerAddress: 'nova.sol (9aB3...3n7m)',
    status: 'Credentials Sent',
    currentStep: 2,
    createdAt: '2026-09-14T19:30:00Z',
    expiresAt: new Date(Date.now() + 42 * 60 * 1000 + 50 * 1000).toISOString(),
    escrowVault: 'EscrowVau1t9kQ2mP...7xR4nZ8dW',
    secretPayload: {
      username: 'vanguard_raven_immortal',
      passwordMasked: '••••••••••••',
      passwordReal: 'Raven#KnifeSkin2026!Vault',
      email: 'raven.seller@gamerescrow.org',
      securityKeys: 'SOL-KEY-9921-X1047',
    },
  },
  {
    id: '#161-1052',
    listingId: 'list-2',
    listingTitle: 'Apex Predator S18 · Heirloom Wraith Kunai',
    game: 'Dropzone 99',
    gameImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
    priceSol: 4.4,
    priceUsd: 638.0,
    sellerAddress: 'apex.sol (3mPR...8y2p)',
    sellerUsername: 'apex.sol',
    buyerAddress: 'echo.sol (5zQQ...11kP)',
    status: 'Disputed',
    currentStep: 3,
    createdAt: '2026-09-12T14:30:00Z',
    expiresAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    escrowVault: 'EscrowVau1t4b7x1z...8y2pL3mP',
    secretPayload: {
      username: 'apex_predator_echo',
      passwordMasked: '••••••••••••',
      passwordReal: 'ApexKunaiWraith_2026Pass',
      email: 'apexvault@gamerescrow.org',
      securityKeys: 'STEAM-GUARD-A1052',
    },
    disputeReason: 'Account recovered by seller via original creation email within 2 hours of delivery.',
  },
  {
    id: '#161-2021',
    listingId: 'list-4',
    listingTitle: 'Rank 1 Oceanic · All Mythic Weapons',
    game: 'Ashen Realm',
    gameImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    priceSol: 9.9,
    priceUsd: 1435.5,
    sellerAddress: 'orbit.sol (9pLK...44mA)',
    sellerUsername: 'orbit.sol',
    buyerAddress: 'kestrel.sol (2wXX...77bC)',
    status: 'Disputed',
    currentStep: 3,
    createdAt: '2026-09-10T10:05:00Z',
    expiresAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    escrowVault: 'EscrowVau1t2c9v8x...6m3n9pLK',
    secretPayload: {
      username: 'oceanic_mythic_orbit',
      passwordMasked: '••••••••••••',
      passwordReal: 'MythicPass2026#Ashen',
      email: 'orbit.seller@gamerescrow.org',
    },
    disputeReason: 'Rank mismatch: Listing claimed Rank 1 Oceanic, but in-game profile is Diamond 2.',
  },
];

export const MOCK_DISPUTES: DisputeItem[] = [
  {
    id: 'DISP-1047',
    orderId: '#161-1047',
    listingTitle: 'Immortal Account - 22 Knife Skins',
    game: 'Vanguard Strike',
    amountSol: 15.0,
    buyerAddress: 'nova.sol',
    buyerProof: {
      text: 'Attempted to login with decrypted credentials. Launcher returns "Authentication error: credentials invalid". Seller has not sent updated password.',
      attachments: ['https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80'],
    },
    sellerAddress: 'raven.sol',
    sellerProof: {
      text: 'Original Riot credentials sent directly through on-chain escrow. 2FA email code was provided immediately. Buyer did not verify correctly.',
      attachments: ['https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=400&q=80'],
    },
    createdAt: '2026-09-14 20:15',
    status: 'Pending Review',
  },
  {
    id: 'DISP-1052',
    orderId: '#161-1052',
    listingTitle: 'Apex Predator S18 · Heirloom Wraith Kunai',
    game: 'Dropzone 99',
    amountSol: 4.4,
    buyerAddress: 'echo.sol',
    buyerProof: {
      text: 'EA account was pulled back by the seller using original creation invoice. Email password changed without my confirmation.',
      attachments: ['https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=400&q=80'],
    },
    sellerAddress: 'apex.sol',
    sellerProof: {
      text: 'I submitted EA dispute resolution ticket. Suspicious login from VPN flagged the account and EA locked it temporarily.',
      attachments: ['https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=400&q=80'],
    },
    createdAt: '2026-09-12 15:40',
    status: 'Pending Review',
  },
  {
    id: 'DISP-2021',
    orderId: '#161-2021',
    listingTitle: 'Rank 1 Oceanic · All Mythic Weapons',
    game: 'Ashen Realm',
    amountSol: 9.9,
    buyerAddress: 'kestrel.sol',
    buyerProof: {
      text: 'Listing advertised Rank 1 Oceanic with all mythic weapons. Upon logging in, rank is only Diamond 2 and mythic weapons are expired seasonal rentals.',
      attachments: ['https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=400&q=80'],
    },
    sellerAddress: 'orbit.sol',
    sellerProof: {
      text: 'Season reset occurred yesterday which lowered displayed rank. The mythic weapons can be refreshed with available inventory tokens.',
      attachments: ['https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80'],
    },
    createdAt: '2026-09-10 11:20',
    status: 'Pending Review',
  },
];
