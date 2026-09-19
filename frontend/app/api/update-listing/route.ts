import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || ''; 

// We use the service_role key to bypass RLS for this specific trusted backend operation
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, status, buyerPubkey, vaultPda } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'Missing parameters' }, { status: 400 });
    }

    const updateData: any = { status, updated_at: new Date().toISOString() };
    if (buyerPubkey) updateData.buyer_pubkey = buyerPubkey;
    if (vaultPda) updateData.vault_pda = vaultPda;

    const { error } = await supabaseAdmin
        .from('listings')
        .update(updateData)
        .eq('id', id);

    if (error) {
      console.error('[API] update error:', error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
