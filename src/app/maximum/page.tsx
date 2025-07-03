"use client";

import React, { useState, useEffect, useCallback } from "react";
import Graph from "../components/MaxGraph";
import FormModal from "../components/FormModal";
import DemoucronMaxMatrixTable from "../components/MaxMatrixTable";
import { FaCircle, FaArrowRight, FaTrash } from "react-icons/fa";
import { useGraphStorage } from "../hooks/useGraphStorage";

interface Node {
  id: string;
  label?: string;
  x?: number;
  y?: number;
}

interface Edge {
  id?: string;
  source: string;
  target: string;
  label?: string;
}

export default function Page() {

  const { nodes, setNodes, edges, setEdges } = useGraphStorage();


  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"node" | "edge">("node");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [finalMatrix, setFinalMatrix] = useState<(number | string)[][]>([]);
  const [solutionEdges, setSolutionEdges] = useState<{ source: string; target: string }[]>([]);
  const [changedCells, setChangedCells] = useState<Set<string>>(new Set());
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showSolution, setShowSolution] = useState<boolean>(false);


  const handleEdgeSelect = useCallback((edge: Edge) => {
    setSelectedEdge(edge);
    setSelectedNode(null);
    setModalMode("edge");
    setIsFormModalOpen(true);
  }, []);

  const handleNodeSelect = useCallback((node: Node) => {
    setSelectedNode(node);
    setSelectedEdge(null);
    setModalMode("node");
    setIsFormModalOpen(true);
  }, []);

  const confirmClearData = () => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setSelectedEdge(null);
    setFinalMatrix([]);
    setSolutionEdges([]);
    setChangedCells(new Set());
    setCurrentStep(0);
    setShowSolution(false);
    try {
      localStorage.removeItem("graphNodes");
      localStorage.removeItem("graphEdges");
    } catch (error) {
      console.error("Erreur lors de la suppression de localStorage:", error);
    }
    setIsConfirmModalOpen(false);
  };

  const handleCloseModal = useCallback(() => {
    setIsFormModalOpen(false);
    setSelectedNode(null);
    setSelectedEdge(null);
    setModalMode("node");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-br bg-gray-100 p-4 mt-10 mb-5">
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-7xl">
        <Graph
          nodes={nodes}
          edges={edges}
          setNodes={setNodes}
          setEdges={setEdges}
          onEdgeSelect={handleEdgeSelect}
          onNodeSelect={handleNodeSelect}
          finalMatrix={finalMatrix}
          solutionEdges={solutionEdges}
          changedCells={changedCells}
          currentStep={currentStep}
          showSolution={showSolution}
        />
        <div className="w-full lg:w-1/3 flex flex-col gap-3">
          <button
            onClick={() => {
              setModalMode("node");
              setIsFormModalOpen(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white py-1.5 px-2 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-40 whitespace-nowrap"
          >
            <FaCircle className="text-sm" />
            Gérer les sommets
          </button>
          <button
            onClick={() => {
              setModalMode("edge");
              setIsFormModalOpen(true);
            }}
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
          <DemoucronMaxMatrixTable
            nodes={nodes}
            edges={edges}
            currentStep={currentStep}
            onFinalValuesCalculated={(matrix, edges) => {
              setFinalMatrix(matrix);
              setSolutionEdges(edges);
            }}
            onStepChange={(step, changedCells, currentMatrix, newStep, showSolution) => {
              setChangedCells(changedCells);
              setCurrentStep(newStep);
              setShowSolution(showSolution || false);
            }}
          />
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

      <FormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseModal}
        initialMode={modalMode}
        nodes={nodes}
        edges={edges}
        setNodes={setNodes}
        setEdges={setEdges}
        selectedNode={selectedNode}
        setSelectedNode={setSelectedNode}
        selectedEdge={selectedEdge}
        setSelectedEdge={setSelectedEdge}
      />
    </div>
  );
}