"use client";

import { Activity, Clock, Target, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const upcomingProjects = [
  {
    id: 1,
    name: "SOC2 Compliance Sweep",
    description: "Automated penetration testing across VPCs",
    status: "In Progress",
    progress: 88,
    dueDate: "Q3 2026",
    icon: Activity,
    color: "text-zinc-300",
    bg: "bg-zinc-800/10",
    progressGradient: "from-zinc-500 to-zinc-300",
  },
  {
    id: 2,
    name: "Series A Deck Generation",
    description: "Financial modeling & market projections",
    status: "Planning",
    progress: 35,
    dueDate: "Q4 2026",
    icon: Target,
    color: "text-zinc-300",
    bg: "bg-zinc-800/10",
    progressGradient: "from-zinc-500 to-zinc-300",
  },
  {
    id: 3,
    name: "Enterprise SLA Drafting",
    description: "Cross-referencing global legal frameworks",
    status: "Pending",
    progress: 0,
    dueDate: "Q1 2027",
    icon: Clock,
    color: "text-zinc-400",
    bg: "bg-zinc-800/10",
    progressGradient: "from-zinc-800 to-zinc-950",
  },
  {
    id: 4,
    name: "AWS Zero-Trust Config",
    description: "Multi-region database read replica setup",
    status: "Completed",
    progress: 100,
    dueDate: "Q2 2026",
    icon: CheckCircle2,
    color: "text-zinc-300",
    bg: "bg-zinc-800/10",
    progressGradient: "from-zinc-500 to-zinc-300",
  }
];

export function OperationalInsights() {
  return (
    <section className="premium-card rounded-xl p-5 flex-1">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-outline-variant/30">
        <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 shadow-[0_0_6px_rgba(161,161,170,0.4)]" />
          Upcoming Projects
        </h3>
        <span className="text-[10px] font-bold text-on-surface-variant bg-surface-container-high/50 px-2.5 py-1 rounded-lg border border-outline-variant/50 uppercase tracking-wider">
          4 Active
        </span>
      </div>

      <div className="space-y-3">
        {upcomingProjects.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="group flex flex-col p-4 rounded-xl border border-outline-variant/30 bg-surface-container-lowest/50 hover:border-outline-variant/60 hover:bg-surface-container-lowest transition-all duration-200 cursor-default"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${project.bg} ${project.color} transition-transform duration-200 group-hover:scale-110`}>
                  <project.icon size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                    {project.name}
                  </h4>
                  <p className="text-[11px] text-on-surface-variant/70 mt-0.5">
                    {project.description}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant/50">
                  {project.dueDate}
                </span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  project.status === 'Completed' ? 'bg-zinc-800/10 text-zinc-300' :
                  project.status === 'In Progress' ? 'bg-zinc-800/20 text-white' :
                  project.status === 'Planning' ? 'bg-zinc-800/10 text-zinc-400' :
                  'bg-zinc-800/10 text-zinc-500'
                }`}>
                  {project.status}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full">
              <div className="flex-1 h-1.5 bg-surface-container-high/50 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress}%` }}
                  transition={{ duration: 1, delay: idx * 0.1, ease: "easeOut" }}
                  className={`h-full rounded-full bg-gradient-to-r ${project.progressGradient} ${
                    project.progress === 0 ? 'opacity-0' : ''
                  }`}
                />
              </div>
              <span className="text-[11px] font-bold text-on-surface min-w-[3ch] text-right">
                {project.progress}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <button className="w-full mt-6 py-2.5 rounded-xl border border-outline-variant/40 text-on-surface-variant text-sm font-semibold hover:bg-surface-container/50 hover:text-on-surface hover:border-outline-variant transition-all duration-200">
        View All Projects
      </button>
    </section>
  );
}
