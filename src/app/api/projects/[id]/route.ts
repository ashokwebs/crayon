import { NextResponse } from "next/server";
import { initDb, ProjectModel } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await initDb();
    
    // Find project by ID
    const project = await ProjectModel.findById(id);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: project._id.toString(),
      title: project.title,
      description: project.description,
      status: project.status,
      created_at: project.created_at,
      summary_markdown: project.summary_markdown,
      architecture_markdown: project.architecture_markdown,
      marketing_markdown: project.marketing_markdown,
      finance_markdown: project.finance_markdown,
      chat_history: project.chat_history ? JSON.parse(project.chat_history) : []
    });
  } catch (error: any) {
    console.error("Failed to fetch project:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await initDb();
    
    const result = await ProjectModel.findByIdAndDelete(id);
    
    if (!result) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete project:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
