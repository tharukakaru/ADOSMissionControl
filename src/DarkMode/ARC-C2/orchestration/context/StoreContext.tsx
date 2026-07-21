'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Node, Edge, Connection, addEdge, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange } from '@xyflow/react';

const initialNodes: Node[] = [
  // Faded background nodes
  { id: '1', type: 'custom', position: { x: -300, y: -50 }, data: { label: 'ISR ENDPOINT', subLabel: 'partner feed', abbreviation: 'ISR', colorBg: 'bg-text-muted', colorBgOpacity: 'bg-text-muted/20', colorText: 'text-text-muted', faded: true, hasOutput: true } },
  { id: '2', type: 'custom', position: { x: -300, y: 50 }, data: { label: 'COALITION FEED', subLabel: 'allied C2 share', abbreviation: 'COAL', colorBg: 'bg-text-muted', colorBgOpacity: 'bg-text-muted/20', colorText: 'text-text-muted', faded: true, hasOutput: true } },
  
  // Middle ring nodes
  { id: '3', type: 'custom', position: { x: 0, y: -100 }, data: { label: 'HUMAN TEAMS', subLabel: 'ground / special ops', abbreviation: 'TEAM', colorBg: 'bg-accent-cyan', colorBgOpacity: 'bg-accent-cyan/20', colorText: 'text-accent-cyan', isLive: true, hasInput: true, hasOutput: true } },
  { id: '4', type: 'custom', position: { x: 0, y: 150 }, data: { label: 'DATA MIGRATION', subLabel: 'ETL - internal', abbreviation: 'ETL', colorBg: 'bg-accent-green', colorBgOpacity: 'bg-accent-green/20', colorText: 'text-accent-green', hasInput: true, hasOutput: true } },
  
  // Core AI Nodes
  { id: '5', type: 'custom', position: { x: 250, y: -100 }, data: { label: 'OPERATOR', subLabel: 'console - primary', abbreviation: 'OPR', colorBg: 'bg-accent-cyan', colorBgOpacity: 'bg-accent-cyan/20', colorText: 'text-accent-cyan', isLive: true, hasInput: true, hasOutput: true } },
  { id: '6', type: 'custom', position: { x: 250, y: 50 }, data: { label: 'INTELLIGENT DATA...', subLabel: 'fusion blackboard', abbreviation: 'BUS', colorBg: 'bg-text-muted', colorBgOpacity: 'bg-text-muted/20', colorText: 'text-text-muted', hasInput: true, hasOutput: true } },
  { id: '7', type: 'custom', position: { x: 250, y: 150 }, data: { label: 'RAG ANALYSIS', subLabel: 'custom intel', abbreviation: 'RAG', colorBg: 'bg-accent-purple', colorBgOpacity: 'bg-accent-purple/20', colorText: 'text-accent-purple', isLive: true, hasInput: true, hasOutput: true } },
  
  // Agents
  { id: '8', type: 'custom', position: { x: 500, y: 100 }, data: { label: 'PERCEPTION AGENT', subLabel: 'fusion - classify', abbreviation: 'PRC', colorBg: 'bg-accent-yellow', colorBgOpacity: 'bg-accent-yellow/20', colorText: 'text-accent-yellow', isLive: true, hasInput: true, hasOutput: true } },
  { id: '9', type: 'custom', position: { x: 500, y: 200 }, data: { label: 'DECISION AGENT', subLabel: 'COA generation', abbreviation: 'DEC', colorBg: 'bg-accent-yellow', colorBgOpacity: 'bg-accent-yellow/20', colorText: 'text-accent-yellow', isLive: true, hasInput: true, hasOutput: true } },
  
  // Central System
  { id: '10', type: 'custom', position: { x: 800, y: -150 }, data: { large: true, hasInput: true, hasOutput: true } },
  { id: '11', type: 'custom', position: { x: 800, y: -50 }, data: { label: 'RBAC - PERMISSIONS', subLabel: 'access control', abbreviation: 'RBAC', colorBg: 'bg-accent-red', colorBgOpacity: 'bg-accent-red/20', colorText: 'text-accent-red', isLive: true, hasInput: true, hasOutput: true } },
  { id: '12', type: 'custom', position: { x: 800, y: 50 }, data: { label: 'AUTHORISATION GATE', subLabel: 'human gate - ROE-07', abbreviation: 'GATE', colorBg: 'bg-accent-red', colorBgOpacity: 'bg-accent-red/20', colorText: 'text-accent-red', isLive: true, hasInput: true, hasOutput: true } },
  { id: '13', type: 'custom', position: { x: 800, y: 150 }, data: { label: 'ARC C2 - BATTLE MGMT', subLabel: 'fused C2 core', abbreviation: 'C2', colorBg: 'bg-text-muted', colorBgOpacity: 'bg-text-muted/20', colorText: 'text-text-muted', isLive: true, glow: true, hasInput: true, hasOutput: true } },
  { id: '14', type: 'custom', position: { x: 800, y: 250 }, data: { label: 'COMMON OP PICTURE', subLabel: 'single air picture', abbreviation: 'COP', colorBg: 'bg-text-muted', colorBgOpacity: 'bg-text-muted/20', colorText: 'text-text-muted', isLive: true, hasInput: true, hasOutput: true } },
  { id: '15', type: 'custom', position: { x: 800, y: 350 }, data: { label: 'COA / DECIDE ENGI...', subLabel: 'recommend - approve', abbreviation: 'COA', colorBg: 'bg-text-muted', colorBgOpacity: 'bg-text-muted/20', colorText: 'text-text-muted', isLive: true, hasInput: true, hasOutput: true } },

  // Right Side Output
  { id: '16', type: 'custom', position: { x: 1100, y: 50 }, data: { label: 'AUDIT LEDGER', subLabel: 'tamper-evident', abbreviation: 'AUD', colorBg: 'bg-accent-red', colorBgOpacity: 'bg-accent-red/20', colorText: 'text-accent-red', isLive: true, hasInput: true } },
  { id: '17', type: 'custom', position: { x: 1100, y: 150 }, data: { label: 'HYENA - AUTO PILOT', subLabel: 'MEDUSA X UAV', abbreviation: 'HY', colorBg: 'bg-text-muted', colorBgOpacity: 'bg-text-muted/20', colorText: 'text-text-muted', isLive: true, hasInput: true } },
  { id: '18', type: 'custom', position: { x: 1100, y: 250 }, data: { label: 'SENTINEL - C-UAS', subLabel: 'air surveillance', abbreviation: 'SEN', colorBg: 'bg-text-muted', colorBgOpacity: 'bg-text-muted/20', colorText: 'text-text-muted', isLive: true, hasInput: true } },
];

