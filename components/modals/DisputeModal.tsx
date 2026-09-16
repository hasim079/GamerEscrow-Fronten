'use client';

import React, { useState } from 'react';
import { AlertTriangle, Upload, X, ShieldAlert, Check } from 'lucide-react';

interface DisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, details: string) => void;
  orderId: string;
}

export function DisputeModal({ isOpen, onClose, onSubmit, orderId }: DisputeModalProps) {
  const [reason, setReason] = useState('Invalid Credentials / Password');
  const [details, setDetails] = useState('');
  const [fileAttached, setFileAttached] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit(reason, details);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-rose-500/30 bg-card p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
        >
          <X className="size-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="flex size-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500">
            <AlertTriangle className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">Raise Escrow Dispute</h3>
            <p className="text-xs text-muted-foreground">Order ID: {orderId} · Freezes Vault Funds</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-500 flex items-start gap-2">
            <ShieldAlert className="size-4 shrink-0 mt-0.5" />
            <span>
              Filing a dispute locks the SOL vault immediately. Our platform arbitrators will evaluate buyer & seller proof within 24 hours.
            </span>
          </div>

          {/* Reason Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Dispute Category
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-lg border border-input bg-background p-2.5 text-xs font-semibold text-foreground outline-none focus:ring-2 focus:ring-rose-500/40"
            >
              <option value="Invalid Credentials / Password">Invalid Credentials / Password Error</option>
              <option value="Account Recovered by Original Owner">Account Recovered by Original Owner</option>
              <option value="Account Banned or Restricted">Account Banned or Restricted Prior to Sale</option>
              <option value="Skins / Items Missing from Inventory">Skins / Items Missing from Inventory</option>
              <option value="Other Protocol Breach">Other Protocol Breach</option>
            </select>
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Detailed Description & Timeline
            </label>
            <textarea
              required
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe what happened when attempting to access the account..."
              className="w-full rounded-lg border border-input bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-rose-500/40 resize-none"
            />
          </div>

          {/* Proof Upload Dropzone */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Proof Artifacts (Screenshots / Video Recording)
            </label>
            <div
              onClick={() => setFileAttached(!fileAttached)}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 text-center transition-colors ${
                fileAttached
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500'
                  : 'border-border bg-muted/30 text-muted-foreground hover:border-brand'
              }`}
            >
              {fileAttached ? (
                <div className="flex items-center gap-2 text-xs font-bold">
                  <Check className="size-4 text-emerald-500" />
                  <span>Proof Artifact Attached (screenshot_error.png)</span>
                </div>
              ) : (
                <>
                  <Upload className="size-6 mb-1 text-muted-foreground/60" />
                  <span className="text-xs font-bold text-foreground">Click to upload screenshot or drag & drop</span>
                  <span className="text-[10px] text-muted-foreground mt-0.5">PNG, JPG, MP4 up to 25MB</span>
                </>
              )}
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 rounded-xl border border-border bg-background py-2.5 text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-1/2 rounded-xl bg-rose-500 py-2.5 text-xs font-bold text-white hover:bg-rose-600 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="size-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit On-Chain Dispute'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
