"use client";

import React, { useState } from "react";
import { Edge, MarkerType, Node } from "reactflow";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";

interface EdgeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: Node[];
  edges: Edge[];
  setEdges: (edges: Edge[]) => void;
  selectedEdge: Edge | null;
  setSelectedEdge: (edge: Edge | null) => void;
}

export default function EdgeFormModal({
  isOpen,
  onClose,
  nodes,
  edges,
  setEdges,
  selectedEdge,
  setSelectedEdge,
}: EdgeFormModalProps) {
  const [sourceNode, setSourceNode] = useState("");
  const [targetNode, setTargetNode] = useState("");
  const [edgeLabel, setEdgeLabel] = useState("");
  const [editEdgeLabel, setEditEdgeLabel] = useState(selectedEdge?.label as string || "");
  const [error, setError] = useState<string | null>(null);

  const validateInputs = () => {
    if (!sourceNode || !targetNode || !edgeLabel) {
      setError("Tous les champs doivent être remplis.");
      return false;
    }
    if (!nodes.find((node) => node.id === sourceNode) || !nodes.find((node) => node.id === targetNode)) {
      setError("Les sommets spécifiés n'existent pas !");
      return false;
    }
    if (edges.some((edge) => edge.source === sourceNode && edge.target === targetNode)) {
      setError("Une arête entre ces nœuds existe déjà.");
      return false;
    }
    if (isNaN(Number(edgeLabel))) {
      setError("Le poids de l'arête doit être un nombre.");
      return false;
    }
    return true;
  };

  const addEdge = () => {
    setError(null);
    if (!validateInputs()) return;

    const newEdge: Edge = {
      id: `${sourceNode}${targetNode}`,
      source: sourceNode,
      target: targetNode,
      label: edgeLabel,
      markerEnd: { type: MarkerType.ArrowClosed },
    };

    setEdges([...edges, newEdge]);
    setSourceNode("");
    setTargetNode("");
    setEdgeLabel("");
  };

  const deleteEdge = () => {
    if (!selectedEdge) return;
    setEdges(edges.filter((edge) => edge.id !== selectedEdge.id));
    setSelectedEdge(null);
    setEditEdgeLabel("");
    onClose();
  };

  const modifyEdge = () => {
    if (!selectedEdge || !editEdgeLabel.trim()) {
      setError("Le label ne peut pas être vide.");
      return;
    }

    setEdges(
      edges.map((edge) =>
        edge.id === selectedEdge.id ? { ...edge, label: editEdgeLabel } : edge
      )
    );
    setSelectedEdge(null);
    setEditEdgeLabel("");
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-20 right-4 w-72 bg-white p-4 rounded-lg shadow-lg z-50">
      <div className="relative">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Gestion des arêtes</h2>
        <button
          onClick={onClose}
          className="absolute top-0 right-0 bg-gray-500 text-white p-1 rounded-full hover:bg-gray-600 transition-colors"
          title="Fermer la fenêtre"
        >
          <FaTimes className="text-md" />
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      {/* Ajouter une arête */}
      <div className="mb-4">
        <h3 className="text-md font-semibold text-gray-800 mb-2">Ajouter une arête</h3>
        <input
          type="text"
          value={sourceNode}
          onChange={(e) => setSourceNode(e.target.value)}
          placeholder="Source"
          className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
        />
        <input
          type="text"
          value={targetNode}
          onChange={(e) => setTargetNode(e.target.value)}
          placeholder="Cible"
          className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
        />
        <input
          type="text"
          value={edgeLabel}
          onChange={(e) => setEdgeLabel(e.target.value)}
          placeholder="Poids"
          className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={addEdge}
            className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
            title="Ajouter une arête"
          >
            <FaPlus className="text-md" />
          </button>
        </div>
      </div>

      {/* Modifier/Supprimer une arête */}
      {selectedEdge && (
        <div>
          <h3 className="text-md font-semibold text-gray-800 mb-2">Modifier/Supprimer</h3>
          <p className="text-sm text-gray-600 mb-2">
            Arête: {selectedEdge.source} → {selectedEdge.target}
          </p>
          <input
            type="text"
            value={editEdgeLabel}
            onChange={(e) => setEditEdgeLabel(e.target.value)}
            placeholder="Nouveau poids"
            className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={modifyEdge}
              className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
              title="Modifier l'arête"
            >
              <FaEdit className="text-md" />
            </button>
            <button
              onClick={deleteEdge}
              className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors"
              title="Supprimer l'arête"
            >
              <FaTrash className="text-md" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
