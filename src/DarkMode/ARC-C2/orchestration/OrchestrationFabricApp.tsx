'use client';

import React from 'react';
import './orchestration.css';
import Navbar from './components/Navbar/Navbar';
import LeftSidebar from './components/LeftSidebar/LeftSidebar';
import RightSidebar from './components/RightSidebar/RightSidebar';
import FlowCanvas from './components/Canvas/FlowCanvas';
import BottomPanel from './components/BottomPanel/BottomPanel';
import { StoreProvider, useStore } from './context/StoreContext';

function DashboardContent() {
  const { isFlowRunning, toggleFlowRunning, isGovernanceOverlay, toggleGovernanceOverlay } = useStore();

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-bg-main text-text-main font-orbitron">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar (Node Library) */}
        <LeftSidebar />

        {/* Central Canvas (Empty for now) */}
        <main className="flex-1 bg-[#13161d] relative overflow-hidden flex flex-col">
          {/* Top Canvas Controls */}
          <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
            <button 
              onClick={toggleFlowRunning}
              className={`bg-accent-yellow text-black font-bold text-[10px] px-3 py-1.5 uppercase tracking-widest rounded flex items-center gap-1.5 transition-colors ${isFlowRunning ? 'bg-[#e0e120] drop-shadow-[0_0_8px_rgba(241,242,56,0.5)]' : 'hover:bg-accent-yellow-dim'}`}
            >
              <span className="border-r border-black/20 pr-1.5">{isFlowRunning ? '⏸' : '▶'}</span> {isFlowRunning ? 'STOP FLOW' : 'RUN FLOW'}
            </button>
            <button 
              onClick={toggleGovernanceOverlay}
              className={`bg-accent-yellow text-black font-bold text-[10px] px-3 py-1.5 uppercase tracking-widest rounded transition-colors ${isGovernanceOverlay ? 'bg-[#e0e120] drop-shadow-[0_0_8px_rgba(241,242,56,0.5)]' : 'hover:bg-accent-yellow-dim'}`}
            >
              GOVERNANCE OVERLAY
            </button>
            <div className="flex bg-bg-active border border-border-main rounded text-text-muted text-[10px] font-semibold tracking-widest ml-4">
              <button className="px-3 py-1.5 hover:text-text-main transition-colors border-r border-border-main">FIT</button>
              <button className="px-2 py-1.5 hover:text-text-main transition-colors border-r border-border-main">−</button>
              <div className="px-3 py-1.5 flex items-center justify-center min-w-[50px]">55%</div>
              <button className="px-2 py-1.5 hover:text-text-main transition-colors">+</button>
            </div>
          </div>
          

          {/* Interactive Flow Canvas */}
          <div className="absolute inset-0 z-0">
            <FlowCanvas />
          </div>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <button className="bg-bg-panel border border-accent-cyan/50 text-accent-cyan text-[10px] font-semibold px-4 py-2 rounded-full hover:bg-accent-cyan/10 transition-colors uppercase tracking-widest">
              FOCUS - C2 + NEIGHBOURS
            </button>
          </div>
          
          <BottomPanel />
        </main>

        {/* Right Sidebar (Node Inspector/Overview) */}
        <RightSidebar />

      </div>
    </div>
  );
}

export default function OrchestrationFabricApp() {
  return (
    <div className="arc--orchestration">
      <StoreProvider>
        <DashboardContent />
      </StoreProvider>
    </div>
  );
}
