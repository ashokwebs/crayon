import type { ProjectMemoryEntry, MemoryCategory } from './types';
import { initDb, ProjectMemoryModel } from '../db';
import { v4 as uuidv4 } from 'uuid';

export class MemoryService {
  /**
   * Add a new entry to the project memory.
   */
  async addEntry(params: Omit<ProjectMemoryEntry, 'id' | 'createdAt'>): Promise<ProjectMemoryEntry> {
    const entry: ProjectMemoryEntry = {
      ...params,
      id: uuidv4(),
      createdAt: Date.now(),
    };

    try {
      await initDb();
      
      await ProjectMemoryModel.create({
        id: entry.id,
        project_id: entry.projectId,
        category: entry.category,
        agent_id: entry.agentId || null,
        agent_name: entry.agentName || null,
        title: entry.title,
        content: entry.content,
        metadata: entry.metadata || null
      });
    } catch (e) {
      console.warn("Failed to persist memory entry to MongoDB, falling back to in-memory/simulated", e);
    }
    
    return entry;
  }

  /**
   * Retrieve all memory entries for a project.
   */
  async getProjectMemory(projectId: string): Promise<ProjectMemoryEntry[]> {
    try {
      await initDb();
      
      const res = await ProjectMemoryModel.find({ project_id: projectId }).sort({ created_at: 1 });
      
      return res.map(row => ({
        id: row.id,
        projectId: row.project_id,
        category: row.category as MemoryCategory,
        agentId: row.agent_id,
        agentName: row.agent_name,
        title: row.title,
        content: row.content,
        createdAt: row.created_at ? new Date(row.created_at).getTime() : Date.now(),
        metadata: row.metadata,
      }));
    } catch (e) {
      console.warn("Failed to fetch memory from MongoDB, returning empty array", e);
      return [];
    }
  }

  /**
   * Summarize the project context for the AI prompt.
   * Compiles mission, goals, and recent decisions into a text block.
   */
  async getContextPrompt(projectId: string): Promise<string> {
    const entries = await this.getProjectMemory(projectId);
    if (entries.length === 0) return "No prior project context.";

    const mission = entries.find(e => e.category === 'mission');
    const decisions = entries.filter(e => e.category === 'decision').slice(-5);
    const documents = entries.filter(e => e.category === 'document');

    let context = "--- PROJECT CONTEXT ---\n";
    if (mission) {
      context += `Mission: ${mission.content}\n\n`;
    }

    if (decisions.length > 0) {
      context += "Recent Decisions:\n";
      decisions.forEach(d => {
        context += `- [${d.agentName || 'System'}]: ${d.content}\n`;
      });
      context += "\n";
    }

    if (documents.length > 0) {
      context += "Generated Documents:\n";
      documents.forEach(d => {
        context += `- ${d.title}\n`;
      });
      context += "\n";
    }

    return context;
  }
}

export const memoryService = new MemoryService();
