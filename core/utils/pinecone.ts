import {
  Index,
  PineconeRecord,
  RecordMetadata,
} from "@pinecone-database/pinecone";

const BATCH_SIZE = 10;

export const pineconeUtils = async (
  vectors: PineconeRecord[],
  pineconeIndex: Index<RecordMetadata>,
  nameSpace: string,
) => {
  for (let i = 0; i < vectors.length; i += BATCH_SIZE) {
    const batch = vectors.slice(i, i + BATCH_SIZE);

    await pineconeIndex.upsert({
      namespace: nameSpace,
      records: batch,
    });
  }
};
