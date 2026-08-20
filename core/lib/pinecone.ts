import { Pinecone } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "@/core/lib/s3Server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

let pinecone: Pinecone | null = null;

const getPinecone = async () => {
  if (!pinecone) {
    pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
  }
  return pinecone;
};

const loadS3IntoPinecone = async (filePath: string) => {
  console.log("downloading s3 files from supabase");
  const fileName = await downloadFromS3(filePath);
  if (!fileName) {
    throw new Error("couldn't download from s3");
  }
  const loader = new PDFLoader(fileName);
  const pages = await loader.load();
  return pages;
};

export { getPinecone, loadS3IntoPinecone };
