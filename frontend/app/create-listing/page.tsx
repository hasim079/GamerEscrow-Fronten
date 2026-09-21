'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ShieldCheck, ArrowRight, ArrowLeft, Lock, KeyRound } from 'lucide-react';
import { PublishingWizardModal } from '../../components/modals/PublishingWizardModal';
import { createListingRecord } from '../../lib/supabaseClient';
import { useWallet } from '@solana/wallet-adapter-react';

interface GameOption {
  id: string;
  name: string;
  image: string;
}

const GAME_OPTIONS: GameOption[] = [
  {
    id: 'vanguard-strike',
    name: 'Vanguard Strike',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'aethermoor',
    name: 'Aethermoor',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'dropzone-99',
    name: 'Dropzone 99',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'velocity-x',
    name: 'Velocity X',
    image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'void-command',
    name: 'Void Command',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'ashen-realm',
    name: 'Ashen Realm',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=400&q=80',
  },
];

export default function CreateListingWizardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedGame, setSelectedGame] = useState('Vanguard Strike');

  // Account details
  const [title, setTitle] = useState('Immortal Account - 22 Knife Skins');
  const [rank, setRank] = useState('Immortal 3');
  const [priceSol, setPriceSol] = useState('9.4');
  const [description, setDescription] = useState('Full knife skin collection with original email transfer.');

  // Confidential credentials
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [securityKeys, setSecurityKeys] = useState('');

  const [isPublishingOpen, setIsPublishingOpen] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const { publicKey } = useWallet();

  const handleSaveDraft = async () => {
    if (!publicKey) return alert("Please connect wallet first.");
    setIsSavingDraft(true);
    try {
      await createListingRecord({
        seller_pubkey: publicKey.toBase58(),
        buyer_pubkey: null,
        title,
        game: selectedGame,
        price_sol: parseFloat(priceSol) || 0,
        data_hash: "draft_no_hash",
        encrypted_credentials: "draft_no_credentials",
        status: "Draft",
        rank,
        description,
      });
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      alert("Failed to save draft");
    } finally {
      setIsSavingDraft(false);
    }
  };

  const wizardSteps = [
    { num: 1, label: 'Select Game' },
    { num: 2, label: 'Account Details' },
    { num: 3, label: 'Credentials' },
    { num: 4, label: 'Review' },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-6">
        <span className="text-xs font-semibold text-muted-foreground block">New Listing</span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-0.5">
          Create a listing
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Your credentials are encrypted and only released from escrow after payment settles.
        </p>
      </div>

      {/* Stepper matching screenshot 6 */}
      <div className="mb-8 flex items-center justify-between border-b border-border/80 pb-5">
        {wizardSteps.map((step, idx) => {
          const isDone = currentStep > step.num;
          const isCurrent = currentStep === step.num;

          return (
            <React.Fragment key={step.num}>
              <div className="flex flex-col items-center sm:flex-row sm:gap-2.5">
                <div
                  className={`flex size-6 sm:size-7 items-center justify-center rounded-full text-xs font-bold transition-all ${isDone
                    ? 'bg-brand text-black font-bold'
                    : isCurrent
                      ? 'border-2 border-brand bg-brand/10 text-brand'
                      : 'border border-border/80 bg-muted/40 text-muted-foreground'
                    }`}
                >
                  {isDone ? <Check className="size-3.5 stroke-[2.5]" /> : step.num}
                </div>
                <span
                  className={`text-xs mt-1 sm:mt-0 ${isCurrent
                    ? 'text-foreground font-bold'
                    : isDone
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground'
                    }`}
                >
                  {step.label}
                </span>
              </div>

              {idx < wizardSteps.length - 1 && (
                <div className="hidden flex-1 sm:block px-3">
                  <div
                    className={`h-0.5 w-full rounded-full ${currentStep > step.num ? 'bg-brand' : 'bg-border/60'
                      }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Wizard Step 1: Select Game */}
      {currentStep === 1 && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-sm font-bold text-foreground">Which game is this for?</h2>
          <p className="text-xs text-muted-foreground mt-0.5 mb-5">
            Select the title your asset belongs to.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {GAME_OPTIONS.map((g) => {
              const isSelected = selectedGame === g.name;

              return (
                <div
                  key={g.id}
                  onClick={() => setSelectedGame(g.name)}
                  className={`group relative cursor-pointer rounded-2xl border overflow-hidden transition-all ${isSelected
                    ? 'border-brand ring-2 ring-brand/30 shadow-md'
                    : 'border-border bg-card hover:border-brand/40'
                    }`}
                >
                  <div className="relative h-28 w-full overflow-hidden bg-muted">
                    <img
                      src={g.image}
                      alt={g.name}
                      className="size-full object-cover transition-transform group-hover:scale-105"
                    />
                    {isSelected && (
                      <div className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-brand text-black shadow-md">
                        <Check className="size-3.5 stroke-[2.5]" />
                      </div>
                    )}
                  </div>
                  <div className="p-3 text-center">
                    <span className={`text-xs font-bold ${isSelected ? 'text-brand' : 'text-foreground'}`}>
                      {g.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Wizard Step 2: Account Details */}
      {currentStep === 2 && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-foreground">Account Details</h2>
          <p className="text-xs text-muted-foreground">
            Provide the title, rank, and asking price for {selectedGame}.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">
                Listing Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-border bg-muted/20 px-3.5 py-2.5 text-xs font-semibold text-foreground outline-none focus:border-brand"
                placeholder="e.g. Immortal Account - 22 Knife Skins"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">
                  Rank / Level
                </label>
                <input
                  type="text"
                  value={rank}
                  onChange={(e) => setRank(e.target.value)}
                  className="w-full rounded-xl border border-border bg-muted/20 px-3.5 py-2.5 text-xs font-semibold text-foreground outline-none focus:border-brand"
                  placeholder="e.g. Immortal 3"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">
                  Price in SOL
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={priceSol}
                  onChange={(e) => setPriceSol(e.target.value)}
                  className="w-full rounded-xl border border-border bg-muted/20 px-3.5 py-2.5 text-xs font-semibold text-foreground outline-none focus:border-brand"
                  placeholder="e.g. 9.4"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">
                Description & In-game Inventory
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-border bg-muted/20 px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-brand"
                placeholder="Detail what is included with the account..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Wizard Step 3: Credentials */}
      {currentStep === 3 && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-brand">
            <Lock className="size-4" />
            <h2 className="text-sm font-bold text-foreground">Client-Side Encrypted Credentials</h2>
          </div>
          <p className="text-xs text-muted-foreground">
            These will be encrypted using AES-256 before being committed to the Solana escrow vault.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">
                Username / Login ID
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-border bg-muted/20 px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-brand"
                placeholder="Login username"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-border bg-muted/20 px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-brand"
                placeholder="Account password"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">
                Associated Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-border bg-muted/20 px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-brand"
                placeholder="original.email@domain.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">
                Backup 2FA / Recovery Key
              </label>
              <input
                type="text"
                value={securityKeys}
                onChange={(e) => setSecurityKeys(e.target.value)}
                className="w-full rounded-xl border border-border bg-muted/20 px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-brand"
                placeholder="Optional backup code"
              />
            </div>
          </div>
        </div>
      )}

      {/* Wizard Step 4: Review */}
      {currentStep === 4 && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-foreground">Review & Commit to Escrow</h2>
          <div className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-muted-foreground">Game:</span> <span className="font-bold text-foreground">{selectedGame}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Title:</span> <span className="font-bold text-foreground">{title}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Rank:</span> <span className="font-bold text-foreground">{rank}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Price:</span> <span className="font-mono font-bold text-brand">{priceSol} SOL</span></div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-4 text-brand" />
            <span>Encrypted escrow vault will be initialized on Solana.</span>
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="mt-8 flex items-center justify-between border-t border-border pt-4">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => prev - 1)}
            className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back</span>
          </button>
        ) : (
          <div />
        )}

        {currentStep < 4 ? (
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => prev + 1)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-6 py-2.5 text-xs font-bold text-black hover:bg-brand-hover active:scale-[0.98] transition-all shadow-sm"
          >
            <span>Continue</span>
            <ArrowRight className="size-3.5" />
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSavingDraft}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-6 py-2.5 text-xs font-bold text-foreground hover:bg-muted active:scale-[0.98] transition-all shadow-sm"
            >
              <span>{isSavingDraft ? 'Saving...' : 'Save as Draft'}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsPublishingOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-6 py-2.5 text-xs font-bold text-black hover:bg-brand-hover active:scale-[0.98] transition-all shadow-sm"
            >
              <span>Publish to Solana</span>
              <Check className="size-3.5" />
            </button>
          </div>
        )}
      </div>

      <PublishingWizardModal
        isOpen={isPublishingOpen}
        onClose={() => setIsPublishingOpen(false)}
        onSuccess={() => {
          setIsPublishingOpen(false);
          router.push('/seller');
        }}
        listingTitle={title}
        priceSol={parseFloat(priceSol) || 9.4}
        credentialsData={{
          username,
          password,
          email,
          securityKeys,
          game: selectedGame,
          description,
          rank,
        }}
      />
    </div>
  );
}
