'use client';

import React, { useState } from 'react';
import { Lock, Unlock, Copy, Check, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { decryptCredentials } from '../../lib/crypto';
import { useWallet } from '@solana/wallet-adapter-react';
import { requestCredentialsDecryption } from '../../lib/supabaseClient';

interface DecryptBoxProps {
  username: string;
  passwordReal: string;
  email: string;
  securityKeys?: string;
  listingId?: string;
}

export function DecryptBox({
  username,
  passwordReal,
  email,
  securityKeys,
  listingId,
}: DecryptBoxProps) {
  const [isDecrypted, setIsDecrypted] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Real data states
  const [realUser, setRealUser] = useState(username);
  const [realPass, setRealPass] = useState(passwordReal);
  const [realEmail, setRealEmail] = useState(email);
  const [realKeys, setRealKeys] = useState(securityKeys);

  const { publicKey, signMessage } = useWallet();

  const handleDecrypt = async () => {
    setIsDecrypting(true);
    try {
      if (signMessage && publicKey && listingId) {
        try {
          const result = await requestCredentialsDecryption(
            listingId,
            publicKey.toBase58(),
            signMessage
          );
          if (result.success && result.encryptedCredentials) {
            console.log('[DecryptBox] Successfully verified via Edge Function Ed25519 signature!');
            try {
              const parsed = decryptCredentials(result.encryptedCredentials, "gamer_escrow_secret_key");       
              if (parsed.username) setRealUser(parsed.username);
              if (parsed.password) setRealPass(parsed.password);
              if (parsed.email) setRealEmail(parsed.email);
              if (parsed.securityKeys) setRealKeys(parsed.securityKeys);
            } catch (e) {
              console.warn("Could not parse JSON credentials, using raw text", e);
              setRealPass(result.encryptedCredentials);
            }
            setIsDecrypted(true);
          } else {
            alert(result.error || "Decryption process failed.");
            return;
          }
        } catch (authErr) {
          console.warn('[DecryptBox] Edge function verification fallback to local reveal:', authErr);
          alert("Edge function verification failed: " + authErr);
        }
      } else {
        alert("Wallet or Listing ID missing.");
      }
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/80 pb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-foreground">Account credentials</h3>
        </div>
        <span
          className={`rounded-md px-2.5 py-0.5 text-xs font-semibold ${isDecrypted
              ? 'bg-brand/10 text-brand border border-brand/20'
              : 'bg-muted text-muted-foreground border border-border/80'
            }`}
        >
          {isDecrypted ? 'Decrypted' : 'Locked'}
        </span>
      </div>

      {/* Locked State */}
      {!isDecrypted ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-muted/50 border border-border/80 text-muted-foreground mb-4">
            <Lock className="size-6 stroke-[1.75]" />
          </div>

          <p className="text-xs text-muted-foreground max-w-sm mb-6 leading-relaxed">
            Confirm receipt with your wallet to decrypt and reveal the account credentials.
          </p>

          <button
            type="button"
            onClick={handleDecrypt}
            disabled={isDecrypting}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-2.5 text-xs font-bold text-black hover:bg-brand-hover active:scale-[0.98] transition-all shadow-sm"
          >
            {isDecrypting ? (
              <>
                <span className="size-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Decrypting via Solana Wallet...</span>
              </>
            ) : (
              <>
                <Unlock className="size-4" />
                <span>Decrypt & reveal</span>
              </>
            )}
          </button>
        </div>
      ) : (
        /* Decrypted Credentials View */
        <div className="mt-5 space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-brand">
              <ShieldCheck className="size-4" />
              <span>AES-256 Decrypted Credentials</span>
            </div>
            <button
              type="button"
              onClick={() => setIsDecrypted(false)}
              className="text-xs text-muted-foreground hover:text-foreground font-medium"
            >
              Lock credentials
            </button>
          </div>

          <div className="space-y-2.5">
            {/* Username */}
            <div className="flex items-center justify-between rounded-xl border border-border/80 bg-muted/20 p-3.5">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Username / ID
                </span>
                <span className="font-mono text-sm font-semibold text-foreground">{realUser || "N/A"}</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(realUser || "", 'user')}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-semibold text-foreground hover:border-brand/40 transition-colors"
              >
                {copiedField === 'user' ? <Check className="size-3.5 text-brand" /> : <Copy className="size-3.5 text-muted-foreground" />}
                <span>{copiedField === 'user' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Password */}
            <div className="flex items-center justify-between rounded-xl border border-border/80 bg-muted/20 p-3.5">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Password
                </span>
                <span className="font-mono text-sm font-semibold text-brand">
                  {showPassword ? (realPass || "N/A") : "••••••••••••••••"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(realPass || "", 'pass')}
                  className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-semibold text-foreground hover:border-brand/40 transition-colors"
                >
                  {copiedField === 'pass' ? <Check className="size-3.5 text-brand" /> : <Copy className="size-3.5 text-muted-foreground" />}
                  <span>{copiedField === 'pass' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between rounded-xl border border-border/80 bg-muted/20 p-3.5">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Original / Recovery Email
                </span>
                <span className="font-mono text-xs font-semibold text-foreground">{realEmail || "N/A"}</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(realEmail || "", 'email')}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-semibold text-foreground hover:border-brand/40 transition-colors"
              >
                {copiedField === 'email' ? <Check className="size-3.5 text-brand" /> : <Copy className="size-3.5 text-muted-foreground" />}
                <span>{copiedField === 'email' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Security Keys if provided */}
            {securityKeys && (
              <div className="flex items-center justify-between rounded-xl border border-border/80 bg-muted/20 p-3.5">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Backup 2FA / Security Key
                  </span>
                  <span className="font-mono text-xs font-bold text-amber-500">{realKeys}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(realKeys || "", 'sec')}
                  className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-semibold text-foreground hover:border-brand/40 transition-colors"
                >
                  {copiedField === 'sec' ? <Check className="size-3.5 text-brand" /> : <Copy className="size-3.5 text-muted-foreground" />}
                  <span>{copiedField === 'sec' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
