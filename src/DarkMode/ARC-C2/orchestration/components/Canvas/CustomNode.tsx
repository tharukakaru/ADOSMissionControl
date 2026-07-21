import React from 'react';
import { Handle, Position } from '@xyflow/react';

export default function CustomNode({ data, selected }: { data: any, selected: boolean }) {
  const isLarge = data.large;
  
  if (isLarge) {
    return (
      <div className={`relative flex items-center bg-bg-main border ${selected ? 'border-text-main shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'border-border-main'} rounded-lg px-8 py-5 min-w-[300px]`}>
        {data.hasInput && <Handle type="target" position={Position.Left} className="!bg-text-main !border-0 !w-2 !h-2 !-ml-1" />}
        <div className="flex items-center gap-5 w-full">
           <div className="bg-text-main/10 text-text-main text-sm font-bold px-2 py-1 rounded">OS</div>
           <div className="flex flex-col">
             <span className="text-2xl font-orbitron tracking-[0.2em] text-text-main font-bold">ARC OS</span>
             <span className="text-xs text-text-muted">agentic warfare platform</span>
           </div>
        </div>
        <div className="absolute bottom-2 left-6 flex items-center gap-1.5">
           <span className="w-1.5 h-1.5 rounded-full bg-accent-green shadow-[0_0_8px_var(--color-accent-green)]"></span>
           <span className="text-[8px] text-accent-green font-bold tracking-widest uppercase">LIVE</span>
        </div>
        {data.hasOutput && <Handle type="source" position={Position.Right} className="!bg-text-main !border-0 !w-2 !h-2 !-mr-1" />}
      </div>
    );
  }

  const isFaded = data.faded;
  
  return (
    <div className={`relative flex items-center bg-bg-panel border ${selected || data.glow ? 'border-text-main shadow-[0_0_10px_rgba(255,255,255,0.15)]' : 'border-border-main'} rounded px-4 py-3 min-w-[200px] hover:border-text-muted transition-colors ${isFaded ? 'opacity-30' : 'opacity-100'}`}>
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${data.colorBg} rounded-l`}></div>
      {data.hasInput && <Handle type="target" position={Position.Left} className="!bg-text-muted !border-0 !w-1.5 !h-1.5 !-ml-0.5" />}
      
      <div className="flex items-center gap-3 w-full ml-2">
        <div className={`${data.colorBgOpacity} ${data.colorText} text-[9px] font-bold px-1.5 py-0.5 rounded`}>
          {data.abbreviation}
        </div>
        <div className="flex flex-col">
          <span className={`text-xs font-semibold ${selected || data.glow ? 'text-text-main' : 'text-gray-200'}`}>{data.label}</span>
          <span className="text-[9px] text-text-muted">{data.subLabel}</span>
        </div>
      </div>
      
      {data.isLive && (
        <div className="absolute bottom-1 left-5 flex items-center gap-1">
           <span className="w-1 h-1 rounded-full bg-accent-green shadow-[0_0_6px_var(--color-accent-green)]"></span>
           <span className="text-[7px] text-accent-green font-bold tracking-widest uppercase">LIVE</span>
        </div>
      )}
      
      {data.hasOutput && <Handle type="source" position={Position.Right} className="!bg-text-muted !border-0 !w-1.5 !h-1.5 !-mr-0.5" />}
    </div>
  );
}
