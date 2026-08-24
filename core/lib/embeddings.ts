import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY as string;

const ai = new GoogleGenAI({
  apiKey: API_KEY,
});

const getEmbeddings = async (text: string): Promise<number[]> => {
  try {
    const response = await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: text.replace(/\n/g, " "),
      // input: text.replace(/\n/g, " "),
      // encoding_format: "float",
    });

    console.log(response.embeddings);

    return response.embeddings?.[0].values ?? [];
  } catch (error) {
    console.log("error while calling api ");
    throw error;
  }
};

export { getEmbeddings };
