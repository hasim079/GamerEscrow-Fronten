import { PublicKey } from "@solana/web3.js";

export const PROGRAM_ID = new PublicKey(
    "EjhkjCLXe6aPg1zpSi9ihJemo4JvYVacQzSi8Nbczytp",
);
export const LISTING_SEED = "listing";
export const VAULT_SEED = "vault";

export type ListingStatus =
    | "listed"
    | "inEscrow"
    | "completed"
    | "inDispute"
    | "cancelled";

export interface ListingAccount {
    address: PublicKey;
    seller: PublicKey;
    buyer: PublicKey | null;
    price: bigint;
    dataHash: Uint8Array;
    status: ListingStatus;
    createdAt: bigint;
    bump: number;
    vaultBump: number;
    escrowStartTime?: bigint;
}

export interface ListingAccountWire {
    seller: PublicKey;
    buyer: PublicKey | null;
    price: bigint;
    dataHash: number[];
    status: ListingStatus;
    createdAt: bigint;
    bump: number;
    vaultBump: number;
    escrowStartTime?: bigint;
}

export interface ListingPdas {
    listing: PublicKey;
    vault: PublicKey;
    listingBump: number;
    vaultBump: number;
}

export interface EscrowEvent {
    signature: string;
    listing: PublicKey;
    status: ListingStatus;
    buyer: PublicKey | null;
    amountLamports: bigint;
    slot: number;
    occurredAt: string;
}

export interface SupabaseListingRow {
    listing_address: string;
    seller_address: string;
    buyer_address: string | null;
    price_lamports: string;
    data_hash: string;
    status: ListingStatus;
    created_at: string;
    updated_at: string;
}

export function deriveListingPdas(
    seller: PublicKey,
    dataHash: Uint8Array,
    programId: PublicKey = PROGRAM_ID,
): ListingPdas {
    const [listing, listingBump] = PublicKey.findProgramAddressSync(
        [Buffer.from(LISTING_SEED), seller.toBytes(), dataHash],
        programId,
    );
    const [vault, vaultBump] = PublicKey.findProgramAddressSync(
        [Buffer.from(VAULT_SEED), listing.toBytes()],
        programId,
    );

    return { listing, vault, listingBump, vaultBump };
}

export function listingStatusFromAnchor(value: Record<string, unknown>): ListingStatus {
    const [variant] = Object.keys(value);
    switch (variant) {
        case "listed":
            return "listed";
        case "inEscrow":
            return "inEscrow";
        case "completed":
            return "completed";
        case "inDispute":
            return "inDispute";
        case "cancelled":
            return "cancelled";
        default:
            throw new Error(`Unknown ListingStatus variant: ${variant}`);
    }
}
