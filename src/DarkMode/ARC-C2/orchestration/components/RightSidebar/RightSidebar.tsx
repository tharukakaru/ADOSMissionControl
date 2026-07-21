'use client';

/* eslint-disable react/no-unescaped-entities -- verbatim from uis-master */

import React from 'react';
import { useStore } from '../../context/StoreContext';

export default function RightSidebar() {
  const { nodes, edges, selectedNode, clearSelection, removeNode } = useStore();

  const activeNodes = nodes.filter(n => n.data?.isLive).length;
  
  const selectedInputs = selectedNode ? edges.filter(e => e.target === selectedNode.id).length : 0;
  const selectedOutputs = selectedNode ? edges.filter(e => e.source === selectedNode.id).length : 0;

  return (
    <div className="w-[320px] bg-bg-main border-l border-border-main h-[calc(100vh-60px)] flex flex-col font-orbitron overflow-y-auto custom-scrollbar">
      
      {/* Fabric Overview Section */}
      <div className="p-5 border-b border-border-main">
        <h2 className="text-[10px] text-text-muted uppercase tracking-widest font-semibold mb-4">FABRIC OVERVIEW</h2>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="border border-border-main rounded p-3 flex flex-col">
            <span className="text-2xl font-light text-text-main">{nodes.length}</span>
            <span className="text-[9px] text-text-muted uppercase tracking-widest">NODES</span>
          </div>
          <div className="border border-border-main rounded p-3 flex flex-col">
            <span className="text-2xl font-light text-text-main">{edges.length}</span>
            <span className="text-[9px] text-text-muted uppercase tracking-widest">LINKS</span>
          </div>
          <div className="border border-accent-green/30 bg-accent-green/5 rounded p-3 flex flex-col">
            <span className="text-2xl font-light text-accent-green">{activeNodes}</span>
            <span className="text-[9px] text-text-muted uppercase tracking-widest">POWERED</span>
          </div>
          <div className="border border-border-main rounded p-3 flex flex-col">
            <span className="text-2xl font-light text-text-main">{activeNodes}</span>
            <span className="text-[9px] text-text-muted uppercase tracking-widest">AUTHORISED</span>
          </div>
        </div>

        {/* Chain of Command */}
        <div className="mb-5">
          <h3 className="text-[9px] text-text-muted uppercase tracking-widest mb-2">CHAIN OF COMMAND</h3>
          <div className="border border-border-main rounded p-3 text-[10px] font-mono text-accent-cyan flex flex-col gap-2">
            <div className="flex justify-center border-b border-border-main pb-2">
              OPERATOR→COMMANDER→AUTHORITY
            </div>
            <div className="text-text-muted text-center pt-1">
              CDR. VOSS • ROE-AIR-DEFENSE-07
            </div>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-[10px] text-text-muted leading-relaxed">
          Select Any Node To Inspect Its RBAC Role, Power State, Parameters And Authorisation Gate. Drag From A Node's Right Port To Another Node's Left Port To Wire A New Dataflow. Press <span className="text-accent-yellow font-bold">RUN FLOW</span> To Watch Data Move Through The Fabric, Or Enable The <span className="text-accent-yellow font-bold">Governance Overlay</span> To Colour Every Node By Authorisation Status.
        </p>
      </div>

      {/* Node Inspector Section */}
      <div className="p-5 flex-1 flex flex-col">
        <h2 className="text-[10px] text-text-muted uppercase tracking-widest font-semibold mb-4">NODE INSPECTOR</h2>
        
        {!selectedNode ? (
          <div className="flex-1 flex items-center justify-center text-text-muted text-xs border border-dashed border-border-main rounded p-4 text-center">
            Select a node on the canvas to inspect its properties.
          </div>
        ) : (
          <>
            {/* Node Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded border border-border-main flex items-center justify-center ${selectedNode.data?.colorBgOpacity || 'bg-bg-active'} ${selectedNode.data?.colorText || 'text-text-muted'}`}>
                <span className="text-xs font-bold">{selectedNode.data?.abbreviation || 'ND'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-text-main truncate max-w-[200px]">{selectedNode.data?.label || 'Unknown Node'}</span>
                <span className="text-[10px] text-text-muted truncate max-w-[200px]">{selectedNode.data?.subLabel || 'System'}</span>
              </div>
            </div>

            {/* Status / Power Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="border border-border-main rounded p-3 flex flex-col gap-2">
                <span className="text-[9px] text-text-muted uppercase tracking-widest">STATUS</span>
                <div className="flex items-center gap-1.5 text-xs font-bold text-accent-green">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-green shadow-[0_0_8px_var(--color-accent-green)]"></span>
                  AUTHORISED
                </div>
              </div>
              <div className="border border-border-main rounded p-3 flex flex-col gap-2">
                <span className="text-[9px] text-text-muted uppercase tracking-widest">POWER</span>
                <div className={`text-xs font-bold ${selectedNode.data?.isLive ? 'text-accent-green' : 'text-text-muted'}`}>
                  {selectedNode.data?.isLive ? 'ON' : 'OFF'}
                </div>
              </div>
            </div>

            {/* Parameters */}
            <div className="mb-6">
              <h3 className="text-[9px] text-text-muted uppercase tracking-widest mb-3">PARAMETERS</h3>
              <div className="flex flex-col gap-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">AUTONOMY</span>
                  <span className="text-text-main">IN-LOOP</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">ROLE</span>
                  <span className="text-text-main">Operator</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">AUTH</span>
                  <span className="text-text-main">gated</span>
                </div>
              </div>
            </div>

            {/* Connections */}
            <div className="mb-8">
              <h3 className="text-[9px] text-text-muted uppercase tracking-widest mb-3">CONNECTIONS</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-border-main rounded p-3 flex flex-col">
                  <span className="text-xl font-light text-accent-cyan">{selectedInputs}</span>
                  <span className="text-[9px] text-text-muted uppercase tracking-widest">INPUTS</span>
                </div>
                <div className="border border-border-main rounded p-3 flex flex-col">
                  <span className="text-xl font-light text-accent-yellow">{selectedOutputs}</span>
                  <span className="text-[9px] text-text-muted uppercase tracking-widest">OUTPUTS</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-auto flex flex-col gap-3">
              <button onClick={clearSelection} className="w-full py-2.5 rounded border border-border-main text-xs font-semibold text-text-muted hover:text-text-main hover:bg-bg-active transition-colors flex items-center justify-center gap-2">
                <span className="text-[10px]">✕</span> CLEAR FOCUS
              </button>
              <button onClick={() => removeNode(selectedNode.id)} className="w-full py-2.5 rounded border border-accent-red/30 text-xs font-semibold text-accent-red hover:bg-accent-red/10 transition-colors">
                REMOVE NODE
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
