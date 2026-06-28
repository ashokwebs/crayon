import { NextResponse } from "next/server";
import { initDb, ProjectModel } from "@/lib/db";
import { AGENTS } from "@/lib/agents/registry";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await initDb();
    
    if (id.startsWith('local-')) {
      return NextResponse.json([]);
    }

    const projectId = id.replace('db-', '');
    const project = await ProjectModel.findById(projectId);

    if (!project) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    const documents = [];
    if (project.summary_markdown) {
      documents.push({
        title: "Executive Summary",
        agent: AGENTS.find(a => a.id === "atlas")?.name || "Atlas",
        content: project.summary_markdown
      });
    }
    if (project.architecture_markdown) {
      documents.push({
        title: "Technical Architecture",
        agent: AGENTS.find(a => a.id === "nexus")?.name || "Nexus",
        content: project.architecture_markdown
      });
    }
    if (project.marketing_markdown) {
      documents.push({
        title: "Go-to-Market Strategy",
        agent: AGENTS.find(a => a.id === "vanguard")?.name || "Vanguard",
        content: project.marketing_markdown
      });
    }
    if (project.finance_markdown) {
      documents.push({
        title: "Financial Projections",
        agent: AGENTS.find(a => a.id === "ledger")?.name || "Ledger",
        content: project.finance_markdown
      });
    }

    return NextResponse.json(documents);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
