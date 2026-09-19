import CryptoJS from "crypto-js";

export interface EncryptedPayload {
  ciphertext: string;
  iv: string;
  dataHashBytes: number[];
  dataHashHex: string;
}

/**
 * Computes a standard SHA-256 hash of any input (string, object, or buffer).
 * Returns both 32-byte array (for Solana Anchor) and hex string (for Supabase).
 */
export function computeSha256(input: string | Record<string, any>): {
  hashBytes: number[];
  hashHex: string;
} {
  const content = typeof input === "string" ? input : JSON.stringify(input);
  const hashWordArray = CryptoJS.SHA256(content);
  const hashHex = hashWordArray.toString(CryptoJS.enc.Hex);

  // Convert WordArray to exactly 32-byte number array for Anchor [u8; 32]
  const hashBytes: number[] = [];
  const sigBytes = hashWordArray.sigBytes || 32;
  for (let i = 0; i < sigBytes; i++) {
    const byte = (hashWordArray.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
    hashBytes.push(byte);
  }

  return { hashBytes: hashBytes.slice(0, 32), hashHex };
}

/**
 * Encrypts game account credentials using AES-256-CBC with a random 128-bit IV.
 * Computes deterministic SHA-256 data_hash from the raw credentials.
 */
export function encryptCredentials(
  credentials: Record<string, any>,
  customKey?: string
): EncryptedPayload {
  const jsonStr = JSON.stringify(credentials);
  const { hashBytes, hashHex } = computeSha256(jsonStr);

  // Generate a random 16-byte IV
  const iv = CryptoJS.lib.WordArray.random(16);
  const key = customKey || CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);

  const encrypted = CryptoJS.AES.encrypt(jsonStr, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return {
    ciphertext: encrypted.toString(),
    iv: iv.toString(CryptoJS.enc.Hex),
    dataHashBytes: hashBytes,
    dataHashHex: hashHex,
  };
}

/**
 * Decrypts ciphertext using AES-256.
 */
export function decryptCredentials(
  ciphertext: string,
  key: string,
  ivHex?: string
): Record<string, any> {
  try {
    let decrypted: CryptoJS.lib.WordArray;
    if (ivHex) {
      const iv = CryptoJS.enc.Hex.parse(ivHex);
      decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
    } else {
      decrypted = CryptoJS.AES.decrypt(ciphertext, key);
    }

    const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
    if (!decryptedStr) {
      throw new Error("Decryption produced empty result. Invalid key or corrupted data.");
    }
    return JSON.parse(decryptedStr);
  } catch (err: any) {
    throw new Error(`Failed to decrypt credentials: ${err.message}`);
  }
}

/**
 * Generates a cryptographic random nonce for wallet signature challenge.
 */
export function generateNonce(): string {
  return CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
}

/**
 * Builds deterministic challenge message matching the Edge Function format.
 */
export function buildChallengeMessage(
  listingId: string,
  nonce: string,
  timestamp: number
): string {
  return `GamerEscrow Decrypt Request\nListing: ${listingId}\nNonce: ${nonce}\nTimestamp: ${timestamp}`;
}
