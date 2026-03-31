import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ── Server-side price catalogue (mirrors src/data/blocks.ts exactly) ──
const BASE_PRICE_CENTS = 1900; // €19

const BLOCK_PRICES: Record<string, number> = {
  // Wedding
  "wedding-timeline": 900, "wedding-story": 900, "wedding-wishlist": 900,
  "wedding-dresscode": 900, "wedding-bgmusic": 900, "wedding-videomsg": 900,
  "wedding-hotels": 1900, "wedding-slideshow": 1900, "wedding-menu": 1900,
  "wedding-shuttle": 1900, "wedding-musicpro": 1900, "wedding-illustration": 2900,
  // Corporate
  "business-timeline": 900, "business-dresscode": 900, "business-bgmusic": 900,
  "business-videomsg": 900, "business-hotels": 900, "business-menu": 900,
  "business-agenda": 900, "business-products": 1900, "business-sponsors": 1900,
  // Birthday/Party
  "party-timeline": 500, "party-musicwish": 500, "party-wishlist": 500,
  "party-dresscode": 500, "party-bgmusic": 500, "party-videomsg": 500,
  "party-quiz": 900, "party-menu": 900, "party-games": 900,
  "party-potluck": 900, "party-hotels": 900,
};

const PACKAGE_PRICES: Record<string, { priceCents: number; blockIds: string[] }> = {
  "wedding-starter": { priceCents: 3900, blockIds: ["wedding-timeline", "wedding-dresscode", "wedding-hotels", "wedding-shuttle", "wedding-bgmusic"] },
  "wedding-plus": { priceCents: 4900, blockIds: ["wedding-timeline", "wedding-dresscode", "wedding-hotels", "wedding-shuttle", "wedding-bgmusic", "wedding-menu", "wedding-videomsg"] },
  "wedding-premium": { priceCents: 7900, blockIds: ["wedding-timeline", "wedding-dresscode", "wedding-hotels", "wedding-shuttle", "wedding-bgmusic", "wedding-menu", "wedding-slideshow", "wedding-story", "wedding-wishlist", "wedding-videomsg"] },
  "business-starter": { priceCents: 2900, blockIds: ["business-timeline", "business-dresscode", "business-hotels", "business-agenda", "business-bgmusic"] },
  "business-pro": { priceCents: 4900, blockIds: ["business-timeline", "business-dresscode", "business-hotels", "business-agenda", "business-bgmusic", "business-products", "business-sponsors", "business-videomsg", "business-menu"] },
  "party-fun": { priceCents: 2500, blockIds: ["party-timeline", "party-musicwish", "party-games", "party-quiz", "party-bgmusic"] },
  "party-planer": { priceCents: 2500, blockIds: ["party-timeline", "party-menu", "party-potluck", "party-dresscode", "party-bgmusic"] },
  "party-allin": { priceCents: 4500, blockIds: ["party-timeline", "party-musicwish", "party-games", "party-quiz", "party-menu", "party-potluck", "party-dresscode", "party-wishlist", "party-bgmusic", "party-videomsg"] },
};

const LANG_PRICE_CENTS = 300; // €3 per extra language

// Supported Stripe currencies and their EUR exchange rates
const CURRENCY_RATES: Record<string, number> = {
  eur: 1, usd: 1.09, gbp: 0.86, chf: 0.96, jpy: 163.5,
  cad: 1.48, aud: 1.67, cny: 7.92, inr: 91.2, brl: 5.45,
  mxn: 18.7, sek: 11.2, nok: 11.6, dkk: 7.46, pln: 4.32,
};

// Zero-decimal currencies in Stripe
const ZERO_DECIMAL_CURRENCIES = new Set(["jpy"]);

function convertCents(eurCents: number, currency: string): number {
  const rate = CURRENCY_RATES[currency] || 1;
  if (ZERO_DECIMAL_CURRENCIES.has(currency)) {
    // JPY: convert EUR cents to whole yen (eurCents/100 * rate)
    return Math.round((eurCents / 100) * rate);
  }
  return Math.round(eurCents * rate);
}

