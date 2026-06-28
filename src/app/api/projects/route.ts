import { NextResponse } from "next/server";
import { initDb, ProjectModel } from "@/lib/db";

export async function GET() {
  try {
    await initDb();

    // Fetch projects using Mongoose
    const projects = await ProjectModel.find().sort({ created_at: -1 });

    const mapped = projects.map(p => ({
      id: p._id.toString(),
      title: p.title,
      description: p.description,
      status: p.status,
      timestamp: p.created_at ? new Date(p.created_at).getTime() : Date.now()
    }));

    return NextResponse.json(mapped);
  } catch (error: any) {
    console.error("Failed to fetch projects from MongoDB:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
