'use client';

import React, { useState, useRef } from 'react';
import { MessageSquareWarning, Upload, X, Check } from 'lucide-react';

interface SellerDisputeResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (response: string, file: File | null) => Promise<void>;
  disputeReason: string;
  buyerClaim: string;
  listingTitle: string;
}

export function SellerDisputeResponseModal({
  isOpen,
  onClose,
  onSubmit,
  disputeReason,
  buyerClaim,
  listingTitle,
}: SellerDisputeResponseModalProps) {
  const [response, setResponse] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!response.trim()) return alert('Please provide your response.');
    setIsSubmitting(true);
    try {
      await onSubmit(response, file);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error submitting response');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-brand/30 bg-card p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
        >
          <X className="size-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <MessageSquareWarning className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">Respond to Dispute</h3>
            <p className="text-xs text-muted-foreground">{listingTitle}</p>
          </div>
        </div>

        {/* Buyer's claim summary */}
        <div className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/[0.04] p-3.5 space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">Buyer's Claim</span>
          <div className="text-xs font-semibold text-foreground">{disputeReason}</div>
          {buyerClaim && (
            <p className="text-xs text-muted-foreground leading-relaxed">{buyerClaim}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Seller response */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Your Response
            </label>
            <textarea
              required
              rows={3}
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Explain your side — provide timeline, delivery confirmation, or any relevant details..."
              className="w-full rounded-lg border border-input bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-brand/40 resize-none"
            />
          </div>

          {/* Evidence upload */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Evidence (Screenshot / Video)
            </label>
            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 text-center transition-colors ${
                file
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500'
                  : 'border-border bg-muted/30 text-muted-foreground hover:border-brand'
              }`}
            >
              {file ? (
                <div className="flex items-center gap-2 text-xs font-bold">
                  <Check className="size-4 text-emerald-500" />
                  <span>Evidence Attached ({file.name})</span>
                </div>
              ) : (
                <>
                  <Upload className="size-6 mb-1 text-muted-foreground/60" />
                  <span className="text-xs font-bold text-foreground">Click to upload screenshot or video</span>
                  <span className="text-[10px] text-muted-foreground mt-0.5">PNG, JPG, MP4 up to 25MB</span>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
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
              className="w-1/2 rounded-xl bg-brand py-2.5 text-xs font-bold text-black hover:bg-brand-hover transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="size-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Response'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