const initialEdges: Edge[] = [
  { id: 'e1', source: '5', target: '10', animated: true, style: { stroke: '#4CE57F', strokeWidth: 1.5 } },
  { id: 'e2', source: '5', target: '11', style: { stroke: '#1f2532', strokeWidth: 1.5 } },
  { id: 'e3', source: '8', target: '13', animated: true, style: { stroke: '#F2E74B', strokeWidth: 1.5 } },
  { id: 'e4', source: '9', target: '13', animated: true, style: { stroke: '#F2E74B', strokeWidth: 1.5 } },
  { id: 'e5', source: '12', target: '16', style: { stroke: '#E54C4C', strokeWidth: 1.5 } },
  { id: 'e6', source: '13', target: '16', style: { stroke: '#1f2532', strokeWidth: 1.5, strokeDasharray: '4 4' } },
  { id: 'e7', source: '13', target: '17', animated: true, style: { stroke: '#4CA6E5', strokeWidth: 1.5 } },
  { id: 'e8', source: '13', target: '18', animated: true, style: { stroke: '#4CE57F', strokeWidth: 1.5 } },
];

type StoreContextType = {
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  isFlowRunning: boolean;
  isGovernanceOverlay: boolean;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (node: Node) => void;
  removeNode: (nodeId: string) => void;
  clearSelection: () => void;
  toggleFlowRunning: () => void;
  toggleGovernanceOverlay: () => void;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [isFlowRunning, setIsFlowRunning] = useState(false);
  const [isGovernanceOverlay, setIsGovernanceOverlay] = useState(false);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge({ ...connection, animated: isFlowRunning, style: { stroke: '#4CE57F', strokeWidth: 1.5 } }, eds)),
    [isFlowRunning]
  );

  const addNode = useCallback((node: Node) => {
    setNodes((nds) => nds.concat(node));
  }, []);

  const removeNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
  }, []);

  const clearSelection = useCallback(() => {
    setNodes((nds) => nds.map((n) => ({ ...n, selected: false })));
  }, []);

  const toggleFlowRunning = useCallback(() => {
    setIsFlowRunning((prev) => !prev);
    // When flow is running, make all edges animated
    setEdges((eds) => eds.map(e => ({ ...e, animated: !isFlowRunning })));
  }, [isFlowRunning]);

  const toggleGovernanceOverlay = useCallback(() => {
    setIsGovernanceOverlay((prev) => !prev);
    // When overlay is active, colour nodes by simulated auth status (just visual)
    setNodes((nds) => nds.map(n => {
      if (!n.data) return n;
      return {
        ...n,
        data: {
          ...n.data,
          glow: !isGovernanceOverlay, // Simulate everything glowing for demo
        }
      };
    }));
  }, [isGovernanceOverlay]);

  const selectedNode = nodes.find(n => n.selected) || null;

  return (
    <StoreContext.Provider value={{
      nodes,
      edges,
      selectedNode,
      isFlowRunning,
      isGovernanceOverlay,
      onNodesChange,
      onEdgesChange,
      onConnect,
      addNode,
      removeNode,
      clearSelection,
      toggleFlowRunning,
      toggleGovernanceOverlay
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
