import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { excludeIds } = await req.json();
  const supabase = await createClient();

  const query = supabase
    .from("products")
    .select("id, type, title, price, thumbnail_url")
    .eq("status", "published")
    .limit(4);

  const { data } = excludeIds && excludeIds.length > 0
    ? await query.not("id", "in", `(${excludeIds.join(",")})`)
    : await query;

  return NextResponse.json({ products: data || [] });
}