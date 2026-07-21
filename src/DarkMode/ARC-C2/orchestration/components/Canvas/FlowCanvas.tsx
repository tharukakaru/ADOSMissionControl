'use client';

import React, { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Node
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from './CustomNode';
import { useStore } from '../../context/StoreContext';

const nodeTypes = {
  custom: CustomNode,
};

let idCounter = 100;

export default function FlowCanvas() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode } = useStore();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current) return;

      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) {
        return;
      }
      
      const nodeData = JSON.parse(event.dataTransfer.getData('application/json'));

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      
      // Simple coordinate translation (In a real app, use React Flow's project/screenToFlowPosition)
      // Since we just have fitView, placing it near the center is fine for this demo
      const position = {
        x: event.clientX - reactFlowBounds.left - 50,
        y: event.clientY - reactFlowBounds.top - 20,
      };

      const newNode: Node = {
        id: `node_${idCounter++}`,
        type: 'custom',
        position,
        data: {
          ...nodeData,
          hasInput: true,
          hasOutput: true,
          isLive: true,
        },
      };

      addNode(newNode);
    },
    [addNode]
  );

  return (
    <div className="w-full h-full relative" ref={reactFlowWrapper} onDrop={onDrop} onDragOver={onDragOver} style={{
      background: 'radial-gradient(circle at 80% 20%, rgba(76, 229, 127, 0.08) 0%, transparent 40%), radial-gradient(circle at 20% 60%, rgba(76, 166, 229, 0.05) 0%, transparent 40%), var(--color-bg-main)'
    }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.55 }}
        className="!bg-transparent"
      >
        <Background 
          color="#30363d" 
          gap={24} 
          size={1} 
          variant={'dots' as any}
        />
      </ReactFlow>
    </div>
  );
}
