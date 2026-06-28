"use client";

import { useState, useEffect } from "react";
import { Settings2, Cpu, Shield, Key, Bell, Save, Check } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const [model, setModel] = useState("gemini-2.5-flash");
  const [temperature, setTemperature] = useState(0.4);
  const [memoryWindow, setMemoryWindow] = useState("session");
  const [topP, setTopP] = useState(0.9);
  const [maxTokens, setMaxTokens] = useState(4096);
  const [autonomyLevel, setAutonomyLevel] = useState("supervised");
  const [securityMfa, setSecurityMfa] = useState(true);
  const [encryption, setEncryption] = useState(true);
  const [aicooBroadcast, setAicooBroadcast] = useState(true);
  
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState("agent");

  // Load saved preferences from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedModel = localStorage.getItem("crayon_model");
      const savedTemp = localStorage.getItem("crayon_temperature");
      const savedMemory = localStorage.getItem("crayon_memory");
      if (savedModel) setModel(savedModel);
      if (savedTemp) setTemperature(parseFloat(savedTemp));
      if (savedMemory) setMemoryWindow(savedMemory);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("crayon_model", model);
    localStorage.setItem("crayon_temperature", temperature.toString());
    localStorage.setItem("crayon_memory", memoryWindow);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sections = [
    { id: "agent", name: "Agent Parameters", icon: Cpu },
    { id: "api", name: "API & Providers", icon: Key },
    { id: "security", name: "Security & Auditing", icon: Shield },
    { id: "aicoo", name: "Aicoo Integration", icon: Settings2 },
    { id: "notifications", name: "Alerts & Telemetry", icon: Bell },
  ];


  return (
    <div className="px-4 md:px-8 lg:px-12 pb-8 max-w-[1200px] mx-auto pt-6 md:pt-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface mb-1 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-500 to-zinc-700 flex items-center justify-center text-white shadow-lg">
            <Settings2 className="w-5 h-5" />
          </div>
          System Settings
        </h2>
        <p className="text-sm text-on-surface-variant/70 max-w-2xl">
          Configure Crayon Command Center preferences, agent models, and Aicoo Knowledge Base.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
        {/* Settings Navigation */}
        <div className="md:col-span-1 flex flex-row md:flex-col gap-1 md:gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          {sections.map((section) => {
            const SectionIcon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors text-left whitespace-nowrap ${
                  activeSection === section.id
                    ? "bg-surface-container-high text-on-surface font-semibold border-l-4 border-zinc-600 shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-medium border-l-4 border-transparent"
                }`}
              >
                <SectionIcon className="w-4 h-4 shrink-0" />
                <span className="hidden md:inline">{section.name}</span>
                <span className="md:hidden">{section.name.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Settings Content */}
        <div className="md:col-span-3 space-y-6">
          

          {/* AGENT SECTION */}
          {activeSection === "agent" && (
            <div className="bg-surface border border-outline-variant rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-lowest">
                <h3 className="text-lg font-bold text-on-surface">Agent Inference Parameters</h3>
                <p className="text-xs text-on-surface-variant mt-1">Configure how the AI agents process and respond to your requests.</p>
              </div>
              
              <div className="p-6 space-y-8">
                {/* Setting 1: LLM Model */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold text-on-surface">Default LLM Model</label>
                    <span className="text-xs bg-zinc-800/10 text-zinc-300 px-2 py-0.5 rounded border border-zinc-600/20 font-bold">Active</span>
                  </div>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant rounded-lg p-3 text-sm text-on-surface focus:outline-none focus:border-zinc-600 transition-colors"
                  >
                    <option value="gemini-2.5-flash">gemini-2.5-flash (Fast, Default)</option>
                    <option value="gemini-2.5-pro">gemini-2.5-pro (Advanced Reasoning)</option>
                    <option value="claude-3-5-sonnet">claude-3-5-sonnet (Via Vertex AI)</option>
                  </select>
                  <p className="text-[10px] text-on-surface-variant mt-2">The baseline model used by Prism to architect and delegate sub-tasks.</p>
                </div>

                {/* Setting 2: Temperature */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold text-on-surface">System Temperature (Creativity)</label>
                    <span className="text-sm font-bold text-on-surface">{temperature.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full accent-zinc-500"
                  />
                  <div className="flex justify-between text-[10px] text-on-surface-variant mt-1 font-medium">
                    <span>Deterministic (0.0)</span>
                    <span>Creative (1.0)</span>
                  </div>
                </div>

                {/* Setting 3: Memory Window */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold text-on-surface">Agent Memory Window</label>
                  </div>
                  <select
                    value={memoryWindow}
                    onChange={(e) => setMemoryWindow(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant rounded-lg p-3 text-sm text-on-surface focus:outline-none focus:border-zinc-600 transition-colors"
                  >
                    <option value="session">Session Only (Ephemeral)</option>
                    <option value="last10">Last 10 Interactions</option>
                    <option value="infinite">Infinite (Aicoo Crayon Store)</option>
                  </select>
                  <p className="text-[10px] text-on-surface-variant mt-2">Controls how much context is fetched from the Aicoo Crayon Store during orchestration.</p>
                </div>

                {/* Additional Settings */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-on-surface mb-2 block">Top-P (Nucleus Sampling)</label>
                    <input type="range" min="0" max="1" step="0.05" value={topP} onChange={(e) => setTopP(parseFloat(e.target.value))} className="w-full accent-zinc-500" />
                    <div className="text-right text-[10px] text-on-surface-variant font-bold mt-1">{topP.toFixed(2)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-on-surface mb-2 block">Max Output Tokens</label>
                    <select value={maxTokens} onChange={(e) => setMaxTokens(parseInt(e.target.value))} className="w-full bg-surface-container border border-outline-variant rounded-lg p-2 text-sm text-on-surface focus:outline-none">
                      <option value={1024}>1024 (Fast)</option>
                      <option value={4096}>4096 (Standard)</option>
                      <option value={8192}>8192 (Extensive)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold text-on-surface">Agent Autonomy Level</label>
                  </div>
                  <select
                    value={autonomyLevel}
                    onChange={(e) => setAutonomyLevel(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant rounded-lg p-3 text-sm text-on-surface focus:outline-none focus:border-zinc-600 transition-colors"
                  >
                    <option value="supervised">Supervised (Requires Approval)</option>
                    <option value="autonomous">Autonomous (Standard Guardrails)</option>
                    <option value="aggressive">Aggressive (Zero-Wait Execution)</option>
                  </select>
                  <p className="text-[10px] text-on-surface-variant mt-2">Determines whether executive agents wait for human approval before executing destructive actions or financial commitments.</p>
                </div>
              </div>
              
              <div className="px-6 py-4 border-t border-outline-variant bg-surface-container-low flex justify-between items-center">
                {saved && (
                  <div className="flex items-center gap-2 text-zinc-300 text-sm font-medium">
                    <Check className="w-4 h-4" />
                    Preferences saved
                  </div>
                )}
                {!saved && <div />}
                <button
                  onClick={handleSave}
                  className="bg-on-surface text-surface-container-lowest px-6 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save Preferences
                </button>
              </div>
            </div>
          )}

          {activeSection === "api" && (
            <div className="bg-surface border border-outline-variant rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-lowest">
                <h3 className="text-lg font-bold text-on-surface">API Keys & External Providers</h3>
                <p className="text-xs text-on-surface-variant mt-1">Manage integrations with LLMs, Vector Databases, and Cloud infrastructure.</p>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="text-sm font-semibold text-on-surface block mb-2">Google Gemini API Key</label>
                  <div className="flex items-center gap-2">
                    <input type="password" value="••••••••••••••••••••" readOnly className="flex-1 bg-surface-container border border-outline-variant rounded-lg p-3 text-sm text-on-surface-variant" />
                    <button className="text-xs bg-zinc-800/10 text-zinc-300 px-3 py-2 rounded-lg border border-zinc-600/20 font-bold hover:bg-zinc-800/20 transition-colors">Rotate</button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-on-surface block mb-2">Anthropic API Key (Fallback)</label>
                  <div className="flex items-center gap-2">
                    <input type="password" value="" placeholder="sk-ant-..." readOnly className="flex-1 bg-surface-container border border-outline-variant rounded-lg p-3 text-sm text-on-surface-variant" />
                    <button className="text-xs bg-zinc-800 text-white px-4 py-2 rounded-lg font-bold hover:bg-zinc-700 transition-colors">Link</button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-on-surface block mb-2">Aicoo Postgres URI (pgvector)</label>
                  <div className="flex items-center gap-2">
                    <input type="password" value="••••••••••••••••••••" readOnly className="flex-1 bg-surface-container border border-outline-variant rounded-lg p-3 text-sm text-on-surface-variant" />
                    <span className="text-xs text-emerald-500 font-bold px-3 py-2">Connected</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-on-surface block mb-2">AWS Access Key ID (GPU Provisioning)</label>
                  <div className="flex items-center gap-2">
                    <input type="text" value="AKIAIOSFODNN7EXAMPLE" readOnly className="flex-1 bg-surface-container border border-outline-variant rounded-lg p-3 text-sm text-on-surface-variant" />
                    <span className="text-xs text-emerald-500 font-bold px-3 py-2">Connected</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-on-surface block mb-2">Stripe Secret Key (Financial Agent)</label>
                  <div className="flex items-center gap-2">
                    <input type="password" value="••••••••••••••••••••" readOnly className="flex-1 bg-surface-container border border-outline-variant rounded-lg p-3 text-sm text-on-surface-variant" />
                    <span className="text-xs text-emerald-500 font-bold px-3 py-2">Connected</span>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-outline-variant bg-surface-container-low flex justify-end">
                <button className="bg-on-surface text-surface-container-lowest px-6 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">Save Credentials</button>
              </div>
            </div>
          )}

          {activeSection === "security" && (
            <div className="bg-surface border border-outline-variant rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-lowest">
                <h3 className="text-lg font-bold text-on-surface">Security & Auditing</h3>
                <p className="text-xs text-on-surface-variant mt-1">Configure zero-trust protocols and immutable audit logging for SOC2 compliance.</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between p-4 bg-surface-container rounded-lg border border-outline-variant">
                  <div>
                    <p className="text-sm font-bold text-on-surface">Require MFA for Agent Operations</p>
                    <p className="text-[11px] text-on-surface-variant mt-1 max-w-md">Enforce WebAuthn/YubiKey physical tap before agents execute transactions &gt; $5,000.</p>
                  </div>
                  <div onClick={() => setSecurityMfa(!securityMfa)} className={`w-12 h-6 rounded-full flex items-center px-1 cursor-pointer transition-colors ${securityMfa ? 'bg-zinc-800 justify-end' : 'bg-surface-container-highest justify-start'}`}>
                    <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-surface-container rounded-lg border border-outline-variant">
                  <div>
                    <p className="text-sm font-bold text-on-surface">AES-256 Vector Encryption</p>
                    <p className="text-[11px] text-on-surface-variant mt-1 max-w-md">Encrypt Aicoo RAG payloads at rest and in transit. Disabling will improve latency by ~12ms.</p>
                  </div>
                  <div onClick={() => setEncryption(!encryption)} className={`w-12 h-6 rounded-full flex items-center px-1 cursor-pointer transition-colors ${encryption ? 'bg-zinc-800 justify-end' : 'bg-surface-container-highest justify-start'}`}>
                    <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                  </div>
                </div>
                <div className="mt-6">
                  <button className="w-full bg-surface-container-high border border-outline-variant text-on-surface py-3 rounded-lg text-sm font-bold hover:bg-zinc-800 hover:text-white transition-all">Download Cryptographic Audit Trail (CSV)</button>
                </div>
              </div>
            </div>
          )}

          {activeSection === "aicoo" && (
            <div className="bg-surface border border-outline-variant rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-lowest">
                <h3 className="text-lg font-bold text-on-surface">Aicoo Network Configuration</h3>
                <p className="text-xs text-on-surface-variant mt-1">Manage your organization's presence and routing on the decentralized Aicoo ledger.</p>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="text-sm font-semibold text-on-surface block mb-2">Organization Profile ID</label>
                  <input type="text" value="org_crayon_ai_001" readOnly className="w-full bg-surface-container border border-outline-variant rounded-lg p-3 text-sm text-on-surface-variant font-mono" />
                </div>
                <div className="flex items-center justify-between p-4 bg-surface-container rounded-lg border border-outline-variant">
                  <div>
                    <p className="text-sm font-bold text-on-surface">Broadcast Capabilities</p>
                    <p className="text-[11px] text-on-surface-variant mt-1 max-w-md">Allow Aicoo peers to discover and route tasks to Crayon OS agents automatically.</p>
                  </div>
                  <div onClick={() => setAicooBroadcast(!aicooBroadcast)} className={`w-12 h-6 rounded-full flex items-center px-1 cursor-pointer transition-colors ${aicooBroadcast ? 'bg-zinc-800 justify-end' : 'bg-surface-container-highest justify-start'}`}>
                    <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-on-surface block mb-2">Cross-Org Financial Limit (Per Transaction)</label>
                  <div className="flex items-center gap-2">
                    <span className="text-on-surface-variant font-bold">$</span>
                    <input type="number" defaultValue="2500" className="flex-1 bg-surface-container border border-outline-variant rounded-lg p-3 text-sm text-on-surface focus:outline-none focus:border-zinc-500" />
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-outline-variant bg-surface-container-low flex justify-end">
                <button className="bg-on-surface text-surface-container-lowest px-6 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">Update Aicoo Registry</button>
              </div>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="bg-surface border border-outline-variant rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-lowest">
                <h3 className="text-lg font-bold text-on-surface">Alerts & Telemetry</h3>
                <p className="text-xs text-on-surface-variant mt-1">Configure Webhook endpoints and WebSocket subscriptions for real-time state changes.</p>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { label: "Agent task completion", desc: "Get notified when an orchestration completes", enabled: true },
                  { label: "System errors", desc: "Alert when backend encounters critical errors", enabled: true },
                  { label: "New document embedded", desc: "Notification when Aicoo saves a new vector", enabled: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3 bg-surface-container rounded-lg border border-outline-variant">
                    <div>
                      <p className="text-sm font-medium text-on-surface">{item.label}</p>
                      <p className="text-[10px] text-on-surface-variant mt-0.5">{item.desc}</p>
                    </div>
                    <div className={`w-10 h-5 rounded-full flex items-center px-0.5 cursor-pointer transition-colors ${item.enabled ? 'bg-zinc-800 justify-end' : 'bg-surface-container-highest justify-start'}`}>
                      <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
