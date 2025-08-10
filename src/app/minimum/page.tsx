"use client";

import React, { useState, useMemo, useCallback } from "react";
import Graph from "../components/Graph";
import GraphFormModal from "../components/GraphFormModal";
import MinMatrixTable from "../components/MinMatrixTable";
import { FaCircle, FaArrowRight, FaTrash } from "react-icons/fa";
import { useGraphStorage } from "../hooks/useGraphStorage";

interface Node {
  id: string;
  label?: string;
}

interface Edge {
  id?: string;
  source: string;
  target: string;
  label?: string;
}

export default function Page() {

  const { nodes, setNodes, edges, setEdges } = useGraphStorage();

  const [showSolution, setShowSolution] = useState(false);

  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isGraphModalOpen, setIsGraphModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"node" | "edge">("node");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [finalMatrix, setFinalMatrix] = useState<(number | string)[][]>([]);
  const [solutionEdges, setSolutionEdges] = useState<{ source: string; target: string }[]>([]);
  const [changedCells, setChangedCells] = useState<Set<string>>(new Set());
  const [, setCurrentMatrix] = useState<(number | string)[][]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const memoizedNodes = useMemo(() => nodes, [nodes]);
  const memoizedEdges = useMemo(() => edges, [edges]);


  const handleEdgeSelect = useCallback((edge: Edge) => {
    console.log("Page - handleEdgeSelect:", edge);
    setSelectedEdge(edge);
    setSelectedNode(null);
    setModalMode("edge");
    setIsGraphModalOpen(true);
  }, []);

  const handleNodeSelect = useCallback((node: Node) => {
    console.log("Page - handleNodeSelect:", node);
    setSelectedNode(node);
    setSelectedEdge(null);
    setModalMode("node");
    setIsGraphModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    console.log("Page - Closing modal");
    setIsGraphModalOpen(false);
    setSelectedNode(null);
    setSelectedEdge(null);
    setModalMode("node");
  }, []);

  const confirmClearData = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setSelectedEdge(null);
    setFinalMatrix([]);
    setSolutionEdges([]);
    setChangedCells(new Set());
    setCurrentStep(0);
    setShowSolution(false);
    localStorage.removeItem("graphNodes");
    localStorage.removeItem("graphEdges");
    setIsConfirmModalOpen(false);
  }, []);

  const handleFinalValuesCalculated = useCallback(
    (matrix: (number | string)[][], solEdges: { source: string; target: string }[]) => {
      console.log("Final values calculated - Matrix:", matrix, "Solution Edges:", solEdges);
      setFinalMatrix(matrix);
      setSolutionEdges(solEdges);
    },
    []
  );

  const handleStepChange = useCallback(
    (
      step: number,
      cells: Set<string>,
      matrix: (number | string)[][],
      currentStep: number,
      showSolution?: boolean
    ) => {
      setChangedCells(cells);
      setCurrentMatrix(matrix);
      setCurrentStep(step);
      if (showSolution !== undefined) {
        setShowSolution(showSolution);
      }
    },
    []
  );

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-br bg-gray-100 p-2 mt-10 mb-5">
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-7xl">
        <Graph
          nodes={memoizedNodes}
          edges={memoizedEdges}
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
        <div className="w-full lg:w-1/2 flex flex-col gap-3">
          <button
            onClick={() => {
              setModalMode("node");
              setSelectedNode(null);
              setSelectedEdge(null);
              setIsGraphModalOpen(true);
            }}
            className="flex items-center gap-2 bg-blue-500 text-white py-1.5 px-2 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-40 whitespace-nowrap"
            aria-label="Gérer les sommets du graphe"
          >
            <FaCircle className="text-sm" />
            Gérer les sommets
          </button>
          <button
            onClick={() => {
              setModalMode("edge");
              setSelectedNode(null);
              setSelectedEdge(null);
              setIsGraphModalOpen(true);
            }}
            className="flex items-center gap-2 bg-blue-500 text-white py-1.5 px-2 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-40 whitespace-nowrap"
            aria-label="Gérer les arêtes du graphe"
          >
            <FaArrowRight className="text-sm" />
            Gérer les arêtes
          </button>
          <button
            onClick={() => setIsConfirmModalOpen(true)}
            className="flex items-center gap-2 bg-red-400 text-white py-1.5 px-2 rounded-lg shadow-md hover:bg-red-500 transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 w-40 whitespace-nowrap"
            aria-label="Vider toutes les données"
          >
            <FaTrash className="text-sm" />
            Vider les données
          </button>
          <MinMatrixTable
            nodes={memoizedNodes}
            edges={memoizedEdges}
            onFinalValuesCalculated={handleFinalValuesCalculated}
            onStepChange={handleStepChange}
          />
        </div>
      </div>

      {isConfirmModalOpen && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Confirmer la suppression</h2>
            <p className="text-gray-700 mb-4">
              Voulez-vous vraiment vider toutes les données ? Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                aria-label="Annuler la suppression"
              >
                Annuler
              </button>
              <button
                onClick={confirmClearData}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                aria-label="Confirmer la suppression"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      <GraphFormModal
        isOpen={isGraphModalOpen}
        onClose={handleCloseModal}
        initialMode={modalMode}
        nodes={memoizedNodes}
        edges={memoizedEdges}
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
