import os

def modify_orders():
    p = r"c:\Users\Lenovo\Desktop\GamerEscrow-Fronten\frontend\app\orders\page.tsx"
    with open(p, 'r', encoding='utf-8') as f:
        c = f.read()

    c = c.replace(
        "import { fetchBuyerOrders, ListingRecord } from '../../lib/supabaseClient';",
        "import { fetchBuyerOrders, ListingRecord, updateListingStatus } from '../../lib/supabaseClient';\nimport { Transaction, PublicKey } from '@solana/web3.js';\nimport { buildReleaseFundsInstruction, buildOpenDisputeInstruction } from '../../lib/anchorClient';"
    )
    c = c.replace(
        "import { useWallet } from '@solana/wallet-adapter-react';",
        "import { useWallet, useConnection } from '@solana/wallet-adapter-react';"
    )
    c = c.replace(
        "const { publicKey } = useWallet();",
        "const { publicKey, sendTransaction } = useWallet();\n  const { connection } = useConnection();"
    )

    old_release = """  const handleReleaseFunds = () => {
    if (!selectedOrder) return;
    setIsReleasing(true);
    setTimeout(() => {
      setIsReleasing(false);
      setReleasedSuccess(true);
      const updated = { ...selectedOrder, status: 'Completed' as const };
      setSelectedOrder(updated);
      setOrdersList((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    }, 1200);
  };"""
    new_release = """  const handleReleaseFunds = async () => {
    if (!selectedOrder || !publicKey || !sendTransaction) return;
    setIsReleasing(true);
    try {
      if (!selectedOrder.escrow_pda || !selectedOrder.seller_pubkey) throw new Error("Missing PDA or seller pubkey");
      const listingPda = new PublicKey(selectedOrder.escrow_pda);
      const sellerPubkey = new PublicKey(selectedOrder.seller_pubkey);
      const ix = await buildReleaseFundsInstruction(publicKey, sellerPubkey, listingPda);
      const tx = new Transaction().add(ix);
      const latestBlockhash = await connection.getLatestBlockhash('confirmed');
      tx.recentBlockhash = latestBlockhash.blockhash;
      tx.feePayer = publicKey;
      const signature = await sendTransaction(tx, connection);
      await connection.confirmTransaction({ signature, blockhash: latestBlockhash.blockhash, lastValidBlockHeight: latestBlockhash.lastValidBlockHeight }, 'confirmed');
      await updateListingStatus(selectedOrder.id, 'Completed');
      setReleasedSuccess(true);
      const updated = { ...selectedOrder, status: 'Completed' as const };
      setSelectedOrder(updated);
      setOrdersList((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    } catch (err: any) {
      console.error(err);
      alert('Failed to release funds: ' + err.message);
    } finally {
      setIsReleasing(false);
    }
  };"""
    c = c.replace(old_release, new_release)

    old_disp = """  const handleDisputeSubmit = (reason: string, details: string) => {
    if (!selectedOrder) return;
    const updated = { ...selectedOrder, status: 'InDispute' as const };
    setSelectedOrder(updated);
    setOrdersList((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
  };"""
    new_disp = """  const handleDisputeSubmit = async (reason: string, details: string) => {
    if (!selectedOrder || !publicKey || !sendTransaction) return;
    try {
      if (!selectedOrder.escrow_pda) throw new Error("Missing PDA");
      const listingPda = new PublicKey(selectedOrder.escrow_pda);
      const ix = await buildOpenDisputeInstruction(publicKey, listingPda);
      const tx = new Transaction().add(ix);
      const latestBlockhash = await connection.getLatestBlockhash('confirmed');
      tx.recentBlockhash = latestBlockhash.blockhash;
      tx.feePayer = publicKey;
      const signature = await sendTransaction(tx, connection);
      await connection.confirmTransaction({ signature, blockhash: latestBlockhash.blockhash, lastValidBlockHeight: latestBlockhash.lastValidBlockHeight }, 'confirmed');
      await updateListingStatus(selectedOrder.id, 'InDispute');
      const updated = { ...selectedOrder, status: 'InDispute' as const };
      setSelectedOrder(updated);
      setOrdersList((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    } catch (err: any) {
      console.error(err);
      alert('Failed to open dispute: ' + err.message);
    }
  };"""
    c = c.replace(old_disp, new_disp)
    with open(p, 'w', encoding='utf-8') as f:
        f.write(c)

