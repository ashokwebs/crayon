import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { initDb, ProjectModel, KnowledgeBaseModel } from "@/lib/db";
import { memoryService } from "@/lib/memory/service";
import { AGENTS, getArchitect } from "@/lib/agents/registry";

const agentNamesList = AGENTS.map(a => `"${a.name}" (${a.title})`).join(', ');
const agentNamesJsonEnum = AGENTS.map(a => `"${a.name}"`).join(' | ');

const SYSTEM_PROMPT = `You are Prism, the Lead Architect AI agent at Crayon AI Command Center. You are intelligent, strategic, and articulate.

PERSONALITY:
- Professional yet approachable. You speak with confidence and clarity.
- You use concise, actionable language. No fluff.
- You have a team of 18 other executive agents at your disposal: ${agentNamesList}.

BEHAVIOR RULES:
1. For NORMAL CONVERSATION (greetings, questions, advice, general discussion):
   - Respond naturally and helpfully as Prism the architect.
   - Do NOT generate documents or delegate to agents.
   - Keep responses concise (2-4 paragraphs max).
   - Set "mode" to "chat" in your response.
   - ALSO include "council_messages" — short 1-2 sentence reactions from 2-4 of your executive agents (Atlas, Nexus, Vanguard, Ledger, Oracle) who would naturally weigh in on the topic. Each agent should speak in their unique voice:
     * Atlas — strategic, business-focused, thinks about market fit and competitive advantage.
     * Nexus — technical, engineering-focused, thinks about architecture, scalability, and systems design.
     * Vanguard — marketing/growth, thinks about branding, customer acquisition, and positioning.
     * Ledger — financial, thinks about cost, revenue models, burn rate, and ROI.
     * Oracle — research-focused, thinks about data, market trends, and competitive intelligence.
   - These council messages make the Board Room feel alive. They are MANDATORY for every response.

2. For PLANNING REQUESTS (when user asks to "make a plan", "build a strategy", "analyze this idea", etc.):
   - Set "mode" to "plan" in your response.
   - Provide a brief strategic overview in "message" (2-3 paragraphs about what you see and what the council will do).
   - Generate up to 6 documents from appropriate agents in the "documents" array.
   - Assign tasks to agents in the "tasks" array (create 4-8 tasks).
   - Each document should be substantial (at least 300 words) with proper markdown formatting.
   - ALSO include "council_messages" from 3-5 agents reacting to the plan with specific, technical insights.

RESPONSE FORMAT (you MUST respond in valid JSON):
{
  "mode": "chat" | "plan",
  "title": "A short, 2-5 word name for this chat/project (e.g., 'Retro TV SaaS')",
  "message": "Your conversational response as Prism",
  "council_messages": [
    {
      "agent": "Atlas" | "Nexus" | "Vanguard" | "Ledger" | "Oracle",
      "content": "A short, in-character reaction from this agent (1-3 sentences)"
    }
  ],
  "council_consensus": {
    "score": 0-100,
    "label": "Unanimous" | "Strong" | "Moderate" | "Divided",
    "votes": {
      "Atlas": 0-100,
      "Nexus": 0-100,
      "Vanguard": 0-100,
      "Ledger": 0-100,
      "Oracle": 0-100
    }
  },
  "follow_up_suggestions": [
    "A smart, contextual follow-up question the user might ask next (max 3 items, short 8-15 words each)"
  ],
  "documents": [
    {
      "title": "Document Title",
      "agent": ${agentNamesJsonEnum},
      "content": "Full markdown content of the document"
    }
  ],
  "tasks": [
    {
      "agent": ${agentNamesJsonEnum},
      "task": "Description of the assigned task",
      "priority": "high" | "medium" | "low"
    }
  ]
}

IMPORTANT RULES FOR council_consensus:
- The score is an overall agreement percentage (0-100). Higher means more agreement.
- Each agent vote represents their confidence/agreement with your plan (0-100).
- For straightforward questions, consensus should be high (85-100). For controversial or complex topics, it can be lower (50-75).
- The label should match: 90-100 = "Unanimous", 75-89 = "Strong", 50-74 = "Moderate", below 50 = "Divided".
- follow_up_suggestions MUST contain exactly 3 short, contextual follow-up prompts.

IMPORTANT: Always respond with ONLY valid JSON. No markdown code fences. No extra text outside the JSON.`;

let dbInitialized = false;

