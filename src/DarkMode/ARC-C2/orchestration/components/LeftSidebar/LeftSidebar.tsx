import React from 'react';
import { 
  Globe, 
  Crosshair, 
  Shield, 
  Users, 
  User,
  Clock, 
  Bookmark,
  Search,
  ChevronDown,
  Settings
} from 'lucide-react';
import IconSidebar from '../IconSidebar/IconSidebar';

// --- Define Node Data ---
const humanCommandNodes = [
  { abbreviation: 'OPR', label: 'Operator', subLabel: 'human console', colorBg: 'bg-accent-cyan', colorBgOpacity: 'bg-accent-cyan/20', colorText: 'text-accent-cyan' },
  { abbreviation: 'CMD', label: 'Commander', subLabel: 'ROE authority', colorBg: 'bg-accent-cyan', colorBgOpacity: 'bg-accent-cyan/20', colorText: 'text-accent-cyan' },
  { abbreviation: 'AUTH', label: 'Release Authority', subLabel: 'CDR - gate', colorBg: 'bg-accent-cyan', colorBgOpacity: 'bg-accent-cyan/20', colorText: 'text-accent-cyan' },
];

const soulAiNodes = [
  { abbreviation: 'SOUL', label: 'SOUL Agent', subLabel: 'multi-agent', colorBg: 'bg-accent-yellow', colorBgOpacity: 'bg-accent-yellow/20', colorText: 'text-accent-yellow' },
  { abbreviation: 'DEC', label: 'Decision Agent', subLabel: 'COA engine', colorBg: 'bg-accent-yellow', colorBgOpacity: 'bg-accent-yellow/20', colorText: 'text-accent-yellow' },
  { abbreviation: 'RTA', label: 'Safety / RTA', subLabel: 'envelope guard', colorBg: 'bg-accent-yellow', colorBgOpacity: 'bg-accent-yellow/20', colorText: 'text-accent-yellow' },
];

const llmNodes = [
  { abbreviation: 'LLM', label: 'LLM Reasoning', subLabel: 'chat - intent', colorBg: 'bg-accent-purple', colorBgOpacity: 'bg-accent-purple/20', colorText: 'text-accent-purple' },
  { abbreviation: 'RAG', label: 'RAG Analysis', subLabel: 'custom intel', colorBg: 'bg-accent-purple', colorBgOpacity: 'bg-accent-purple/20', colorText: 'text-accent-purple' },
];

const aiModelNodes = [
  { abbreviation: 'CV', label: 'Computer Vision', subLabel: 'detect/track', colorBg: 'bg-accent-blue', colorBgOpacity: 'bg-accent-blue/20', colorText: 'text-accent-blue' },
  { abbreviation: 'SIM', label: 'Simulation', subLabel: 'digital twin', colorBg: 'bg-accent-blue', colorBgOpacity: 'bg-accent-blue/20', colorText: 'text-accent-blue' },
];

const arcOsNodes = [
  { abbreviation: 'C2', label: 'ARC C2 Core', subLabel: 'battle mgmt', colorBg: 'bg-text-muted', colorBgOpacity: 'bg-text-muted/20', colorText: 'text-text-muted' },
  { abbreviation: 'HY', label: 'HYENA', subLabel: 'autonomous pilot', colorBg: 'bg-text-muted', colorBgOpacity: 'bg-text-muted/20', colorText: 'text-text-muted' },
  { abbreviation: 'SEN', label: 'SENTINEL', subLabel: 'counter-UAS', colorBg: 'bg-text-muted', colorBgOpacity: 'bg-text-muted/20', colorText: 'text-text-muted' },
];

const dataNodes = [
  { abbreviation: 'SRC', label: 'Data Source', subLabel: 'live feed', colorBg: 'bg-accent-green', colorBgOpacity: 'bg-accent-green/20', colorText: 'text-accent-green' },
  { abbreviation: 'SAT', label: 'SAT / SATCOM', subLabel: 'BLOS link', colorBg: 'bg-accent-green', colorBgOpacity: 'bg-accent-green/20', colorText: 'text-accent-green' },
  { abbreviation: 'DB', label: 'Database', subLabel: 'full history', colorBg: 'bg-accent-green', colorBgOpacity: 'bg-accent-green/20', colorText: 'text-accent-green' },
];

const DraggableNode = ({ node }: { node: any }) => {
  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData('application/reactflow', 'custom');
    event.dataTransfer.setData('application/json', JSON.stringify(node));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div 
      onDragStart={onDragStart}
      draggable
      className="flex items-center gap-3 p-2 border border-transparent hover:bg-bg-active hover:border-border-main rounded cursor-grab active:cursor-grabbing transition-colors"
    >
      <div className={`${node.colorBgOpacity} ${node.colorText} text-[10px] font-bold px-1.5 py-0.5 rounded`}>{node.abbreviation}</div>
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-text-main">{node.label}</span>
        <span className="text-[10px] text-text-muted">{node.subLabel}</span>
      </div>
    </div>
  );
};

