import { createClient } from "@/lib/supabase/client";

// Storage rejects some characters in file names (spaces, brackets, etc.), so clean them
function safeName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function uploadThumbnail(file: File): Promise<string> {
  const supabase = createClient();
  const path = `${Date.now()}-${safeName(file.name)}`;
  const { error } = await supabase.storage.from("thumbnails").upload(path, file);
  if (error) throw new Error(`Thumbnail upload failed: ${error.message}`);
  return supabase.storage.from("thumbnails").getPublicUrl(path).data.publicUrl;
}

// Returns the storage path only; signed download URLs are generated per purchase
export async function uploadEbook(file: File): Promise<string> {
  const supabase = createClient();
  const path = `${Date.now()}-${safeName(file.name)}`;
  const { error } = await supabase.storage.from("ebooks").upload(path, file);
  if (error) throw new Error(`eBook upload failed: ${error.message}`);
  return path;
}