"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, FileText, Database, GitBranch, Download, ChevronRight, Share2, Rocket } from "lucide-react";

interface DemoSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestart: () => void;
}

export function DemoSummaryModal({ isOpen, onClose, onRestart }: DemoSummaryModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-surface/90 backdrop-blur-xl border border-outline-variant/40 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-outline-variant/30 flex items-center gap-4 bg-surface-container/50">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-on-surface truncate">Orchestration Completed</h2>
                <p className="text-sm text-on-surface-variant">The Executive Council has finalized all strategic assets.</p>
              </div>
              <button 
                onClick={onClose}
                className="px-4 py-2 bg-surface border border-outline-variant/50 rounded-lg text-sm font-semibold hover:bg-surface-container transition-colors"
              >
                Close Summary
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8">
              
              {/* Top Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4 flex flex-col gap-1">
                  <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Total Output</span>
                  <span className="text-2xl font-black text-on-surface">5 Docs</span>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4 flex flex-col gap-1">
                  <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Compute Latency</span>
                  <span className="text-2xl font-black text-emerald-400">12.4s</span>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4 flex flex-col gap-1">
                  <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Agents Triggered</span>
                  <span className="text-2xl font-black text-on-surface">5</span>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4 flex flex-col gap-1">
                  <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">AICOO Vectors</span>
                  <span className="text-2xl font-black text-indigo-400">1,240</span>
                </div>
              </div>

              {/* Grid Layout for Docs & Decisions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Generated Documents */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
                    <FileText className="w-4 h-4 text-zinc-400" />
                    Generated Artifacts
                  </h3>
                  <div className="flex flex-col gap-3">
                    {[
                      { name: "Brand Identity Guidelines", author: "Vanguard", size: "1.2 MB" },
                      { name: "Architecture & Security Spec", author: "Nexus", size: "3.4 MB" },
                      { name: "EdTech Market Analysis", author: "Atlas", size: "2.1 MB" },
                      { name: "5-Year Revenue Model", author: "Ledger", size: "840 KB" },
                      { name: "Master Execution Plan", author: "Prism", size: "4.5 MB" }
                    ].map((doc, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-outline-variant/30 bg-surface-container-lowest/50 hover:bg-surface-container-low transition-colors group cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-surface border border-outline-variant/50 flex items-center justify-center text-zinc-400">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-on-surface group-hover:text-emerald-400 transition-colors">{doc.name}</p>
                            <p className="text-[10px] text-on-surface-variant/70 uppercase">By {doc.author} • {doc.size}</p>
                          </div>
                        </div>
                        <Download className="w-4 h-4 text-on-surface-variant/40 group-hover:text-on-surface transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Decisions & Workflow */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-zinc-400" />
                    Key Orchestration Decisions
                  </h3>
                  <div className="relative pl-4 border-l border-outline-variant/30 flex flex-col gap-6 ml-2">
                    
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-background" />
                      <p className="text-sm font-bold text-on-surface">Data Localization Confirmed</p>
                      <p className="text-xs text-on-surface-variant mt-1">Nexus detected EU parameters; automatically routed vector embeddings to Frankfurt AICOO node to ensure GDPR compliance.</p>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-background" />
                      <p className="text-sm font-bold text-on-surface">Pricing Model Shift</p>
                      <p className="text-xs text-on-surface-variant mt-1">Ledger overrode Atlas's freemium suggestion, enforcing a seat-based SaaS model based on projected B2B acquisition costs.</p>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-background" />
                      <p className="text-sm font-bold text-on-surface">Final Synthesis</p>
                      <p className="text-xs text-on-surface-variant mt-1">Prism compiled 14,204 tokens across 4 specialized agent streams into a unified Master Execution Plan in 4.2 seconds.</p>
                    </div>

                  </div>

                  <div className="mt-auto pt-4 flex gap-3">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-zinc-800 to-zinc-950 text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all active:scale-95">
                      <Database className="w-4 h-4" /> Save to AICOO
                    </button>
                    <button onClick={onRestart} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-outline-variant bg-surface rounded-xl text-sm font-bold hover:bg-surface-container transition-all active:scale-95">
                      <Rocket className="w-4 h-4" /> Run Another Demo
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