export default function LeftSidebar() {
  return (
    <div className="flex h-[calc(100vh-60px)] font-orbitron">
      {/* Thin Icon Sidebar */}
      <IconSidebar />

      {/* Main Node Library Panel */}
      <div className="w-[300px] bg-bg-main border-r border-border-main flex flex-col">
        <div className="p-4 border-b border-border-main">
          <h2 className="text-[10px] text-text-muted uppercase tracking-widest font-semibold mb-3">NODE LIBRARY</h2>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search nodes..." 
              className="w-full bg-bg-active border border-border-main rounded text-sm py-1.5 pl-9 pr-3 text-text-main placeholder:text-text-muted focus:outline-none focus:border-accent-cyan"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
          
          {/* Category: HUMAN COMMAND */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-accent-cyan rounded-sm"></span>
              <span className="text-[10px] text-text-muted uppercase tracking-widest font-semibold flex-1">HUMAN COMMAND</span>
              <ChevronDown size={14} className="text-text-muted" />
            </div>
            <div className="flex flex-col gap-1 ml-4">
              {humanCommandNodes.map((n, i) => <DraggableNode key={i} node={n} />)}
            </div>
          </div>

          {/* Category: SOUL AI AGENTS */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-accent-yellow rounded-sm"></span>
              <span className="text-[10px] text-text-muted uppercase tracking-widest font-semibold flex-1">SOUL AI AGENTS</span>
              <ChevronDown size={14} className="text-text-muted" />
            </div>
            <div className="flex flex-col gap-1 ml-4">
              {soulAiNodes.map((n, i) => <DraggableNode key={i} node={n} />)}
            </div>
          </div>

          {/* Category: LLM - RAG */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-accent-purple rounded-sm"></span>
              <span className="text-[10px] text-text-muted uppercase tracking-widest font-semibold flex-1">LLM - RAG</span>
              <ChevronDown size={14} className="text-text-muted" />
            </div>
            <div className="flex flex-col gap-1 ml-4">
              {llmNodes.map((n, i) => <DraggableNode key={i} node={n} />)}
            </div>
          </div>

          {/* Category: AI MODELS */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-accent-blue rounded-sm"></span>
              <span className="text-[10px] text-text-muted uppercase tracking-widest font-semibold flex-1">AI MODELS</span>
              <ChevronDown size={14} className="text-text-muted" />
            </div>
            <div className="flex flex-col gap-1 ml-4">
              {aiModelNodes.map((n, i) => <DraggableNode key={i} node={n} />)}
            </div>
          </div>

          {/* Category: ARC OS SYSTEMS */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-text-muted rounded-sm"></span>
              <span className="text-[10px] text-text-muted uppercase tracking-widest font-semibold flex-1">ARC OS SYSTEMS</span>
              <ChevronDown size={14} className="text-text-muted" />
            </div>
            <div className="flex flex-col gap-1 ml-4">
              {arcOsNodes.map((n, i) => <DraggableNode key={i} node={n} />)}
            </div>
          </div>
          
          {/* Category: DATA - SATCOM - GATEWAY */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-accent-green rounded-sm"></span>
              <span className="text-[10px] text-text-muted uppercase tracking-widest font-semibold flex-1">DATA - SATCOM - GATEWAY</span>
              <ChevronDown size={14} className="text-text-muted" />
            </div>
            <div className="flex flex-col gap-1 ml-4">
              {dataNodes.map((n, i) => <DraggableNode key={i} node={n} />)}
            </div>
          </div>
          
        </div>

        {/* Bottom Autonomy Control */}
        <div className="p-4 border-t border-border-main bg-bg-main">
          <div className="flex items-center gap-2 text-[10px] text-accent-yellow tracking-widest uppercase font-semibold mb-3">
            <Settings size={12} /> LEVEL OF AUTONOMY
          </div>
          <div className="flex text-[10px] font-semibold text-text-muted">
            <button className="flex-1 flex flex-col items-center justify-center gap-1 py-2 border-b-2 border-accent-yellow text-accent-yellow">
              <User size={14} /> IN-LOOP
            </button>
            <button className="flex-1 flex flex-col items-center justify-center gap-1 py-2 border-b-2 border-transparent hover:text-text-main">
              <Clock size={14} /> ON-LOOP
            </button>
            <button className="flex-1 flex flex-col items-center justify-center gap-1 py-2 border-b-2 border-transparent hover:text-text-main">
              <Shield size={14} /> SUPERVISED
            </button>
          </div>
          <div className="text-[9px] text-text-muted mt-3">
            AI proposes; a human must approve every action.
          </div>
        </div>

      </div>
    </div>
  );
}
