"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, Search, ArrowRight } from "lucide-react";

// Generate mock vector data
const generateVectors = () => {
  const vectors = [];
  const topics = ["E-Commerce Strategy", "Zero-Trust Infra", "Fintech Model", "Marketing Loop", "User Auth", "Data Pipeline"];
  for (let i = 0; i < 200; i++) {
    vectors.push({
      id: `0x${Math.random().toString(16).substr(2, 8).toUpperCase()}`,
      topic: topics[Math.floor(Math.random() * topics.length)],
      confidence: (Math.random() * 0.4 + 0.6).toFixed(2),
      active: Math.random() > 0.85, // 15% are active/glowing
    });
  }
  return vectors;
};

const VECTORS = generateVectors();

export default function MemoryMatrixPage() {
  const [hoveredVector, setHoveredVector] = useState<typeof VECTORS[0] | null>(null);
  const [search, setSearch] = useState("");

  const filteredVectors = VECTORS.filter(v => v.topic.toLowerCase().includes(search.toLowerCase()) || v.id.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="px-6 md:px-12 pb-8 max-w-[1600px] mx-auto h-[calc(100vh-4rem)] flex flex-col pt-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex justify-between items-end shrink-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-on-surface mb-1 flex items-center gap-3">
            <Database className="w-8 h-8 text-indigo-400" />
            AICOO Memory Matrix
          </h2>
          <p className="text-sm text-on-surface-variant/70 max-w-2xl">
            Real-time visualization of your persistent `pgvector` embeddings. Hover over multi-dimensional points to retrieve semantic context.
          </p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search vectors..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-surface-container border border-outline-variant/50 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500 w-64 text-on-surface"
          />
        </div>
      </motion.div>

      <div className="flex-1 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl overflow-hidden relative shadow-inner p-8 flex flex-col">
        {/* Holographic grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        
        {/* Stats Bar */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-indigo-400/50 pointer-events-none">
          <span>{filteredVectors.length} Vectors Loaded</span>
          <span>Dimensionality: 1536</span>
          <span>Distance Metric: Cosine</span>
        </div>

        {/* The Matrix */}
        <div className="flex-1 mt-6 overflow-y-auto pr-4 flex flex-wrap content-start gap-1.5 relative z-10" onMouseLeave={() => setHoveredVector(null)}>
          {filteredVectors.map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.002 }} // Fast cascading reveal
              onMouseEnter={() => setHoveredVector(v)}
              className={`w-3 h-3 sm:w-4 sm:h-4 rounded-sm cursor-pointer transition-all duration-200 ${
                v.active 
                  ? 'bg-indigo-400 shadow-[0_0_8px_#818cf8]' 
                  : 'bg-zinc-800 hover:bg-indigo-500/50'
              } ${hoveredVector?.id === v.id ? 'ring-2 ring-white scale-150 z-20 relative' : ''}`}
            />
          ))}
          {filteredVectors.length === 0 && (
            <div className="w-full text-center text-zinc-500 mt-20">No matching vectors found in memory space.</div>
          )}
        </div>
      </div>

      {/* Floating Context Tooltip */}
      <AnimatePresence>
        {hoveredVector && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-surface/90 backdrop-blur-xl border border-indigo-500/30 rounded-xl p-4 shadow-2xl flex items-center gap-6 min-w-[300px] z-50"
          >
            <div>
              <p className="text-[10px] text-indigo-400 uppercase font-bold tracking-wider mb-1">Vector Hash</p>
              <p className="text-sm font-mono text-zinc-300">{hoveredVector.id}</p>
            </div>
            <div className="w-px h-8 bg-zinc-800" />
            <div className="flex-1">
              <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1">Semantic Context</p>
              <p className="text-sm font-bold text-white">{hoveredVector.topic}</p>
            </div>
            <div className="w-px h-8 bg-zinc-800" />
            <div>
              <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1">Similarity</p>
              <p className="text-sm font-bold text-emerald-400">{hoveredVector.confidence}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
