import { Pinecone, type PineconeRecord } from "@pinecone-database/pinecone";
import { downloadFromSupabase } from "@/core/lib/supabaseServer";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { PdfPage } from "@/core/types/pinecone/pinecone";
import { getEmbeddings } from "@/core/lib/embeddings";
import { Document } from "@langchain/core/documents";
import md5 from "md5";
import { convertToAscii } from "./utils";
import { pineconeUtils } from "../utils/pinecone";

let pinecone: Pinecone | null = null;

const getPinecone = async () => {
  if (!pinecone) {
    pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
  }
  return pinecone;
};

const loadSupabaseIntoPinecone = async (fileKey: string) => {
  console.log("downloading s3 files from supabase");
  const fileName = await downloadFromSupabase(fileKey);
  if (!fileName) {
    throw new Error("couldn't download from s3");
  }
  const loader = new PDFLoader(fileName);
  const pages = (await loader.load()) as PdfPage[];
  //! Split and segment the PDF
  const documents = await Promise.all(pages.map(prepareDocument));
  // ? Vectorize and embed individual documents

  const vectors = (await Promise.all(
    documents.flat().map(embedDocument),
  )) as PineconeRecord[];

  const client = await getPinecone();

  const piconeIndex = client.index({ name: "pdf-saas-2" });
  console.log("inserting vectors into pinecone");

  const nameSpace = convertToAscii(fileKey);
  await pineconeUtils(vectors, piconeIndex, nameSpace);
};

const embedDocument = async (doc: Document): Promise<PineconeRecord> => {
  try {
    const embeddings = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);
    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    };
  } catch (error) {
    console.log("error embedding files", error);
    throw Error;
  }
};

const truncateStringByBytes = (str: string, bytes: number) => {
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};

const prepareDocument = async (page: PdfPage) => {
  const { pageContent: originalPageContent, metadata } = page;

  const pageContent = originalPageContent.replace(/\n/g, "");
  const splitter = new RecursiveCharacterTextSplitter();

  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);

  return docs;
};

export { getPinecone, loadSupabaseIntoPinecone };
