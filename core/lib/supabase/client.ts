import { createClient } from "@supabase/supabase-js";

export const uploadToSupabase = async (file: File) => {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    );

    const fileExtension = file.name.split(".").pop();
    const filePath = `/uploads/${crypto.randomUUID()}.${fileExtension}`;

    const { data, error } = await supabase.storage
      .from("pdf - saas")
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      return;
    }

    console.log("Upload successful:", data);
    return {
      id: data.id,
      path: data.path,
      fullPath: data.fullPath,
      fileName: file.name,
    };
  } catch (error) {
    console.log(error);
  }
};
