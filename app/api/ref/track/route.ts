import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  const { code } = await req.json();
  if (!code) return NextResponse.json({ valid: false });

  const supabase = createAdminClient();
  const { data: link } = await supabase
    .from("affiliate_links")
    .select("id, affiliate_id, clicks, affiliates(status)")
    .eq("code", code)
    .single();

  if (!link || (link.affiliates as any)?.status !== "active") {
    return NextResponse.json({ valid: false });
  }

  await supabase.from("affiliate_clicks").insert({
    affiliate_link_id: link.id,
    ip_address: req.headers.get("x-forwarded-for") || "unknown",
    user_agent: req.headers.get("user-agent") || "unknown",
  });

  await supabase.from("affiliate_links").update({ clicks: (link.clicks || 0) + 1 }).eq("id", link.id);

  return NextResponse.json({ valid: true });
}