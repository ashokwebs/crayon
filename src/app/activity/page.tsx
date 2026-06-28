"use client";

import { useEffect, useState } from "react";
import { History, Target, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Session = {
  _id: string;
  session_id: string;
  project_id: string;
  idea: string;
  status: string;
  final_strategy?: string;
};

export default function ActivityPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSessions() {
      try {
        const res = await fetch('/api/sessions');
        if (!res.ok) throw new Error("Failed to fetch sessions");
        const data = await res.json();
        setSessions(data.sessions || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSessions();
  }, []);

  return (
    <div className="px-6 md:px-12 pb-8 max-w-[1600px] mx-auto pt-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex justify-between items-end"
      >
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-on-surface mb-1 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center text-white shadow-lg shadow-black/20">
              <History className="w-5 h-5" />
            </div>
            Activity Log
          </h2>
          <p className="text-sm text-on-surface-variant/70 max-w-2xl">
            Review past agent orchestrations, architecture plans, and executive strategies saved in the Aicoo database.
          </p>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center p-20">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-300" />
        </div>
      ) : error ? (
        <div className="bg-zinc-800/10 border border-zinc-600/20 text-zinc-300 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      ) : sessions.length === 0 ? (
        <div className="bg-surface border border-outline-variant rounded-xl p-12 text-center text-on-surface-variant flex flex-col items-center">
          <Target className="w-12 h-12 mb-4 opacity-50" />
          <p className="text-lg font-medium">No activity found.</p>
          <p className="text-sm mt-1">Start an orchestration in the Board Room to see it here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sessions.map((session) => (
            <div key={session._id} className="premium-card rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 bg-surface-container-low border-b border-outline-variant/30 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    session.status === 'completed' ? 'bg-zinc-800/10 text-zinc-300 border border-zinc-600/20' : 'bg-surface-container-high text-on-surface-variant'
                  }`}>
                    {session.status}
                  </span>
                  <span className="text-[11px] font-mono text-on-surface-variant/60 flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    ID: {session.session_id}
                  </span>
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/40 flex items-center gap-1">
                  <History className="w-3 h-3" />
                  Telemetry Logged
                </div>
              </div>
              
              <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 border-r border-outline-variant/20 pr-6">
                  <h4 className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-3">Strategic Directive</h4>
                  <div className="bg-surface-container-lowest/50 p-4 rounded-xl border border-outline-variant/30 text-sm text-on-surface leading-relaxed">
                    {session.idea}
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    <h4 className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Execution Pipeline</h4>
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant/70">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" /> Aicoo Vector Memory
                    </div>
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant/70">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" /> Prism (Architect)
                    </div>
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant/70">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" /> Executive Layer Routing
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <h4 className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 shadow-[0_0_4px_rgba(161,161,170,0.5)]" />
                    Synthesized Strategy Output
                  </h4>
                  {session.final_strategy ? (
                    <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/40 text-sm text-on-surface max-h-[400px] overflow-y-auto markdown-content">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {session.final_strategy}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-32 bg-surface-container-lowest/30 rounded-xl border border-outline-variant/30 text-on-surface-variant text-sm">
                      Processing directive...
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Activity Insight Footer */}
      <div className="mt-8 shrink-0 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="premium-card rounded-xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-zinc-800/10 flex items-center justify-center shrink-0">
            <History className="w-5 h-5 text-zinc-300" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-on-surface">Immutable Telemetry</h4>
            <p className="text-[11px] text-on-surface-variant/80 mt-1.5 leading-relaxed">
              Every orchestration session is cryptographically logged into the centralized audit trail. This ensures absolute traceability for compliance (SOC2) and provides executive agents with a unified history of strategic decisions.
            </p>
          </div>
        </div>
        <div className="premium-card rounded-xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-zinc-800/10 flex items-center justify-center shrink-0">
            <Target className="w-5 h-5 text-zinc-300" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-on-surface">Vectorized Recall</h4>
            <p className="text-[11px] text-on-surface-variant/80 mt-1.5 leading-relaxed">
              Completed strategies are automatically indexed into the Aicoo vector store. This allows agents to seamlessly cross-reference past architectures when generating new, complex B2B workflow solutions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
