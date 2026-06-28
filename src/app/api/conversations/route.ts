import { NextResponse } from "next/server";
import { initDb, ProjectModel } from "@/lib/db";

export async function GET() {
  try {
    await initDb();
    const projects = await ProjectModel.find({}, 'title description created_at').sort({ created_at: -1 });

    const mapped = projects.map(p => ({
      id: p._id.toString(),
      title: p.title,
      preview: p.description || "",
      timestamp: p.created_at ? new Date(p.created_at).getTime() : Date.now()
    }));

    return NextResponse.json(mapped);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
