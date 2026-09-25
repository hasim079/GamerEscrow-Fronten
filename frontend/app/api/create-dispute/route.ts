import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Service role client bypasses RLS entirely
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const listing_id = formData.get('listing_id') as string;
    const initiator_pubkey = formData.get('initiator_pubkey') as string;
    const reason = formData.get('reason') as string;
    const details = formData.get('details') as string | null;
    const file = formData.get('file') as File | null;

    if (!listing_id || !initiator_pubkey || !reason) {
      return NextResponse.json({ success: false, error: 'Missing required parameters.' }, { status: 400 });
    }

    // 1. Upload file to storage if provided
    let evidenceUrl: string | undefined;
    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${listing_id}_${Date.now()}.${fileExt}`;
      const fileBuffer = Buffer.from(await file.arrayBuffer());

      const { data: uploadData, error: uploadError } = await supabaseAdmin
        .storage
        .from('dispute')
        .upload(fileName, fileBuffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error('[API create-dispute] Storage upload error:', uploadError.message);
        return NextResponse.json({ success: false, error: `File upload failed: ${uploadError.message}` }, { status: 500 });
      }

      const { data: urlData } = supabaseAdmin.storage.from('dispute').getPublicUrl(uploadData.path);
      evidenceUrl = urlData.publicUrl;
    }

    // 2. Insert dispute record into the database
    const { data, error: dbError } = await supabaseAdmin
      .from('disputes')
      .insert([{
        listing_id,
        initiator_pubkey,
        reason,
        details: details || null,
        evidence_urls: evidenceUrl ? [evidenceUrl] : null,
        status: 'Open',
      }])
      .select()
      .single();

    if (dbError) {
      console.error('[API create-dispute] DB insert error:', dbError.message);
      return NextResponse.json({ success: false, error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, dispute: data });
  } catch (err: any) {
    console.error('[API create-dispute] Unexpected error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
