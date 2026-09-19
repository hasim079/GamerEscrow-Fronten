import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import nacl from "https://esm.sh/tweetnacl@1.0.3";
import bs58 from "https://esm.sh/bs58@5.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { listingId, buyerPubkey, signature, timestamp, nonce } = await req.json();

    if (!listingId || !buyerPubkey || !signature || !timestamp || !nonce) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: listingId, buyerPubkey, signature, timestamp, nonce" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. Replay attack prevention: timestamp must be within 5 minutes
    const now = Date.now();
    if (Math.abs(now - Number(timestamp)) > 5 * 60 * 1000) {
      return new Response(
        JSON.stringify({ error: "Signature timestamp expired. Max drift is 5 minutes." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Reconstruct deterministic challenge message
    const message = `GamerEscrow Decrypt Request\nListing: ${listingId}\nNonce: ${nonce}\nTimestamp: ${timestamp}`;
    const messageBytes = new TextEncoder().encode(message);

    // 3. Ed25519 signature verification using tweetnacl
    let signatureBytes: Uint8Array;
    let buyerPubkeyBytes: Uint8Array;

    try {
      signatureBytes = bs58.decode(signature);
      buyerPubkeyBytes = bs58.decode(buyerPubkey);
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid base58 format for signature or buyerPubkey" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const isSignatureValid = nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      buyerPubkeyBytes
    );

    if (!isSignatureValid) {
      return new Response(
        JSON.stringify({ error: "Cryptographic signature verification failed" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. Query listing using Supabase Service Role
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: "Server configuration error: missing Supabase credentials" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: listing, error: dbError } = await supabase
      .from("listings")
      .select("*")
      .eq("id", listingId)
      .single();

    if (dbError || !listing) {
      return new Response(
        JSON.stringify({ error: "Listing not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 5. Verify authorization: Buyer wallet must match
    if (listing.buyer_pubkey !== buyerPubkey) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Wallet address does not match buyer address" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 6. Verify status: Listing must be InEscrow, InDispute, or Completed
    const validStatuses = ["InEscrow", "InDispute", "Completed"];
    if (!validStatuses.includes(listing.status)) {
      return new Response(
        JSON.stringify({
          error: `Access denied. Item status is '${listing.status}'. Credentials only accessible in escrow.`,
        }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 7. Secure Return of Credentials
    return new Response(
      JSON.stringify({
        success: true,
        listingId: listing.id,
        buyerPubkey,
        encryptedCredentials: listing.encrypted_credentials,
        encryptionIv: listing.encryption_iv,
        status: listing.status,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
