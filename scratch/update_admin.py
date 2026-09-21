import os

p = r"c:\Users\Lenovo\Desktop\GamerEscrow-Fronten\frontend\app\admin\page.tsx"
with open(p, "r", encoding="utf-8") as f:
    c = f.read()

# 1. Imports
c = c.replace(
    "import { checkIsAdmin, fetchDisputes } from '../../lib/supabaseClient';",
    "import { checkIsAdmin, fetchDisputes, supabase } from '../../lib/supabaseClient';\nimport type { Session } from '@supabase/supabase-js';"
)
c = c.replace(
    "import { Eye, Shield, CheckCircle2, X, AlertTriangle } from 'lucide-react';",
    "import { Eye, Shield, CheckCircle2, X, AlertTriangle, LogIn } from 'lucide-react';"
)

# 2. States
old_states = """export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'disputes' | 'analytics' | 'moderation'>('disputes');
  const [disputes, setDisputes] = useState<DisputeItem[]>([]);
  const [selectedDispute, setSelectedDispute] = useState<DisputeItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resolutionMessage, setResolutionMessage] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);"""

new_states = """export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'disputes' | 'analytics' | 'moderation'>('disputes');
  const [disputes, setDisputes] = useState<DisputeItem[]>([]);
  const [selectedDispute, setSelectedDispute] = useState<DisputeItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resolutionMessage, setResolutionMessage] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);"""
c = c.replace(old_states, new_states)

# 3. verifyAdmin block + Session setup
new_use_effect = """
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setCheckingAuth(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);
"""

old_verify = """  useEffect(() => {
    async function verifyAdmin() {
      if (!publicKey) {
        setIsAuthorized(null);
        setDisputes([]);
        return;
      }

      const walletAddress = publicKey.toBase58();

      try {
        const hasAccess = await checkIsAdmin(walletAddress);
        setIsAuthorized(hasAccess);"""

new_verify = new_use_effect + """
  useEffect(() => {
    async function verifyAdmin() {
      if (!publicKey || !session?.user?.email) {
        setIsAuthorized(null);
        setDisputes([]);
        return;
      }

      const walletAddress = publicKey.toBase58();
      const email = session.user.email;

      try {
        // Double check: Wallet AND Google Email must be in the whitelist
        const { data, error } = await supabase
          .from('admin_whitelist')
          .select('*')
          .eq('wallet_pubkey', walletAddress)
          .eq('email', email)
          .single();
          
        const hasAccess = data && !error;
        setIsAuthorized(hasAccess);"""
c = c.replace(old_verify, new_verify)

old_dep = "  }, [publicKey]);"
new_dep = "  }, [publicKey, session]);"
c = c.replace(old_dep, new_dep)

# 4. Render block
old_render = """  if (!publicKey) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <Shield className="mx-auto size-12 text-muted-foreground mb-4 opacity-50" />
          <h2 className="text-xl font-bold text-foreground">Admin Access Required</h2>
          <p className="mt-2 text-sm text-muted-foreground">Please connect your moderator wallet to access this panel.</p>
        </div>
      </div>
    );
  }

  if (isAuthorized === false) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.04] p-12 text-center">
          <AlertTriangle className="mx-auto size-12 text-rose-500 mb-4" />
          <h2 className="text-xl font-bold text-rose-500">Unauthorized</h2>
          <p className="mt-2 text-sm text-foreground">This wallet address is not whitelisted for administrative actions.</p>
        </div>
      </div>
    );
  }"""

new_render = """  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/admin'
      }
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (checkingAuth) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <LogIn className="mx-auto size-12 text-muted-foreground mb-4 opacity-50" />
          <h2 className="text-xl font-bold text-foreground">Admin Login Required</h2>
          <p className="mt-2 text-sm text-muted-foreground mb-6">Step 1: Please log in with your Google account.</p>
          <button
            onClick={handleGoogleLogin}
            className="inline-flex items-center gap-2 rounded-xl bg-foreground px-6 py-3 text-sm font-bold text-background hover:bg-muted-foreground transition-all"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  if (!publicKey) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <Shield className="mx-auto size-12 text-brand mb-4" />
          <h2 className="text-xl font-bold text-foreground">Wallet Connection Required</h2>
          <p className="mt-2 text-sm text-muted-foreground mb-6">Step 2: Authenticated as {session.user.email}. Now connect your admin wallet.</p>
          <button onClick={handleLogout} className="text-xs text-muted-foreground hover:underline">
            Not {session.user.email}? Sign out
          </button>
        </div>
      </div>
    );
  }

  if (isAuthorized === false) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.04] p-12 text-center">
          <AlertTriangle className="mx-auto size-12 text-rose-500 mb-4" />
          <h2 className="text-xl font-bold text-rose-500">Unauthorized</h2>
          <p className="mt-2 text-sm text-foreground">Email <strong>{session.user.email}</strong> and Wallet <strong>{publicKey.toBase58().slice(0, 6)}...</strong> are not whitelisted together.</p>
          <button onClick={handleLogout} className="mt-6 text-xs text-muted-foreground hover:underline">
            Sign out
          </button>
        </div>
      </div>
    );
  }"""
c = c.replace(old_render, new_render)

with open(p, "w", encoding="utf-8") as f:
    f.write(c)

print("Admin updated")
