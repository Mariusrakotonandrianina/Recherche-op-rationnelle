"use client";

import React, { useState } from "react";
import Graph from "../components/Graph";
import NodeFormModal from "../components/NodeFormModal";
import EdgeFormModal from "../components/EdgeFormModal";
import { Node, Edge } from "reactflow";
import { FaCircle, FaArrowRight } from "react-icons/fa";

export default function Page() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isNodeModalOpen, setIsNodeModalOpen] = useState(false);
  const [isEdgeModalOpen, setIsEdgeModalOpen] = useState(false);

  const handleEdgeSelect = (edge: Edge) => {
    setSelectedEdge(edge);
    setSelectedNode(null);
    setIsEdgeModalOpen(true);
  };

  const handleNodeSelect = (node: Node) => {
    setSelectedNode(node);
    setSelectedEdge(null);
    setIsNodeModalOpen(true);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-7xl">
        <Graph
          nodes={nodes}
          edges={edges}
          setNodes={setNodes}
          setEdges={setEdges}
          onEdgeSelect={handleEdgeSelect}
          onNodeSelect={handleNodeSelect}
        />
        <div className="w-full lg:w-1/3 flex flex-col gap-3">
          <button
            onClick={() => setIsNodeModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white py-1.5 px-2 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-40 whitespace-nowrap"
          >
            <FaCircle className="text-sm" />
            Gérer les sommets
          </button>
          <button
            onClick={() => setIsEdgeModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white py-1.5 px-2 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-40 whitespace-nowrap"
          >
            <FaArrowRight className="text-sm" />
            Gérer les arêtes
          </button>
        </div>
      </div>

      <NodeFormModal
        isOpen={isNodeModalOpen}
        onClose={() => setIsNodeModalOpen(false)}
        nodes={nodes}
        edges={edges}
        setNodes={setNodes}
        setEdges={setEdges}
        selectedNode={selectedNode}
        setSelectedNode={setSelectedNode}
      />
      <EdgeFormModal
        isOpen={isEdgeModalOpen}
        onClose={() => setIsEdgeModalOpen(false)}
        nodes={nodes}
        edges={edges}
        setEdges={setEdges}
        selectedEdge={selectedEdge}
        setSelectedEdge={setSelectedEdge}
      />
    </div>
  );
}