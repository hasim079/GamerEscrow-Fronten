const { createClient } = require('@supabase/supabase-js');

// Test with ANON key (what the frontend uses for reads)
const url = 'https://rlfmuiufxmonzohdhvgt.supabase.co';
const anonKey = 'sb_publishable_CgSoDvnMoGxXIgczBiYhJg_ExYHg5fw';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsZm11aXVmeG1vbnpvaGRodmd0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTcxOTkzMiwiZXhwIjoyMTA1Mjk1OTMyfQ.oLwXZ6ngGFvCS-p2fdf_BtUsdttBJbNUyo5z4Zcnj0o';

const supabaseAnon = createClient(url, anonKey);
const supabaseAdmin = createClient(url, serviceKey);

async function run() {
  // Step 1: Update a listing to InEscrow using service_role
  const { data: all } = await supabaseAdmin.from('listings').select('id').limit(1);
  if (!all || all.length === 0) { console.log('No listings found'); return; }
  
  const testId = all[0].id;
  console.log('Test listing ID:', testId);

  await supabaseAdmin.from('listings').update({ status: 'InEscrow', buyer_pubkey: 'TEST_BUYER' }).eq('id', testId);
  console.log('Updated status to InEscrow via service_role');

  // Step 2: Try to READ it with anon key (what frontend does)
  const { data: anonRead, error: anonErr } = await supabaseAnon
    .from('listings')
    .select('*')
    .eq('id', testId)
    .maybeSingle();

  console.log('\n=== ANON KEY READ (InEscrow status) ===');
  console.log('Data:', anonRead ? `Found! status=${anonRead.status}` : 'NULL - NOT FOUND!');
  console.log('Error:', anonErr ? anonErr.message : 'none');

  // Step 3: Revert
  await supabaseAdmin.from('listings').update({ status: 'Listed', buyer_pubkey: null }).eq('id', testId);
  console.log('\nReverted to Listed.');
}

run().catch(console.error);
