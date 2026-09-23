export interface Listing {
  id: string;
  escrowPda?: string;
  game:
    | 'VALORANT'
    | 'Fortnite'
    | 'League of Legends'
    | 'Counter-Strike 2 (CS2)'
    | 'EA Sports FC 26'
    | 'PUBG: BATTLEGROUNDS'
    | 'Valorant'
    | 'CS2'
    | 'LoL'
    | string;
  gameSlug?: string;
  category: 'FPS' | 'MMORPG' | 'Battle Royale' | 'Racing' | 'Strategy' | 'Action RPG' | 'MOBA' | 'Sports';
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
  'VALORANT',
  'Fortnite',
  'League of Legends',
  'Counter-Strike 2 (CS2)',
  'EA Sports FC 26',
  'PUBG: BATTLEGROUNDS',
  'FPS',
  'Battle Royale',
  'MOBA',
  'Sports',
];

export const MOCK_LISTINGS: Listing[] = [
  {
    id: 'list-1',
    game: 'VALORANT',
    gameSlug: 'valorant',
    category: 'FPS',
    title: 'Radiant Account · Prime Vandal & Kuronami Set',
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
    image: '/images/valorant.jpg',
    tags: ['Prime Vandal', 'Kuronami Melee', 'Radiant Top 500'],
    description: 'Stacked competitive FPS account with peak Radiant status (Top 500). Contains 14 Knife skins, complete battle passes from Season 1 to 8, and full agent unlocks.',
    escrowDetails: {
      vaultAddress: 'EscrowV1_9a8f2k...3x8q',
      timelockHours: 24,
      inspectionPeriodHours: 12,
    },
  },
  {
    id: 'list-2',
    game: 'Counter-Strike 2 (CS2)',
    gameSlug: 'cs2',
    category: 'FPS',
    title: 'Premier 25k ELO · Karambit Fade FN 0.01 + Howl',
    rank: 'Premier 25,400',
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
    image: '/images/cs2.jpg',
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
    game: 'League of Legends',
    gameSlug: 'lol',
    category: 'MOBA',
    title: 'Challenger S14 · PAX Sivir & All Champions',
    rank: 'Challenger 850LP',
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
    image: '/images/lol.jpg',
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
    game: 'Fortnite',
    gameSlug: 'fortnite',
    category: 'Battle Royale',
    title: 'OG Renegade Raider · Black Knight & Minty Axe',
    rank: 'Unreal Rank',
    rating: 4.9,
    priceSol: 18.5,
    priceUsd: 2682.5,
    seller: {
      address: '9pLK...44mA',
      username: 'LockerCollector',
      verified: true,
      rating: 4.95,
      completedSales: 98,
    },
    featured: true,
    verified: true,
    image: '/images/fortnite.jpg',
    tags: ['Renegade Raider', 'Black Knight', 'Minty Pickaxe'],
    description: 'Extremely rare Chapter 1 Season 1 OG Fortnite account. Features Renegade Raider, Black Knight, Travis Scott, and Merry Mint Axe. Full email access.',
    escrowDetails: {
      vaultAddress: 'EscrowV1_2c9v8x...6m3n',
      timelockHours: 24,
      inspectionPeriodHours: 12,
    },
  },
  {
    id: 'list-5',
    game: 'EA Sports FC 26',
    gameSlug: 'ea-sports-fc-26',
    category: 'Sports',
    title: 'FC 26 Ultimate Team · R9, Gullit & Mbappe Squad',
    rank: 'Division 1 / FUT Champs',
    rating: 4.7,
    priceSol: 11.2,
    priceUsd: 1624.0,
    seller: {
      address: '4nYY...33zT',
      username: 'FutChampsKing',
      verified: true,
      rating: 4.88,
      completedSales: 51,
    },
    featured: false,
    verified: true,
    image: '/images/fc26.jpg',
    tags: ['Ronaldo R9', 'Ruud Gullit', '15M Transfer Profit'],
    description: 'Elite FC 26 Ultimate Team squad with Ronaldo R9 Icon, Ruud Gullit, Mbappe, and 15M coin transfer profit. Rank 1 weekend league qualifier.',
    escrowDetails: {
      vaultAddress: 'EscrowV1_1z3x5v...7b9n',
      timelockHours: 24,
      inspectionPeriodHours: 12,
    },
  },
  {
    id: 'list-6',
    game: 'PUBG: BATTLEGROUNDS',
    gameSlug: 'pubg-battlegrounds',
    category: 'Battle Royale',
    title: 'PUBG Grandmaster · Progressive Beryl M762 Lv.10',
    rank: 'Grandmaster',
    rating: 4.6,
    priceSol: 7.5,
    priceUsd: 1087.5,
    seller: {
      address: '2wXX...77bC',
      username: 'ChickenDinnerPro',
      verified: false,
      rating: 4.62,
      completedSales: 19,
    },
    featured: false,
    verified: false,
    image: '/images/pubg.jpg',
    tags: ['Progressive Beryl Lv10', 'PGC 2023 Bundle', 'Top 100 Leaderboard'],
    description: 'Competitive PUBG account with level 10 Progressive Beryl M762 skin, full PGC esports sets, 4,000+ hours, and verified Krafton ID.',
    escrowDetails: {
      vaultAddress: 'EscrowV1_8m4n2b...9v1x',
      timelockHours: 12,
      inspectionPeriodHours: 6,
    },
  },
];

