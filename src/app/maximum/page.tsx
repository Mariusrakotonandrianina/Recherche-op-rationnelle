"use client";

import React, { useState, useEffect } from "react";
import Graph from "../components/Graph";
import NodeFormModal from "../components/NodeFormModal";
import EdgeFormModal from "../components/EdgeFormModal";
import MaxMatrixTable from "../components/MaxMatrixTable";
import { Node, Edge } from "reactflow";
import { FaCircle, FaArrowRight, FaTrash } from "react-icons/fa";

export default function Page() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isNodeModalOpen, setIsNodeModalOpen] = useState(false);
  const [isEdgeModalOpen, setIsEdgeModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    const savedNodes = localStorage.getItem("graphNodes");
    const savedEdges = localStorage.getItem("graphEdges");
    if (savedNodes) setNodes(JSON.parse(savedNodes));
    if (savedEdges) setEdges(JSON.parse(savedEdges));
  }, []);

  useEffect(() => {
    localStorage.setItem("graphNodes", JSON.stringify(nodes));
  }, [nodes]);

  useEffect(() => {
    localStorage.setItem("graphEdges", JSON.stringify(edges));
  }, [edges]);

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

  const confirmClearData = () => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setSelectedEdge(null);
    localStorage.removeItem("graphNodes");
    localStorage.removeItem("graphEdges");
    setIsConfirmModalOpen(false);
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
          <button
            onClick={() => setIsConfirmModalOpen(true)}
            className="flex items-center gap-2 bg-red-400 text-white py-1.5 px-2 rounded-lg shadow-md hover:bg-red-500 transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 w-40 whitespace-nowrap"
          >
            <FaTrash className="text-sm" />
            Vider les données
          </button>
          <MaxMatrixTable nodes={nodes} edges={edges} />
        </div>
      </div>

      {isConfirmModalOpen && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Confirmer la suppression</h2>
            <p className="text-gray-700 mb-4">
              Voulez-vous vraiment vider toutes les données ? Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmClearData}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

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