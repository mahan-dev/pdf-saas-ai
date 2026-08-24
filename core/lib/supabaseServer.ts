import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
);

const downloadFromSupabase = async (filePath: string) => {
  try {
    const { data, error } = await supabase.storage
      .from("pdf - saas")
      .download(filePath);

    if (error) {
      throw new Error("can't download content from supabase");
    }
    const tempDir = "/tmp";

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    const fileName = path.join(tempDir, `${Date.now()}.pdf`);
    const buffer = Buffer.from(await data.arrayBuffer());
    fs.writeFileSync(fileName, buffer);
    return fileName;
  } catch (error) {
    console.log(error);
  }
};

export const getSupabaseUrl = (fileKey: string) => {
  const { data } = supabase.storage.from("pdf - saas").getPublicUrl(fileKey);

  if (!data) {
    console.log("can't get url from supabase ...");
    return;
  }

  return data.publicUrl;
};

export { downloadFromSupabase };
