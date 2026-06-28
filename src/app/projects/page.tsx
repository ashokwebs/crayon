"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Loader2, FolderOpen, MessageSquare, Clock, ExternalLink, FileText, Activity, Target, CheckCircle2, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

type Conversation = {
  conversation_id: string;
  title?: string;
  created_at?: string;
  messages?: { role: string; content: string }[];
  documents_count?: number;
};

const activeInitiatives = [
  {
    id: 1,
    name: "Crayon OS Kernel Upgrade",
    description: "Migrating core orchestrator to Rust",
    status: "In Progress",
    progress: 88,
    dueDate: "Q3 2026",
    icon: Activity,
    color: "text-zinc-300",
    bg: "bg-zinc-800/10",
  },
  {
    id: 2,
    name: "Global VPC Peering",
    description: "Cross-region latency optimization",
    status: "Planning",
    progress: 15,
    dueDate: "Q4 2026",
    icon: Target,
    color: "text-zinc-300",
    bg: "bg-zinc-800/10",
  },
  {
    id: 3,
    name: "Enterprise SSO Integration",
    description: "SAML/OIDC compliance for Fortune 500",
    status: "Pending",
    progress: 0,
    dueDate: "Q1 2027",
    icon: Clock,
    color: "text-zinc-300",
    bg: "bg-zinc-800/10",
  },
  {
    id: 4,
    name: "Zero-Trust Mesh Routing",
    description: "mTLS enforcement across Aicoo network",
    status: "Completed",
    progress: 100,
    dueDate: "Q2 2026",
    icon: CheckCircle2,
    color: "text-zinc-300",
    bg: "bg-zinc-800/10",
  }
];

const agentWorkspaces = [
  {
    id: "prism",
    name: "Prism (Lead Architect)",
    description: "System orchestration and overall architectural design patterns.",
    icon: Target,
    color: "text-zinc-300",
    bg: "bg-zinc-800/10",
    gradient: "from-zinc-800 to-zinc-950",
    activeTasks: 3,
    status: "Online",
    details: "Currently optimizing the event-driven microservices layout."
  },
  {
    id: "atlas",
    name: "Atlas (CEO / Strategy)",
    description: "Business model formulation, TAM analysis, and pitch decks.",
    icon: Activity,
    color: "text-zinc-300",
    bg: "bg-zinc-800/10",
    gradient: "from-zinc-800 to-zinc-950",
    activeTasks: 1,
    status: "Online",
    details: "Drafting the Series A valuation targets."
  },
  {
    id: "nexus",
    name: "Nexus (CTO / Engineering)",
    description: "Technical specifications, database schemas, and API design.",
    icon: CheckCircle2,
    color: "text-zinc-300",
    bg: "bg-zinc-800/10",
    gradient: "from-zinc-800 to-zinc-950",
    activeTasks: 5,
    status: "Busy",
    details: "Reviewing pull requests and scaling the GPU inference cluster."
  },
  {
    id: "vanguard",
    name: "Vanguard (CMO / Marketing)",
    description: "Go-to-market strategies, SEO optimization, and viral loops.",
    icon: Target,
    color: "text-zinc-300",
    bg: "bg-zinc-800/10",
    gradient: "from-zinc-800 to-zinc-950",
    activeTasks: 2,
    status: "Online",
    details: "A/B testing the new freemium tier landing pages."
  }
];

  // Database handles seed projects now
const baseDate = Date.now();
const demoProjects = [
  {
    conversation_id: "demo-1",
    title: "Project NexusRed: Zero-Trust Security Arch",
    description: "We need to design a zero-trust architecture for a new fintech client. They are scaling fast and need to ensure compliance with SOC2 and PCI-DSS.",
    category: "Generated Project",
    status: "Active",
    progress: 100,
    created_at: new Date(baseDate - 1000 * 60 * 60 * 2).toISOString().split('T')[0]
  },
  {
    conversation_id: "demo-2",
    title: "NovaVault: Autonomous Fintech OS",
    description: "Upgrade the NovaVault AI assistant with context-aware, portfolio-synced financial reasoning.",
    category: "Generated Project",
    status: "Active",
    progress: 100,
    created_at: new Date(baseDate - 1000 * 60 * 60 * 24).toISOString().split('T')[0]
  },
  {
    conversation_id: "demo-3",
    title: "Gengen: Cinematic Identity Platform",
    description: "Finalize the NEXUS Identity OS by implementing an interactive, login-gated cinematic boot sequence.",
    category: "Generated Project",
    status: "Active",
    progress: 100,
    created_at: new Date(baseDate - 1000 * 60 * 60 * 48).toISOString().split('T')[0]
  },
  {
    conversation_id: "demo-4",
    title: "QuantumLedger: HFT Financial Engine",
    description: "Build an HFT (High-Frequency Trading) engine. We need sub-millisecond latency for crypto arbitrage.",
    category: "Generated Project",
    status: "Active",
    progress: 100,
    created_at: new Date(baseDate - 1000 * 60 * 60 * 120).toISOString().split('T')[0]
  },
  {
    conversation_id: "demo-5",
    title: "Don't Press The Button: Viral Game",
    description: "Develop a highly polished, chaotic browser game where an evolving, sentient red button reacts to user interactions.",
    category: "Generated Project",
    status: "Active",
    progress: 100,
    created_at: new Date(baseDate - 1000 * 60 * 60 * 160).toISOString().split('T')[0]
  }
];