function calculatePriceServer(
  selectedBlocks: string[],
  menuSelection: boolean,
  languages: string[],
  tier: string,
  selectedPackageId?: string,
): number {
  // For basis tier events (from ConfigurePage)
  if (tier === "basis") {
    let total = BASE_PRICE_CENTS;
    if (menuSelection) total += 500;
    const extraLangs = Math.max(0, (languages?.length || 1) - 1);
    total += extraLangs * LANG_PRICE_CENTS;
    return total;
  }

  // Premium tier (from OrderFlow) — blocks/packages based pricing
  let total = BASE_PRICE_CENTS;

  if (selectedPackageId && PACKAGE_PRICES[selectedPackageId]) {
    const pkg = PACKAGE_PRICES[selectedPackageId];
    total += pkg.priceCents;
    const extraBlocks = selectedBlocks.filter(id => !pkg.blockIds.includes(id));
    total += extraBlocks.reduce((sum, id) => sum + (BLOCK_PRICES[id] || 0), 0);
  } else {
    total += selectedBlocks.reduce((sum, id) => sum + (BLOCK_PRICES[id] || 0), 0);
  }

  // Add language pricing for premium tier too
  const extraLangs = Math.max(0, (languages?.length || 1) - 1);
  total += extraLangs * LANG_PRICE_CENTS;

  return total;
}

function applyPromoDiscount(priceCents: number, discountType: string, discountValue: number): number {
  if (discountType === "percentage") {
    return Math.round(priceCents * (1 - discountValue / 100));
  }
  // Fixed amount in euros → convert to cents
  return Math.max(0, priceCents - Math.round(discountValue * 100));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub;
    const { eventId, successUrl, cancelUrl, selectedPackageId, promoCode, currency: reqCurrency } = await req.json();
    const currency = (typeof reqCurrency === "string" && CURRENCY_RATES[reqCurrency]) ? reqCurrency : "eur";

    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: event, error: eventError } = await adminClient
      .from("events")
      .select("*")
      .eq("id", eventId)
      .eq("user_id", userId)
      .single();

    if (eventError || !event) {
      return new Response(JSON.stringify({ error: "Event not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Server-side price calculation — never trust client price_paid
    let unitAmount = calculatePriceServer(
      event.selected_blocks || [],
      event.menu_selection || false,
      event.languages || ["de"],
      event.tier || "basis",
      selectedPackageId,
    );

    // Validate and apply promo code server-side
    let appliedPromoCode: string | null = null;
    if (promoCode && typeof promoCode === "string") {
      const { data: promo } = await adminClient
        .from("promo_codes")
        .select("*")
        .eq("code", promoCode.toUpperCase())
        .eq("active", true)
        .single();

      if (promo) {
        const isExpired = promo.expires_at && new Date(promo.expires_at) < new Date();
        const isMaxedOut = promo.max_uses && promo.current_uses >= promo.max_uses;

        if (!isExpired && !isMaxedOut) {
          unitAmount = applyPromoDiscount(unitAmount, promo.discount_type, Number(promo.discount_value));
          appliedPromoCode = promo.code;

          // Increment usage counter
          await adminClient
            .from("promo_codes")
            .update({ current_uses: promo.current_uses + 1 })
            .eq("id", promo.id);
        }
      }
    }

    // Persist the server-calculated price back to the event
    await adminClient
      .from("events")
      .update({ price_paid: unitAmount })
      .eq("id", eventId);

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
      apiVersion: "2025-08-27.basil",
    });

    const { data: userData } = await supabase.auth.getUser(token);
    const userEmail = userData?.user?.email;

    const metadata: Record<string, string> = {
      event_id: event.id,
      user_id: userId,
    };
    if (appliedPromoCode) {
      metadata.promo_code = appliedPromoCode;
    }

    const stripeAmount = convertCents(unitAmount, currency);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: userEmail || undefined,
      payment_intent_data: {
        receipt_email: userEmail || undefined,
      },
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: `Event-Seite: ${event.title}`,
              description: `Template: ${event.template_id} · Link: ${event.event_link}.celebra.at${appliedPromoCode ? ` · Promo: ${appliedPromoCode}` : ""}`,
            },
            unit_amount: stripeAmount,
          },
          quantity: 1,
        },
      ],
      metadata: { ...metadata, original_eur_cents: String(unitAmount) },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Checkout error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
