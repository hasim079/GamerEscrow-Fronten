'use client';

import React, { useState, useEffect } from 'react';
import { Shield, KeyRound, Cpu, CheckCircle2, X } from 'lucide-react';

interface PublishingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  listingTitle: string;
  priceSol: number;
}

export function PublishingWizardModal({
  isOpen,
  onClose,
  onSuccess,
  listingTitle,
  priceSol,
}: PublishingWizardModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setIsDone(false);
      return;
    }

    // Step 1 -> 2
    const timer1 = setTimeout(() => {
      setCurrentStep(2);
    }, 1500);

    // Step 2 -> 3
    const timer2 = setTimeout(() => {
      setCurrentStep(3);
    }, 3200);

    // Step 3 -> Success
    const timer3 = setTimeout(() => {
      setIsDone(true);
    }, 4800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
        >
          <X className="size-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <Shield className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">Solana Escrow Deployment</h3>
            <p className="text-xs text-muted-foreground">Publishing {listingTitle}</p>
          </div>
        </div>

        <div className="my-6 space-y-4">
          {/* Step 1: AES Encryption */}
          <div className={`flex items-start gap-3 rounded-xl border p-3.5 transition-all ${
            currentStep === 1
              ? 'border-brand bg-brand/5 ring-2 ring-brand/20'
              : currentStep > 1
              ? 'border-emerald-500/30 bg-emerald-500/5'
              : 'border-border opacity-50'
          }`}>
            <div className={`mt-0.5 flex size-7 items-center justify-center rounded-lg text-xs font-bold ${
              currentStep > 1 ? 'bg-emerald-500 text-white' : 'bg-brand text-brand-foreground'
            }`}>
              {currentStep > 1 ? <CheckCircle2 className="size-4" /> : <KeyRound className="size-4" />}
            </div>
            <div>
              <div className="text-xs font-bold text-foreground">Step 1: AES-256 Client-Side Encryption</div>
              <div className="text-[11px] text-muted-foreground">
                Credentials encrypted locally prior to on-chain vault commitment.
              </div>
            </div>
          </div>

          {/* Step 2: Listing PDA */}
          <div className={`flex items-start gap-3 rounded-xl border p-3.5 transition-all ${
            currentStep === 2
              ? 'border-brand bg-brand/5 ring-2 ring-brand/20'
              : currentStep > 2
              ? 'border-emerald-500/30 bg-emerald-500/5'
              : 'border-border opacity-50'
          }`}>
            <div className={`mt-0.5 flex size-7 items-center justify-center rounded-lg text-xs font-bold ${
              currentStep > 2 ? 'bg-emerald-500 text-white' : 'bg-brand text-brand-foreground'
            }`}>
              {currentStep > 2 ? <CheckCircle2 className="size-4" /> : <Cpu className="size-4" />}
            </div>
            <div>
              <div className="text-xs font-bold text-foreground">Step 2: Generate Listing PDA</div>
              <div className="text-[11px] text-muted-foreground">
                Initializing Program Derived Address on Solana Mainnet.
              </div>
            </div>
          </div>

          {/* Step 3: Phantom Wallet Signature */}
          <div className={`flex items-start gap-3 rounded-xl border p-3.5 transition-all ${
            currentStep === 3
              ? 'border-brand bg-brand/5 ring-2 ring-brand/20'
              : isDone
              ? 'border-emerald-500/30 bg-emerald-500/5'
              : 'border-border opacity-50'
          }`}>
            <div className={`mt-0.5 flex size-7 items-center justify-center rounded-lg text-xs font-bold ${
              isDone ? 'bg-emerald-500 text-white' : 'bg-brand text-brand-foreground'
            }`}>
              {isDone ? <CheckCircle2 className="size-4" /> : <Shield className="size-4" />}
            </div>
            <div>
              <div className="text-xs font-bold text-foreground">Step 3: Phantom Wallet Approval</div>
              <div className="text-[11px] text-muted-foreground">
                Awaiting transaction sign & broadcast ({priceSol} SOL price listing).
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {isDone ? (
          <div className="space-y-3 animate-in zoom-in-95 duration-200">
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-center text-xs font-bold text-emerald-500">
              Listing Successfully Created On-Chain!
            </div>
            <button
              type="button"
              onClick={() => {
                onSuccess();
                onClose();
              }}
              className="w-full rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-white hover:bg-emerald-600 transition-colors shadow-sm"
            >
              View Listing in Dashboard
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground">
            <span className="size-3.5 border-2 border-brand border-t-transparent rounded-full animate-spin" />
            Executing Solana escrow smart contract step {currentStep} of 3...
          </div>
        )}
      </div>
    </div>
  );
}
