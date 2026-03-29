import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceKey);

  // Find live events created ~150 days ago (30 days before 180-day expiry)
  const now = new Date();
  const targetCreatedBefore = new Date(now.getTime() - 150 * 24 * 60 * 60 * 1000);
  const targetCreatedAfter = new Date(now.getTime() - 151 * 24 * 60 * 60 * 1000);

  const { data: events, error } = await supabase
    .from("events")
    .select("id, title, user_id, created_at")
    .eq("status", "live")
    .gte("created_at", targetCreatedAfter.toISOString())
    .lte("created_at", targetCreatedBefore.toISOString());

  if (error) {
    console.error("Error querying events:", error);
    return new Response(JSON.stringify({ error: "Query failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let sent = 0;
  for (const event of events || []) {
    // Get user email
    const { data: userData } = await supabase.auth.admin.getUserById(event.user_id);
    const email = userData?.user?.email;
    if (!email) continue;

    const daysLeft = Math.round(
      (new Date(event.created_at).getTime() + 180 * 24 * 60 * 60 * 1000 - now.getTime()) / (24 * 60 * 60 * 1000)
    );

    await supabase.functions.invoke("send-transactional-email", {
      body: {
        templateName: "renewal-reminder",
        recipientEmail: email,
        idempotencyKey: `renewal-${event.id}-${targetCreatedBefore.toISOString().slice(0, 10)}`,
        templateData: { eventTitle: event.title, daysLeft },
      },
    });
    sent++;
  }

  return new Response(JSON.stringify({ sent, checked: events?.length || 0 }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
