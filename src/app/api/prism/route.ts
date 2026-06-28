import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Requires GEMINI_API_KEY in .env.local
const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    const { idea } = await req.json();

    if (!idea) {
      return NextResponse.json({ error: "Missing 'idea' in request body." }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({ error: "Missing GEMINI_API_KEY environment variable." }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are Prism, the Lead Architect of the Crayon OS Executive Council. 
You are a highly intelligent, slightly cold, but deeply capable AI assistant. 
You are operating within a secure shell terminal.
Keep your response VERY FAST, concise, and professional. 
Your response MUST be between 1 to 3 short sentences maximum. Do not ramble.
Respond in markdown format if necessary.

User's input: "${idea}"`;

    const result = await model.generateContentStream(prompt);

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
              const payload = JSON.stringify({ event: 'content', data: chunkText });
              controller.enqueue(new TextEncoder().encode(`data: ${payload}\n\n`));
            }
          }
        } catch (err) {
          console.error("Stream generation error:", err);
          const errorPayload = JSON.stringify({ event: 'error', data: 'Stream generation failed.' });
          controller.enqueue(new TextEncoder().encode(`data: ${errorPayload}\n\n`));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: any) {
    console.error("Prism API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate response." }, { status: 500 });
  }
}