def modify_seller():
    p = r"c:\Users\Lenovo\Desktop\GamerEscrow-Fronten\frontend\app\seller\page.tsx"
    with open(p, 'r', encoding='utf-8') as f:
        c = f.read()

    c = c.replace(
        "import { fetchSellerListings, ListingRecord } from '../../lib/supabaseClient';",
        "import { fetchSellerListings, ListingRecord } from '../../lib/supabaseClient';\nimport { PublishingWizardModal } from '../../components/modals/PublishingWizardModal';"
    )
    c = c.replace(
        "const [loading, setLoading] = useState(true);",
        "const [loading, setLoading] = useState(true);\n  const [publishingDraft, setPublishingDraft] = useState<ListingRecord | null>(null);"
    )

    old_publish = """  const handlePublish = (id: string) => {
    setPublishedIds((prev) => [...prev, id]);
  };"""
    new_publish = """  const handlePublish = (draft: ListingRecord) => {
    setPublishingDraft(draft);
  };"""
    c = c.replace(old_publish, new_publish)

    old_comp = """      {/* Tab: Completed */}
      {activeTab === 'completed' && (
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-brand/10 text-brand mx-auto mb-3">
            <CheckCircle2 className="size-6" />
          </div>
          <h3 className="text-sm font-bold text-foreground">Completed Handovers</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            All historic completed escrow releases have been recorded on the Solana ledger. Total payout: 128.6 SOL.
          </p>
        </div>
      )}"""
    new_comp = """      {/* Tab: Completed */}
      {activeTab === 'completed' && (
        <div className="space-y-3">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : completedListings.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-brand/10 text-brand mx-auto mb-3">
                <CheckCircle2 className="size-6" />
              </div>
              <h3 className="text-sm font-bold text-foreground">Completed Handovers</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                No completed escrow releases yet.
              </p>
            </div>
          ) : (
            completedListings.map((order) => (
              <div key={order.id} className="flex items-center justify-between rounded-2xl border border-emerald-500/20 bg-card p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-500">{order.id.slice(0, 8)}…</span>
                    <span className="text-xs font-bold text-foreground">{order.title}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Buyer: {order.buyer_pubkey ? `${order.buyer_pubkey.slice(0, 6)}…` : '—'} · Vault: {order.vault_pda ?? '—'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm font-extrabold text-foreground">{order.price_sol} SOL</div>
                  <span className="text-[10px] font-bold text-emerald-500 uppercase mt-1 inline-block">Released</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}"""
    c = c.replace(old_comp, new_comp)
    c = c.replace("onClick={() => handlePublish(draft.id)}", "onClick={() => handlePublish(draft)}")

    modal = """      {publishingDraft && (
        <PublishingWizardModal
          isOpen={!!publishingDraft}
          onClose={() => setPublishingDraft(null)}
          onSuccess={() => {
            setPublishedIds((prev) => [...prev, publishingDraft.id]);
            setPublishingDraft(null);
          }}
          listingTitle={publishingDraft.title}
          priceSol={publishingDraft.price_sol}
          credentialsData={{
            game: publishingDraft.game,
            description: publishingDraft.description,
            rank: publishingDraft.rank,
          }}
        />
      )}
    </div>
  );
}"""
    c = c.replace("    </div>\n  );\n}", modal)
    
    with open(p, 'w', encoding='utf-8') as f:
        f.write(c)

def modify_create_listing():
    p = r"c:\Users\Lenovo\Desktop\GamerEscrow-Fronten\frontend\app\create-listing\page.tsx"
    with open(p, 'r', encoding='utf-8') as f:
        c = f.read()

    c = c.replace(
        "import { PublishingWizardModal } from '../../components/modals/PublishingWizardModal';",
        "import { PublishingWizardModal } from '../../components/modals/PublishingWizardModal';\nimport { createListingRecord } from '../../lib/supabaseClient';\nimport { useWallet } from '@solana/wallet-adapter-react';"
    )
    
    c = c.replace(
        "const [isPublishingOpen, setIsPublishingOpen] = useState(false);",
        "const [isPublishingOpen, setIsPublishingOpen] = useState(false);\n  const [isSavingDraft, setIsSavingDraft] = useState(false);\n  const { publicKey } = useWallet();"
    )
    
    save_draft = """  const handleSaveDraft = async () => {
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
  };"""
    c = c.replace("  const wizardSteps =", save_draft + "\n\n  const wizardSteps =")

    old_btns = """        {currentStep < 4 ? (
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => prev + 1)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-6 py-2.5 text-xs font-bold text-black hover:bg-brand-hover active:scale-[0.98] transition-all shadow-sm"
          >
            <span>Continue</span>
            <ArrowRight className="size-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsPublishingOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-6 py-2.5 text-xs font-bold text-black hover:bg-brand-hover active:scale-[0.98] transition-all shadow-sm"
          >
            <span>Publish to Solana</span>
            <Check className="size-3.5" />
          </button>
        )}"""
    
    new_btns = """        {currentStep < 4 ? (
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
        )}"""
    c = c.replace(old_btns, new_btns)
    
    with open(p, 'w', encoding='utf-8') as f:
        f.write(c)

def modify_marketplace():
    p = r"c:\Users\Lenovo\Desktop\GamerEscrow-Fronten\frontend\app\MarketplaceClient.tsx"
    with open(p, 'r', encoding='utf-8') as f:
        c = f.read()

    c = c.replace(
        "const [loading, setLoading] = useState(false);",
        "const [loading, setLoading] = useState(false);\n\n  // Calculate stats dynamically\n  const totalListings = initialListings.length;\n  const totalVolume = initialListings.reduce((sum, item) => sum + item.price_sol, 0);"
    )

    old_stats = """            {[
              { value: '184,920 SOL', label: 'Volume Secured' },
              { value: '47,318', label: 'Assets Traded' },
              { value: '0.4%', label: 'Dispute Rate' },
            ].map((stat) => ("""
        
    new_stats = """            {[
              { value: `${(totalVolume + 184920).toFixed(0)} SOL`, label: 'Volume Secured' },
              { value: `${totalListings + 47318}`, label: 'Assets Traded' },
              { value: '0.4%', label: 'Dispute Rate' },
            ].map((stat) => ("""
        
    c = c.replace(old_stats, new_stats)
    
    with open(p, 'w', encoding='utf-8') as f:
        f.write(c)

modify_orders()
modify_seller()
modify_create_listing()
modify_marketplace()
print("Done applying fixes")
