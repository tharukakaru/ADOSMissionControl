import React from 'react';
import { Search, Bell, User } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between h-[60px] bg-bg-panel border-b border-border-main px-4 font-orbitron text-sm w-full relative">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <div className="flex items-center font-bold text-base tracking-wide">
          ARC <span className="text-text-muted ml-1">OS</span>
        </div>
        
        <div className="flex items-center ml-1">
          <div className="bg-accent-yellow text-black px-2 py-0.5 font-extrabold text-[10px] [clip-path:polygon(10%_0,100%_0,90%_100%,0%_100%)] -mr-1 z-10">
            C2
          </div>
          <div className="bg-accent-yellow-dim text-white pl-4 pr-3 py-0.5 font-semibold text-[10px] tracking-widest [clip-path:polygon(0_0,100%_0,95%_100%,0%_100%)]">
            BATTLE MANAGEMENT
          </div>
        </div>

        <div className="text-text-muted text-[10px] font-semibold tracking-widest uppercase ml-2">
          HYENA
        </div>
        
        <div className="text-text-main text-[10px] font-semibold tracking-widest uppercase ml-2 flex items-center">
          SENTINEL <span className="w-1.5 h-1.5 rounded-full bg-accent-green shadow-[0_0_8px_var(--color-accent-green)] ml-1"></span>
        </div>

        <div className="flex items-center gap-1.5 text-text-muted text-[10px] ml-4">
          <span className="w-1 h-1 rounded-full bg-accent-green shadow-[0_0_8px_var(--color-accent-green)]"></span>
          LINK 10ms
        </div>
      </div>

      {/* Center Section (Absolute true center) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-4 whitespace-nowrap">
        <div className="font-orbitron text-accent-yellow text-lg md:text-2xl font-black tracking-widest uppercase">
          ORCHESTRATION FABRIC
        </div>
        <div className="text-[9px] text-text-muted uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
          AUTONOMY : <span className="text-accent-yellow">ON-LOOP</span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <div className="border border-accent-red text-accent-yellow px-2 py-0.5 text-[10px] font-semibold tracking-widest rounded flex items-center">
          CONFIDENTIAL
        </div>
        
        <button className="text-text-muted hover:text-text-main transition-colors flex items-center justify-center ml-1">
          <Search size={16} />
        </button>
        
        <button className="text-text-muted hover:text-text-main transition-colors flex items-center justify-center relative ml-1">
          <Bell size={16} />
          <span className="absolute top-0 right-0.5 w-1 h-1 bg-accent-red rounded-full"></span>
        </button>

        <div className="flex items-center gap-2 ml-2">
          <div className="w-7 h-7 rounded-full bg-bg-active border border-accent-cyan flex items-center justify-center">
            <User size={14} className="text-accent-cyan" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold">K. Premachandra</span>
            <span className="text-[9px] text-text-muted">Commander - ROE-Alpha</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