export const MOCK_DRAFTS: DraftListing[] = [
  {
    id: 'draft-101',
    game: 'VALORANT',
    title: 'Radiant Account - 22 Knife Skins',
    priceSol: 9.4,
    lastEdited: '2 hours ago',
    category: 'FPS',
  },
  {
    id: 'draft-102',
    game: 'PUBG: BATTLEGROUNDS',
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
    listingTitle: 'Radiant Account · Prime Vandal & Kuronami Set',
    game: 'VALORANT',
    gameImage: '/images/valorant.jpg',
    priceSol: 12.5,
    priceUsd: 1812.5,
    sellerAddress: 'apex.sol (7xKX...9q2W)',
    sellerUsername: 'apex.sol',
    buyerAddress: 'nova.sol (9aB3...3n7m)',
    status: 'Credentials Sent',
    currentStep: 2,
    createdAt: '2026-09-14T19:30:00Z',
    expiresAt: new Date(Date.now() + 42 * 60 * 1000 + 50 * 1000).toISOString(),
    escrowVault: 'EscrowVau1t9kQ2mP...7xR4nZ8dW',
    secretPayload: {
      username: 'riot_apex_radiant',
      passwordMasked: '••••••••••••',
      passwordReal: 'Radiant#Kuronami2026!Pass',
      email: 'apex.seller@gamerescrow.org',
      securityKeys: 'VAL-KEY-9921-X1047',
    },
  },
  {
    id: '#161-1052',
    listingId: 'list-6',
    listingTitle: 'PUBG Grandmaster · Progressive Beryl M762 Lv.10',
    game: 'PUBG: BATTLEGROUNDS',
    gameImage: '/images/pubg.jpg',
    priceSol: 7.5,
    priceUsd: 1087.5,
    sellerAddress: 'krafton.sol (3mPR...8y2p)',
    sellerUsername: 'krafton.sol',
    buyerAddress: 'echo.sol (5zQQ...11kP)',
    status: 'Disputed',
    currentStep: 3,
    createdAt: '2026-09-12T14:30:00Z',
    expiresAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    escrowVault: 'EscrowVau1t4b7x1z...8y2pL3mP',
    secretPayload: {
      username: 'pubg_grandmaster_echo',
      passwordMasked: '••••••••••••',
      passwordReal: 'PubgBeryl_2026Pass',
      email: 'kraftonvault@gamerescrow.org',
      securityKeys: 'KRAFTON-GUARD-A1052',
    },
    disputeReason: 'Account recovered by seller via original creation email within 2 hours of delivery.',
  },
  {
    id: '#161-2021',
    listingId: 'list-4',
    listingTitle: 'OG Renegade Raider · Black Knight & Minty Axe',
    game: 'Fortnite',
    gameImage: '/images/fortnite.jpg',
    priceSol: 18.5,
    priceUsd: 2682.5,
    sellerAddress: 'orbit.sol (9pLK...44mA)',
    sellerUsername: 'orbit.sol',
    buyerAddress: 'kestrel.sol (2wXX...77bC)',
    status: 'Disputed',
    currentStep: 3,
    createdAt: '2026-09-10T10:05:00Z',
    expiresAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    escrowVault: 'EscrowVau1t2c9v8x...6m3n9pLK',
    secretPayload: {
      username: 'fortnite_og_orbit',
      passwordMasked: '••••••••••••',
      passwordReal: 'RenegadePass2026#FN',
      email: 'orbit.seller@gamerescrow.org',
    },
    disputeReason: 'Locker mismatch: Listing claimed Renegade Raider, but account has standard Season 3 Battle Pass.',
  },
];

export const MOCK_DISPUTES: DisputeItem[] = [
  {
    id: 'DISP-1047',
    orderId: '#161-1047',
    listingTitle: 'Radiant Account · Prime Vandal & Kuronami Set',
    game: 'VALORANT',
    amountSol: 12.5,
    buyerAddress: 'nova.sol',
    buyerProof: {
      text: 'Attempted to login with decrypted credentials. Launcher returns "Authentication error: credentials invalid". Seller has not sent updated password.',
      attachments: ['/images/valorant.jpg'],
    },
    sellerAddress: 'apex.sol',
    sellerProof: {
      text: 'Original Riot credentials sent directly through on-chain escrow. 2FA email code was provided immediately. Buyer did not verify correctly.',
      attachments: ['/images/valorant.jpg'],
    },
    createdAt: '2026-09-14 20:15',
    status: 'Pending Review',
  },
  {
    id: 'DISP-1052',
    orderId: '#161-1052',
    listingTitle: 'PUBG Grandmaster · Progressive Beryl M762 Lv.10',
    game: 'PUBG: BATTLEGROUNDS',
    amountSol: 7.5,
    buyerAddress: 'echo.sol',
    buyerProof: {
      text: 'Steam account was pulled back by the seller using original creation invoice. Email password changed without my confirmation.',
      attachments: ['/images/pubg.jpg'],
    },
    sellerAddress: 'krafton.sol',
    sellerProof: {
      text: 'I submitted Steam dispute resolution ticket. Suspicious login from VPN flagged the account and Steam locked it temporarily.',
      attachments: ['/images/pubg.jpg'],
    },
    createdAt: '2026-09-12 15:40',
    status: 'Pending Review',
  },
  {
    id: 'DISP-2021',
    orderId: '#161-2021',
    listingTitle: 'OG Renegade Raider · Black Knight & Minty Axe',
    game: 'Fortnite',
    amountSol: 18.5,
    buyerAddress: 'kestrel.sol',
    buyerProof: {
      text: 'Listing advertised Renegade Raider with original email. Upon logging in, Epic ID has been changed and locker skins do not match.',
      attachments: ['/images/fortnite.jpg'],
    },
    sellerAddress: 'orbit.sol',
    sellerProof: {
      text: 'The correct Epic Games login was provided. Buyer accessed the account and changed the 2FA authenticator.',
      attachments: ['/images/fortnite.jpg'],
    },
    createdAt: '2026-09-10 11:20',
    status: 'Pending Review',
  },
];
