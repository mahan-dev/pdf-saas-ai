import OpenAi from "openai";

const API_KEY = process.env.CHATGPT_API_KEY as string;

const client = new OpenAi({
  apiKey: API_KEY,
});

const getEmbeddings = async (text: string) => {
  try {
    const response = await client.embeddings.create({
      model: "text-embedding-ada-002",
      input: text.replace(/\n/g, " "),
      encoding_format: "float",
    });

    return response.data[0].embedding as number[];
  } catch (error) {
    console.log("error while calling api ");
    throw Error;
  }
};

export { getEmbeddings };
