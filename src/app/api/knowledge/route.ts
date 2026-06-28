import { NextResponse } from "next/server";
import { initDb, KnowledgeBaseModel } from "@/lib/db";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET() {
  try {
    await initDb();
    // Return the count or list of documents (for demo we just return count)
    const count = await KnowledgeBaseModel.countDocuments();
    return NextResponse.json({ count, status: "Connected to MongoDB" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { filename, content } = await req.json();

    if (!filename || !content) {
      return NextResponse.json({ error: "Missing filename or content" }, { status: 400 });
    }

    await initDb();
    
    // In Postgres we generated an embedding. 
    // In MongoDB without Atlas Crayon setup, we just store it for text search.
    // If we wanted Atlas Crayon Search later, we could generate the embedding here and store it as an array.
    let embedding: number[] = [];
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
        const result = await model.embedContent(content);
        embedding = result.embedding.values;
      }
    } catch (e) {
      console.warn("Failed to generate embedding, storing document without it.", e);
    }

    const doc = await KnowledgeBaseModel.create({
      filename,
      content,
      embedding: embedding.length > 0 ? embedding : undefined
    });

    return NextResponse.json({ success: true, id: doc._id.toString() });
  } catch (error: any) {
    console.error("Failed to add knowledge:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
