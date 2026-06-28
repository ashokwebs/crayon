"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertOctagon, ShieldAlert } from "lucide-react";
import { usePathname } from "next/navigation";

export function LockdownOverlay() {
  const [isLockdown, setIsLockdown] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleTrigger = () => setIsLockdown(true);
    const handleCancel = () => setIsLockdown(false);

    window.addEventListener("trigger-lockdown", handleTrigger);
    window.addEventListener("cancel-lockdown", handleCancel);

    return () => {
      window.removeEventListener("trigger-lockdown", handleTrigger);
      window.removeEventListener("cancel-lockdown", handleCancel);
    };
  }, []);

  // Cancel lockdown if they navigate away
  useEffect(() => {
    setIsLockdown(false);
  }, [pathname]);

  return (
    <AnimatePresence>
      {isLockdown && (
        <motion.div
          key="lockdown-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1 } }}
          className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden flex items-center justify-center"
        >
          {/* Crimson Flashing Overlay */}
          <motion.div 
            animate={{ opacity: [0.1, 0.4, 0.1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute inset-0 bg-red-600/30 mix-blend-color-burn"
          />
          
          {/* Border Glow */}
          <div className="absolute inset-0 border-[8px] border-red-600/50 shadow-[inset_0_0_100px_rgba(220,38,38,0.5)]" />

          {/* Central Warning Banner */}
          <motion.div 
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            className="relative z-10 bg-red-950/90 backdrop-blur-xl border-2 border-red-500 rounded-3xl p-12 max-w-2xl text-center shadow-[0_0_100px_rgba(220,38,38,0.4)] pointer-events-auto"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="w-24 h-24 mx-auto mb-6 text-red-500"
            >
              <AlertOctagon className="w-full h-full drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-black text-red-500 uppercase tracking-widest mb-4 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">
              Zero-Trust Lockdown
            </h1>
            
            <p className="text-red-200/80 text-lg md:text-xl font-mono mb-8 uppercase tracking-wide">
              Unauthorized vector anomaly detected. Quarantining Executive Council network.
            </p>

            <div className="flex flex-col gap-2 font-mono text-sm text-red-400/60 text-left bg-black/50 p-6 rounded-xl border border-red-900/50">
              <p>{">"} ISOLATING ATLAS NODE... [OK]</p>
              <p>{">"} PURGING VANGUARD CACHE... [OK]</p>
              <p>{">"} SEVERING AICOO UPLINK... [OK]</p>
              <motion.p animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 1 }}>{">"} WAITING FOR ADMIN OVERRIDE...</motion.p>
            </div>

            <button 
              onClick={() => setIsLockdown(false)}
              className="mt-8 px-8 py-4 bg-red-600 text-white font-black uppercase tracking-widest rounded-xl hover:bg-red-500 hover:shadow-[0_0_30px_rgba(239,68,68,0.6)] transition-all active:scale-95 flex items-center justify-center gap-3 w-full"
            >
              <ShieldAlert className="w-5 h-5" />
              Authorize Override
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
