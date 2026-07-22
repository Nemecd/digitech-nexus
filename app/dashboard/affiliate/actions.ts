"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

function generateCode(name: string) {
  const base = name.split(" ")[0]?.toUpperCase().slice(0, 6) || "AFF";
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${base}${random}`;
}

export async function becomeAffiliate() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: existing } = await supabase.from("affiliates").select("id").eq("user_id", user.id).single();
  if (existing) return; // already an affiliate

  const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();
  const code = generateCode(profile?.full_name || "AFF");

  const { data: affiliate, error } = await supabase
    .from("affiliates")
    .insert({ user_id: user.id, referral_code: code })
    .select()
    .single();

  if (error || !affiliate) throw new Error("Could not create affiliate account");

  // Sitewide referral link — reuses the affiliate_links table (product_id null = sitewide)
  await supabase.from("affiliate_links").insert({ affiliate_id: affiliate.id, code, product_id: null });

  revalidatePath("/dashboard/affiliate");
}

export async function addBankAccount(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: affiliate } = await supabase.from("affiliates").select("id").eq("user_id", user.id).single();
  if (!affiliate) throw new Error("Not an affiliate");

  await supabase.from("affiliate_bank_accounts").insert({
    affiliate_id: affiliate.id,
    bank_code: formData.get("bankCode"),
    account_number: formData.get("accountNumber"),
    account_name: formData.get("accountName"),
    verified: true,
  });

  revalidatePath("/dashboard/affiliate");
}

export async function requestWithdrawal(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: affiliate } = await supabase.from("affiliates").select("id, balance").eq("user_id", user.id).single();
  if (!affiliate) throw new Error("Not an affiliate");

  const amount = Number(formData.get("amount"));
  const bankAccountId = formData.get("bankAccountId");

  if (amount <= 0 || amount > Number(affiliate.balance)) {
    throw new Error("Invalid withdrawal amount");
  }

  await supabase.from("withdrawals").insert({
    affiliate_id: affiliate.id,
    amount,
    bank_account_id: bankAccountId,
    status: "requested",
  });

  revalidatePath("/dashboard/affiliate");
}