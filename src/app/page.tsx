'use client';

import { AgentCard } from "@/components/dashboard/AgentCard";
import { MultiAgentWorkspace } from "@/components/workspace/MultiAgentWorkspace";
import { OperationalInsights } from "@/components/dashboard/OperationalInsights";
import { Sparkles, ArrowRight, Zap, Shield, Activity, Brain, Globe, Network } from "lucide-react";
import Link from "next/link";
import { AGENTS, AGENT_COUNT, getArchitect, getExecutives, getDirectors } from "@/lib/agents/registry";

export default function Dashboard() {
  const architect = getArchitect();
  const executives = getExecutives();
  const directors = getDirectors();

  return (
    <div className="px-4 md:px-8 pb-10 max-w-[1440px] mx-auto">
      {/* Hero Section */}
      <div className="mb-10 pt-2">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface-container via-surface-container-low to-surface-container border border-outline-variant/40 p-8 md:p-10">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-zinc-800/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-zinc-800/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-zinc-800/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-300 uppercase tracking-[0.15em] bg-zinc-800/8 border border-zinc-600/15 px-3 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse shadow-[0_0_4px_rgba(161,161,170,0.5)]" />
                  System Online
                </span>
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-300 uppercase tracking-[0.15em] bg-zinc-800/8 border border-zinc-600/15 px-3 py-1 rounded-full">
                  <Globe className="w-3 h-3" />
                  Aicoo Connected
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-on-surface mb-3">
                AI Operating <span className="gradient-text">System</span>
              </h2>
              <p className="text-base text-on-surface-variant/80 max-w-xl leading-relaxed">
                Coordinate your executive AI organization to strategize, architect, and scale operations — internally and across organizations via Aicoo.
              </p>
            </div>
            
            <div className="flex gap-3 shrink-0">
              <Link
                href="/aicoo"
                className="flex items-center gap-2 bg-surface-container/80 border border-zinc-600/30 text-zinc-300 px-5 py-3 rounded-xl text-sm font-bold hover:bg-zinc-800/8 hover:border-zinc-600/50 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] group"
              >
                <Globe className="w-4 h-4" />
                Aicoo Network
              </Link>
              <Link
                href="/boardroom"
                className="flex items-center gap-2 bg-gradient-to-r from-zinc-800 to-zinc-950 text-white px-6 py-3 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-black/25 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] group"
              >
                <Sparkles className="w-4 h-4" />
                Enter Board Room
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="relative z-10 mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total Orchestrations', value: '14,230', icon: Brain, color: 'text-zinc-300', bg: 'bg-zinc-800/8' },
              { label: 'Tokens Processed', value: '2.4B', icon: Zap, color: 'text-zinc-300', bg: 'bg-zinc-800/8' },
              { label: 'Aicoo Partners', value: '24', icon: Globe, color: 'text-zinc-300', bg: 'bg-zinc-800/8' },
              { label: 'Cloud Cost Saved', value: '$4.2M', icon: Shield, color: 'text-zinc-300', bg: 'bg-zinc-800/8' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 bg-surface-container/50 border border-outline-variant/30 rounded-xl px-4 py-3">
                <div className={`w-8 h-8 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] text-on-surface-variant/60 font-medium">{stat.label}</p>
                  <p className="text-sm font-bold text-on-surface">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left/Center Column: Agents & Collaboration */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Architect Agent */}
          <section className="glass-panel rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 shadow-[0_0_6px_rgba(161,161,170,0.4)]" />
                Architect
              </h3>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-zinc-800/10 border border-zinc-600/20 text-zinc-300 uppercase tracking-wider">
                Orchestrator
              </span>
            </div>
            <AgentCard 
              agent={architect}
              status="Idle"
              task="Awaiting task orchestration. Ready to coordinate the executive team."
              confidence={null}
              avatarUrl=""
            />
          </section>

          {/* Executive Leadership */}
          <section className="glass-panel rounded-xl p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 shadow-[0_0_6px_rgba(212,212,216,0.4)]" />
                Executive Leadership
              </h3>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-surface-container-high/50 border border-outline-variant/50 text-on-surface-variant uppercase tracking-wider">
                {executives.length} Executives
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {executives.map((agent) => (
                <AgentCard 
                  key={agent.id}
                  agent={agent}
                  status="Idle"
                  task={agent.description}
                  confidence={null}
                  avatarUrl=""
                />
              ))}
            </div>
          </section>

          {/* Directors */}
          <section className="glass-panel rounded-xl p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 shadow-[0_0_6px_rgba(113,113,122,0.4)]" />
                Specialized Directors
              </h3>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-surface-container-high/50 border border-outline-variant/50 text-on-surface-variant uppercase tracking-wider">
                {directors.length} Directors
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {directors.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  compact
                  status="Idle"
                  confidence={null}
                  avatarUrl=""
                />
              ))}
            </div>
          </section>

          {/* Multi-agent collaboration workspace */}
          <MultiAgentWorkspace />
        </div>

        {/* Right Column: Operational Insights + Quick Links */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Quick Navigation */}
          <section className="premium-card rounded-xl p-5">
            <h3 className="text-sm font-bold text-on-surface mb-4">Quick Access</h3>
            <div className="flex flex-col gap-2">
              <Link href="/orgchart" className="flex items-center gap-3 p-3 rounded-xl border border-outline-variant/30 hover:border-outline-variant/60 hover:bg-surface-container/50 transition-all group">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-950 flex items-center justify-center text-white shadow-sm">
                  <Network className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-on-surface group-hover:text-zinc-300 transition-colors">Org Chart</p>
                  <p className="text-[10px] text-on-surface-variant/60">Visualize hierarchy</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-on-surface-variant/30 group-hover:text-zinc-300 transition-colors" />
              </Link>
              <Link href="/aicoo" className="flex items-center gap-3 p-3 rounded-xl border border-outline-variant/30 hover:border-outline-variant/60 hover:bg-surface-container/50 transition-all group">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center text-white shadow-sm">
                  <Globe className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-on-surface group-hover:text-zinc-300 transition-colors">Aicoo Network</p>
                  <p className="text-[10px] text-on-surface-variant/60">6 connected orgs</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-on-surface-variant/30 group-hover:text-zinc-300 transition-colors" />
              </Link>
              <Link href="/demo" className="flex items-center gap-3 p-3 rounded-xl border border-zinc-600/20 bg-zinc-800/5 hover:border-zinc-600/40 hover:bg-zinc-800/10 transition-all group">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center text-white shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-zinc-300 group-hover:text-zinc-300 transition-colors">Run Demo</p>
                  <p className="text-[10px] text-on-surface-variant/60">Full Aicoo showcase</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-300/40 group-hover:text-zinc-300 transition-colors" />
              </Link>
            </div>
          </section>

          <OperationalInsights />
        </div>
      </div>
    </div>
  );
}
