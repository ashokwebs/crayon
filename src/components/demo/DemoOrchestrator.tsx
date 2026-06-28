"use client";

import { useEffect, useState } from "react";

export type DemoState = 'idle' | 'initializing' | 'planning' | 'executing' | 'external_routing' | 'compiling' | 'completed';

export interface DemoEvent {
  id: string;
  time: number; // relative ms from start
  type: 'agent_active' | 'task_created' | 'aicoo_route' | 'aicoo_response' | 'deliverable_added' | 'state_change';
  agentId?: string;
  targetOrgId?: string;
  message?: string;
  newState?: DemoState;
}

const DEMO_SEQUENCE: DemoEvent[] = [
  { id: '1', time: 0, type: 'state_change', newState: 'initializing', message: 'User requested: "Global Port Logistics & Predictive Supply Chain Rebalancing"' },
  { id: '2', time: 1000, type: 'agent_active', agentId: 'prism', message: 'Architect parsing maritime logistics datasets & real-time telemetry...' },
  { id: '3', time: 2200, type: 'state_change', newState: 'planning', message: 'Deconstructing global rebalancing into 4 macro-tracks' },
  { id: '4', time: 3400, type: 'task_created', agentId: 'nexus', message: 'Task assigned: Autonomous IoT Fleet Edge-Compute Architecture' },
  { id: '5', time: 4400, type: 'task_created', agentId: 'vanguard', message: 'Task assigned: Geopolitical & Stakeholder Crisis Strategy' },
  { id: '6', time: 5400, type: 'task_created', agentId: 'oracle', message: 'Task assigned: Meteorological & Maritime Risk Modeling' },
  { id: '7', time: 6400, type: 'task_created', agentId: 'ledger', message: 'Task assigned: Dynamic Tariff & Bunker Fuel Cost Hedging' },
  
  { id: '8', time: 7600, type: 'state_change', newState: 'executing', message: 'Executive Council synchronizing with global datacenters...' },
  { id: '9', time: 8800, type: 'agent_active', agentId: 'nexus', message: 'CTO requires massive Kubernetes cluster scaling simulation' },
  
  { id: '10', time: 10000, type: 'state_change', newState: 'external_routing', message: 'Aicoo Network triggered for specialized domain expertise' },
  { id: '11', time: 11200, type: 'aicoo_route', agentId: 'nexus', targetOrgId: 'cloudscale', message: 'Routing K8s scaling simulation to CloudScale Infrastructure' },
  { id: '12', time: 12400, type: 'aicoo_route', agentId: 'oracle', targetOrgId: 'datapulse', message: 'Routing meteorological risk forecasting to Apex Financial Auditors' },
  
  { id: '13', time: 13800, type: 'aicoo_response', agentId: 'nexus', targetOrgId: 'cloudscale', message: 'CloudScale: Spot instance strategy optimized for 40% cost reduction' },
  { id: '14', time: 14800, type: 'deliverable_added', agentId: 'nexus', message: 'K8s Multi-Region Topology Map' },
  
  { id: '15', time: 16000, type: 'aicoo_response', agentId: 'oracle', targetOrgId: 'datapulse', message: 'Apex: El Niño probability adjusted. Rerouting Pacific cargo lines.' },
  { id: '16', time: 17000, type: 'deliverable_added', agentId: 'oracle', message: 'Predictive Meteorological Routing Engine' },
  
  { id: '17', time: 18200, type: 'deliverable_added', agentId: 'vanguard', message: 'Geopolitical Risk Mitigation Protocol' },
  { id: '18', time: 19400, type: 'deliverable_added', agentId: 'ledger', message: 'Automated Fuel Hedging Smart Contracts' },
  
  { id: '19', time: 20600, type: 'state_change', newState: 'compiling', message: 'Architect compiling master supply chain rebalancing executable' },
  { id: '20', time: 22000, type: 'deliverable_added', agentId: 'prism', message: 'Project Leviathan — Master Execution Plan' },
  { id: '21', time: 23500, type: 'state_change', newState: 'completed', message: 'Global Orchestration Complete' },
];

export function useDemoOrchestrator(isPlaying: boolean, onEvent: (event: DemoEvent) => void) {
  const [currentTime, setCurrentTime] = useState(0);
  const [eventIndex, setEventIndex] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;

    let startTime = Date.now() - currentTime;
    let animationFrameId: number;

    const tick = () => {
      const now = Date.now() - startTime;
      setCurrentTime(now);

      // Check if we passed the next event's time
      if (eventIndex < DEMO_SEQUENCE.length && now >= DEMO_SEQUENCE[eventIndex].time) {
        onEvent(DEMO_SEQUENCE[eventIndex]);
        setEventIndex(prev => prev + 1);
      }

      if (eventIndex < DEMO_SEQUENCE.length) {
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, eventIndex, currentTime, onEvent]);

  const reset = () => {
    setCurrentTime(0);
    setEventIndex(0);
  };

  return { currentTime, progress: Math.min(100, (currentTime / 23500) * 100), reset };
}
