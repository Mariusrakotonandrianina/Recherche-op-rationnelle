"use client";

import React, { useState, useCallback, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  MarkerType,
  applyNodeChanges,
  applyEdgeChanges,
  Edge,
  Node,
  NodeChange,
  EdgeChange,
} from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";

// Style amélioré pour les nœuds
const nodeStyle = {
  borderRadius: "50%",
  width: 60,
  height: 60,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: "5px 5px 15px rgba(0,0,0,0.3)",
  fontWeight: "bold",
  fontSize: "14px",
  color: "#000",
  border: "3px solid #555",
  background: "rgba(128, 128, 128, 0.5)", // Gris transparent
};

// Appliquer le layout avec dagre
const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: "LR" });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 60, height: 60 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - 30,
        y: nodeWithPosition.y - 30,
      },
      style: nodeStyle, // Appliquer le style amélioré aux nœuds
    };
  });
};

interface GraphProps {
  nodes: Node[];
  edges: Edge[];
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  onEdgeSelect: (edge: Edge) => void;
  onNodeSelect: (node: Node) => void;
}

export default function Graph({ nodes, edges, setNodes, setEdges, onEdgeSelect, onNodeSelect }: GraphProps) {
  const onNodesChange = useCallback((changes: NodeChange[]) => setNodes(applyNodeChanges(changes, nodes)), [nodes, setNodes]);
  const onEdgesChange = useCallback((changes: EdgeChange[]) => setEdges(applyEdgeChanges(changes, edges)), [edges, setEdges]);
  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => onEdgeSelect(edge), [onEdgeSelect]);
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => onNodeSelect(node), [onNodeSelect]);

  useEffect(() => {
    setNodes(getLayoutedElements(nodes, edges));
  }, [nodes.length, edges.length, setNodes]);

  return (
    <div className="flex-1 h-[600px] bg-white border-2 border-gray-300 rounded-lg shadow-lg p-4">
      <ReactFlow
        nodes={nodes}
        edges={edges.map(edge => ({
          ...edge,
          style: { strokeWidth: 2, stroke: "#222" }, // Noir foncé pour les arêtes
          markerEnd: { type: MarkerType.ArrowClosed, color: "#222" }, // Flèche noire foncée
        }))}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onEdgeClick={onEdgeClick}
        onNodeClick={onNodeClick}
      >
        <Background gap={12} size={1} color="#e5e7eb" />
        <MiniMap nodeColor={() => "rgba(128, 128, 128, 0.5)"} className="border border-gray-200 rounded-md" />
        <Controls className="bg-white shadow-md rounded-md" />
      </ReactFlow>
    </div>
  );
}
