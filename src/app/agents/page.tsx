"use client";

import { useState } from "react";
import { Search, Cpu, Brain, Target, Terminal, TrendingUp, DollarSign, Shield, FileText, Zap, Settings, Layers, Palette, Scale, Users, Globe, BarChart3, GitBranch, CheckCircle2, Handshake, HeartHandshake } from "lucide-react";
import { motion } from "framer-motion";
import { AGENTS } from "@/lib/agents/registry";
import type { AgentDefinition, AgentTier } from "@/lib/agents/types";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain, Target, Terminal, TrendingUp, DollarSign, Settings, Shield, Search, Layers, Palette, Scale, Users, Globe, BarChart3, GitBranch, CheckCircle2, Handshake, HeartHandshake,
};

const TIER_LABELS: Record<AgentTier, string> = {
  architect: 'Architect',
  executive: 'Executive',
  director: 'Director',
};

const TIER_COLORS: Record<AgentTier, { badge: string; dot: string }> = {
  architect: { badge: 'bg-zinc-800/10 text-zinc-300 border-zinc-600/20', dot: 'bg-zinc-800' },
  executive: { badge: 'bg-zinc-800/10 text-zinc-300 border-zinc-600/20', dot: 'bg-zinc-800' },
  director: { badge: 'bg-zinc-800/10 text-zinc-300 border-zinc-600/20', dot: 'bg-zinc-800' },
};

export default function AgentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState<AgentTier | 'all'>('all');

  const filtered = AGENTS.filter((a) => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = tierFilter === 'all' || a.tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="px-4 md:px-8 lg:px-12 pb-8 max-w-[1600px] mx-auto flex flex-col pt-6 md:pt-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 shrink-0"
      >
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface mb-1">Agent Console</h2>
          <p className="text-sm text-on-surface-variant/70 max-w-2xl">
            Configure, deploy, and monitor your {AGENTS.length} executive AI agents. Each agent has an Aicoo identity for cross-organization coordination.
          </p>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative group max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 w-4 h-4 transition-colors group-focus-within:text-zinc-300" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-surface-container/50 border border-outline-variant/50 rounded-xl py-2.5 pl-10 pr-4 text-sm text-on-surface focus:outline-none focus:border-zinc-600/40 focus:ring-1 focus:ring-zinc-600/20 w-full transition-all placeholder:text-on-surface-variant/40"
            placeholder="Search agents..."
          />
        </div>
        <div className="flex gap-1.5">
          {(['all', 'architect', 'executive', 'director'] as const).map((tier) => (
            <button
              key={tier}
              onClick={() => setTierFilter(tier)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                tierFilter === tier
                  ? 'bg-on-surface text-surface border-on-surface'
                  : 'bg-surface-container/50 text-on-surface-variant border-outline-variant/50 hover:border-outline-variant'
              }`}
            >
              {tier === 'all' ? `All (${AGENTS.length})` : `${TIER_LABELS[tier]}s`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto pb-8">
        {filtered.map((agent, idx) => {
          const AgentIcon = ICON_MAP[agent.icon] || Brain;
          const tierColor = TIER_COLORS[agent.tier];
          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.04 }}
              className="premium-card rounded-xl overflow-hidden flex flex-col group"
            >
              <div className="p-5 border-b border-outline-variant/30">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${agent.gradient} flex items-center justify-center text-white shadow-lg ${agent.glowColor} transition-transform duration-300 group-hover:scale-110`}>
                      <AgentIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-on-surface">{agent.name}</h3>
                      <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-wider">{agent.title}</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border bg-zinc-800/8 text-zinc-300 border-zinc-600/15">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse shadow-[0_0_4px_rgba(161,161,170,0.5)]" />
                    Online
                  </span>
                </div>

                <p className="text-xs text-on-surface-variant/70 mb-4 leading-relaxed line-clamp-2">
                  {agent.description}
                </p>

                {/* Tier + Aicoo badges */}
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${tierColor.badge}`}>
                    {TIER_LABELS[agent.tier]}
                  </span>
                  <span className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-zinc-800/8 text-zinc-300 border border-zinc-600/15 flex items-center gap-1">
                    <Globe className="w-2.5 h-2.5" /> Aicoo
                  </span>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5">
                  {agent.skills.slice(0, 4).map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] font-medium px-2 py-1 bg-surface-container-high/30 border border-outline-variant/30 text-on-surface-variant/80 rounded-lg hover:border-outline-variant/50 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                  {agent.skills.length > 4 && (
                    <span className="text-[10px] font-medium px-2 py-1 text-on-surface-variant/40">
                      +{agent.skills.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Telemetry */}
              <div className="bg-surface-container-lowest/30 p-4 flex-1 flex flex-col justify-end gap-3 min-h-[70px]">
                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">
                  <span>Success Rate</span>
                  <span className="text-zinc-300">99.{Math.floor(Math.random() * 9)}%</span>
                </div>
                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">
                  <span>Tokens Proc.</span>
                  <span className="text-zinc-300">{Math.floor(Math.random() * 900 + 100)}M</span>
                </div>
                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-wider">
                  <span>Uptime (30d)</span>
                  <span className="text-zinc-300">100%</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Agents Insight Footer */}
      <div className="mt-2 shrink-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="premium-card rounded-xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-zinc-800/10 flex items-center justify-center shrink-0">
            <Brain className="w-5 h-5 text-zinc-300" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-on-surface">Cognitive Allocation</h4>
            <p className="text-[11px] text-on-surface-variant/80 mt-1.5 leading-relaxed">
              Crayon OS automatically routes requests to the optimal agent tier based on context complexity, ensuring maximum processing efficiency and reducing LLM inference overhead by up to 40%.
            </p>
          </div>
        </div>
        <div className="premium-card rounded-xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-zinc-800/10 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-zinc-300" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-on-surface">Zero-Trust Boundaries</h4>
            <p className="text-[11px] text-on-surface-variant/80 mt-1.5 leading-relaxed">
              Every agent execution operates within isolated, secure sandboxes. Context boundaries prevent cross-contamination of sensitive strategic data between departments and external organizations.
            </p>
          </div>
        </div>
        <div className="premium-card rounded-xl p-5 flex items-start gap-4 md:col-span-2 lg:col-span-1">
          <div className="w-10 h-10 rounded-lg bg-zinc-800/10 flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5 text-zinc-300" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-on-surface">Aicoo Verification</h4>
            <p className="text-[11px] text-on-surface-variant/80 mt-1.5 leading-relaxed">
              All executive agents carry verified cryptographic signatures to interface securely with the Aicoo network, facilitating autonomous B2B negotiations and authenticated payload delivery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
