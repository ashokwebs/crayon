import { NextResponse } from "next/server";
import { initDb, KnowledgeBaseModel } from "@/lib/db";
import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST() {
  try {
    await initDb();

    // Read the project story
    const storyPath = path.join(process.cwd(), "project_story.md");
    if (!fs.existsSync(storyPath)) {
      return NextResponse.json({ error: "project_story.md not found" }, { status: 404 });
    }

    const content = fs.readFileSync(storyPath, "utf-8");
    
    // Chunk the content
    const chunks = content.split(/\n##\s/).map((c, i) => i === 0 ? c : `## ${c}`);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

    // Clear existing
    await KnowledgeBaseModel.deleteMany({});

    let inserted = 0;
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i].trim();
      if (chunk.length < 50) continue; // Skip very small chunks

      let embedding: number[] = [];
      try {
        const result = await model.embedContent(chunk);
        embedding = result.embedding.values;
      } catch (e) {
        console.warn("Failed to embed chunk:", e);
      }

      await KnowledgeBaseModel.create({
        filename: `project_story_part_${i+1}.md`,
        content: chunk,
        embedding: embedding.length > 0 ? embedding : undefined
      });
      inserted++;
    }

    return NextResponse.json({ success: true, inserted });
  } catch (error: any) {
    console.error("Failed to seed knowledge base:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