export async function POST(req: Request) {
  try {
    if (!dbInitialized) {
      await initDb();
      dbInitialized = true;
    }

    const { message, history, conversation_id } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Missing message" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // --- 1. Project Memory Context ---
    let extraContext = "";
    if (conversation_id && conversation_id.startsWith('db-')) {
      const projectId = conversation_id.replace('db-', '');
      extraContext = await memoryService.getContextPrompt(projectId);
    }
    
    // --- 2. KNOWLEDGE RETRIEVAL (MongoDB) ---
    try {
      // In Postgres we used pgvector. In MongoDB, without explicit Atlas Crayon Search configuration,
      // we'll use a basic text search to find relevant context.
      const searchRes = await KnowledgeBaseModel.find(
        { $text: { $search: message } },
        { score: { $meta: "textScore" } }
      )
      .sort({ score: { $meta: "textScore" } })
      .limit(2);

      if (searchRes.length > 0) {
        extraContext += "\n\nCRITICAL CONTEXT FROM COMPANY KNOWLEDGE BASE:\n";
        searchRes.forEach((row: any) => {
          extraContext += `\n--- Document: ${row.filename} ---\n${row.content}\n`;
        });
      }
    } catch (ragError) {
      console.warn("MongoDB Text Search failed (Skipping context injection):", ragError);
    }

    const dynamicSystemPrompt = SYSTEM_PROMPT + (extraContext ? "\n\n" + extraContext : "");

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
      },
    });

    const chatHistory = (history || []).map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: "System instructions: " + dynamicSystemPrompt }] },
        { role: "model", parts: [{ text: JSON.stringify({ mode: "chat", message: "Understood. I am Prism, ready to help.", documents: [], tasks: [] }) }] },
        ...chatHistory,
      ],
    });

    const result = await chat.sendMessage(message);
    const text = result.response.text();
    
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { mode: "chat", message: text, documents: [], tasks: [] };
    }

    parsed.mode = parsed.mode || "chat";
    parsed.message = parsed.message || "";
    parsed.documents = parsed.documents || [];
    parsed.tasks = parsed.tasks || [];
    parsed.council_messages = parsed.council_messages || [];
    parsed.council_consensus = parsed.council_consensus || null;
    parsed.follow_up_suggestions = parsed.follow_up_suggestions || [];

    // --- 3. Update MongoDB & Project Memory ---
    try {
      const updatedHistory = [
        ...(history || []).map((m: any) => ({ role: m.role, content: m.content })),
        { role: "user", content: message },
        { role: "assistant", content: parsed.message || "Working on it..." }
      ];

      let projectId = "";
      
      if (conversation_id && conversation_id.startsWith('db-')) {
        projectId = conversation_id.replace('db-', '');
        
        let updateData: any = { chat_history: JSON.stringify(updatedHistory) };
        
        if (parsed.mode === "plan" && parsed.documents.length > 0) {
          // Pick out legacy 4 docs if present for backwards compatibility on projects page
          updateData.summary_markdown = parsed.documents.find((d: any) => d.agent === 'Atlas')?.content || '';
          updateData.architecture_markdown = parsed.documents.find((d: any) => d.agent === 'Nexus')?.content || '';
          updateData.marketing_markdown = parsed.documents.find((d: any) => d.agent === 'Vanguard')?.content || '';
          updateData.finance_markdown = parsed.documents.find((d: any) => d.agent === 'Ledger')?.content || '';
        }

        await ProjectModel.findByIdAndUpdate(projectId, updateData);
        parsed.conversation_id = conversation_id;
      } else {
        // INSERT NEW PROJECT
        let title = parsed.title || (message.length > 50 ? message.substring(0, 47) + "..." : message);
        let atlasDoc = '', nexusDoc = '', vanguardDoc = '', ledgerDoc = '';
        
        if (parsed.mode === "plan" && parsed.documents.length > 0) {
          atlasDoc = parsed.documents.find((d: any) => d.agent === 'Atlas')?.content || '';
          nexusDoc = parsed.documents.find((d: any) => d.agent === 'Nexus')?.content || '';
          vanguardDoc = parsed.documents.find((d: any) => d.agent === 'Vanguard')?.content || '';
          ledgerDoc = parsed.documents.find((d: any) => d.agent === 'Ledger')?.content || '';
        }
        
        const newProject = await ProjectModel.create({
          title,
          description: message,
          summary_markdown: atlasDoc,
          architecture_markdown: nexusDoc,
          marketing_markdown: vanguardDoc,
          finance_markdown: ledgerDoc,
          chat_history: JSON.stringify(updatedHistory)
        });
        
        projectId = newProject._id.toString();
        parsed.conversation_id = `db-${projectId}`;
      }

      // Add to Project Memory
      if (projectId && parsed.mode === "plan") {
        const architect = getArchitect();
        
        // Add goal
        await memoryService.addEntry({
          projectId,
          category: 'goal',
          agentId: architect.id,
          agentName: architect.name,
          title: parsed.title || 'New Goal',
          content: message
        });
        
        // Add generated documents to memory
        for (const doc of parsed.documents) {
          await memoryService.addEntry({
            projectId,
            category: 'document',
            agentName: doc.agent,
            title: doc.title,
            content: doc.content
          });
        }
      }
    } catch (dbError) {
      console.error("❌ Failed to save project/memory to MongoDB:", dbError);
    }

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process request" },
      { status: 500 }
    );
  }
}