export default function ProjectsPage() {
  const [conversations, setConversations] = useState<Conversation[]>(demoProjects);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchConversations() {
      try {
        const res = await fetch('/api/projects');
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        
        // Map Aicoo DB projects to the UI format
        const dbProjects = (data.projects || []).map((p: any) => ({
          conversation_id: `db-${p.id}`,
          title: p.title || "Generated Plan",
          description: p.description || "Auto-generated project from conversation.",
          category: "Generated Project",
          status: p.status || "Active",
          progress: 100,
          created_at: new Date(p.created_at).toISOString().split('T')[0]
        }));


        setConversations([...dbProjects, ...demoProjects]);

      } catch (err) {
        console.error("Error fetching Aicoo projects:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchConversations();
  }, []);

  const handleDelete = async (e: React.MouseEvent, conversation_id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      return;
    }
    
    try {
      const res = await fetch(`/api/projects/${conversation_id}`, { method: 'DELETE' });
      if (res.ok) {
        setConversations(prev => prev.filter(c => c.conversation_id !== conversation_id));
      } else {
        const err = await res.json();
        alert(err.error || "Failed to delete project");
      }
    } catch (err) {
      alert("Error connecting to server");
    }
  };

  const filtered = conversations.filter(
    (c) =>
      (c.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.conversation_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTimeAgo = (dateStr?: string) => {
    if (!dateStr) return "Unknown";
    try {
      const diff = Date.now() - new Date(dateStr).getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 1) return "Just now";
      if (mins < 60) return `${mins}m ago`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    } catch {
      return "Unknown";
    }
  };

  return (
    <div className="px-4 md:px-8 lg:px-12 pb-8 max-w-[1600px] mx-auto flex flex-col pt-6 md:pt-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 shrink-0"
      >
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface mb-1">Projects</h2>
          <p className="text-sm text-on-surface-variant/70 max-w-2xl">
            Manage your startup portfolios, active workspaces, and strategic initiatives.
          </p>
        </div>
        <Link
          href="/boardroom"
          className="bg-gradient-to-r from-zinc-800 to-zinc-950 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-black/25 transition-all flex items-center gap-2 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          New Project
        </Link>
      </motion.div>

      {/* Search */}
      <div className="mb-10">
        <div className="relative group max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 w-4 h-4 transition-colors group-focus-within:text-zinc-300" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-surface-container/50 border border-outline-variant/50 rounded-xl py-2.5 pl-10 pr-4 text-sm text-on-surface focus:outline-none focus:border-zinc-600/40 focus:ring-1 focus:ring-zinc-600/20 w-full transition-all placeholder:text-on-surface-variant/40"
            placeholder="Search projects or agents..."
          />
        </div>
      </div>

      {/* Strategic Initiatives Section */}
      {!searchQuery && (
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-xl font-bold text-on-surface">Strategic Initiatives</h3>
            <span className="bg-surface-container-high text-on-surface-variant text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              {activeInitiatives.length} Active
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeInitiatives.map((project) => (
              <motion.div 
                key={project.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: project.id * 0.06 }}
                className="premium-card group flex flex-col p-5 rounded-xl cursor-default"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg ${project.bg} ${project.color}`}>
                      <project.icon size={20} />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold text-on-surface group-hover:text-primary transition-colors">
                        {project.name}
                      </h4>
                      <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-1">
                        {project.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      project.status === 'Completed' ? 'bg-zinc-800/10 text-zinc-300 dark:text-zinc-300' :
                      project.status === 'In Progress' ? 'bg-zinc-800/10 text-zinc-300 dark:text-zinc-300' :
                      project.status === 'Planning' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400' :
                      'bg-zinc-800/10 text-zinc-300 dark:text-zinc-300'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-outline-variant/40">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wide">
                      Target: {project.dueDate}
                    </span>
                    <span className="text-xs font-bold text-on-surface">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden shadow-inner">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        project.progress === 100 ? 'bg-zinc-800' : 
                        project.progress === 0 ? 'bg-transparent' : 'bg-on-surface'
                      }`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Agent Workspaces Section */}
      {!searchQuery && (
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-xl font-bold text-on-surface">Agent Workspaces</h3>
            <span className="bg-surface-container-high text-on-surface-variant text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              4 Online
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {agentWorkspaces.map((agent, idx) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="premium-card rounded-xl p-5 flex flex-col group cursor-default"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${agent.gradient} flex items-center justify-center text-white shadow-lg shrink-0 group-hover:scale-105 transition-transform`}>
                    <agent.icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${agent.status === 'Online' ? 'bg-zinc-800/10 text-zinc-300' : 'bg-zinc-800/10 text-zinc-300'}`}>
                    {agent.status}
                  </span>
                </div>
                <h4 className="text-base font-bold text-on-surface mb-1">{agent.name}</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed mb-3">{agent.description}</p>
                <div className="mt-auto pt-4 border-t border-outline-variant/30">
                  <p className="text-[10px] text-on-surface-variant/70 italic mb-3 line-clamp-2">"{agent.details}"</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-on-surface-variant">
                      Active Tasks
                    </span>
                    <span className={`text-xs font-bold ${agent.color}`}>
                      {agent.activeTasks}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Generated Projects Section */}
      <div className="mb-6 mt-4">
        <h3 className="text-xl font-bold text-on-surface mb-6">Generated Projects</h3>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-20">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-300" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-surface border border-outline-variant rounded-xl p-12 text-center text-on-surface-variant flex flex-col items-center">
          <FolderOpen className="w-12 h-12 mb-4 opacity-30" />
          <p className="text-lg font-medium text-on-surface">
            {searchQuery ? "No matching projects" : "No projects yet"}
          </p>
          <p className="text-sm mt-1">
            {searchQuery
              ? "Try a different search term."
              : "Start a conversation in the Board Room to create your first project."}
          </p>
          {!searchQuery && (
            <Link
              href="/boardroom"
              className="mt-4 bg-on-surface text-surface-container-lowest px-4 py-2 rounded-md text-sm font-semibold hover:bg-on-surface/90 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Start New Project
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((conv, idx) => {
            const msgCount = conv.messages?.length || 0;
            const lastMsg = conv.messages?.[conv.messages.length - 1];
            const preview = lastMsg?.content?.slice(0, 120) || "No messages yet";
            const isSeed = false; // All are real database entries now
            const gradients = [
              "from-zinc-700 to-zinc-950",
              "from-zinc-800 to-zinc-900",
              "from-zinc-600 to-zinc-800",
              "from-zinc-800 to-zinc-950",
              "from-zinc-700 to-zinc-900",
              "from-zinc-800 to-zinc-950",
            ];
            const gradient = gradients[idx % gradients.length];

            return (
              <motion.div
                key={conv.conversation_id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <Link
                  href="/boardroom"
                  onClick={() => {
                    localStorage.setItem('active_conversation_id', conv.conversation_id);
                  }}
                  className="premium-card rounded-xl p-5 flex flex-col gap-3 group block"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-sm shadow-lg shrink-0`}>
                        {(conv.title || "P").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-on-surface group-hover:text-zinc-300 transition-colors line-clamp-1">
                          {conv.title || "Untitled Project"}
                        </h3>
                        <p className="text-[10px] text-on-surface-variant/50 font-mono mt-0.5">
                          {conv.conversation_id.slice(0, 16)}...
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {parseInt(conv.conversation_id.replace('db-', '')) > 6 && (
                        <button
                          onClick={(e) => handleDelete(e, conv.conversation_id)}
                          className="p-1.5 text-on-surface-variant/40 hover:text-zinc-300 hover:bg-zinc-800/10 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      <ExternalLink className="w-4 h-4 text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                    </div>
                  </div>

                  <p className="text-xs text-on-surface-variant/70 line-clamp-2 leading-relaxed">
                    {preview}...
                  </p>

                  <div className="flex items-center gap-4 mt-auto pt-2 border-t border-outline-variant/30">
                    <div className="flex items-center gap-1 text-[10px] text-on-surface-variant/60">
                      <MessageSquare className="w-3 h-3" />
                      <span>{msgCount} messages</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-on-surface-variant/60">
                      <FileText className="w-3 h-3 text-zinc-300/60" />
                      <span>{conv.documents_count || 0} documents</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-on-surface-variant/60">
                      <Clock className="w-3 h-3" />
                      <span>{getTimeAgo(conv.created_at)}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Projects Insight Footer */}
      <div className="mt-8 shrink-0 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="premium-card rounded-xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-zinc-800/10 flex items-center justify-center shrink-0">
            <Target className="w-5 h-5 text-zinc-300" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-on-surface">Portfolio Orchestration</h4>
            <p className="text-[11px] text-on-surface-variant/80 mt-1.5 leading-relaxed">
              Every initiative is autonomously managed by the Crayon OS Executive Layer. The system assigns specialized agents to draft specifications, analyze market fits, and synthesize strategic directives into actionable code and documentation.
            </p>
          </div>
        </div>
        <div className="premium-card rounded-xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-zinc-800/10 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5 text-zinc-300" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-on-surface">Live Agent Workspaces</h4>
            <p className="text-[11px] text-on-surface-variant/80 mt-1.5 leading-relaxed">
              Active projects maintain a dedicated memory context in the Aicoo vector store, ensuring continuity. Agents seamlessly shift focus between workspaces while preserving exact project state and historical decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
