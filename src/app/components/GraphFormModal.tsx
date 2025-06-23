"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaCircle, FaArrowRight } from "react-icons/fa";

interface GraphFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: "node" | "edge";
  nodes: { id: string; label?: string }[];
  edges: { id?: string; source: string; target: string; label?: string }[];
  setNodes: (nodes: { id: string; label?: string }[]) => void;
  setEdges: (edges: { id?: string; source: string; target: string; label?: string }[]) => void;
  selectedNode: { id: string; label?: string } | null;
  selectedEdge: { id?: string; source: string; target: string; label?: string } | null;
  setSelectedNode: (node: { id: string; label?: string } | null) => void;
  setSelectedEdge: (edge: { id?: string; source: string; target: string; label?: string } | null) => void;
}

export default function GraphFormModal({
  isOpen,
  onClose,
  initialMode,
  nodes,
  edges,
  setNodes,
  setEdges,
  selectedNode,
  selectedEdge,
  setSelectedNode,
  setSelectedEdge,
}: GraphFormModalProps) {
  const [mode, setMode] = useState<"node" | "edge">(initialMode);
  const [nodeId, setNodeId] = useState("");
  const [nodeLabel, setNodeLabel] = useState("");
  const [editNodeLabel, setEditNodeLabel] = useState("");
  const [sourceNode, setSourceNode] = useState("");
  const [targetNode, setTargetNode] = useState("");
  const [edgeLabel, setEdgeLabel] = useState("");
  const [editEdgeLabel, setEditEdgeLabel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showNodeDeleteConfirm, setShowNodeDeleteConfirm] = useState(false);
  const [showEdgeDeleteConfirm, setShowEdgeDeleteConfirm] = useState(false);
  const nodeIdInputRef = useRef<HTMLInputElement>(null);
  const sourceNodeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log("GraphFormModal - Selected node:", selectedNode);
    console.log("GraphFormModal - Selected edge:", selectedEdge);
    setEditNodeLabel(selectedNode?.label || "");
    setEditEdgeLabel(selectedEdge?.label || "");
    setError(null);
    setSuccess(null);
    setShowNodeDeleteConfirm(false);
    setShowEdgeDeleteConfirm(false);
  }, [selectedNode, selectedEdge, isOpen]);

  useEffect(() => {
    if (isOpen) {
      console.log("GraphFormModal - isOpen:", isOpen, "Mode:", mode);
      if (mode === "node" && nodeIdInputRef.current) {
        nodeIdInputRef.current.focus();
      } else if (mode === "edge" && sourceNodeInputRef.current) {
        sourceNodeInputRef.current.focus();
      }
    }
  }, [isOpen, mode]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const validateNodeInputs = () => {
    if (!nodeId) {
      setError("L'ID du nœud est requis.");
      return false;
    }
    if (!/^[1-9]\d*$/.test(nodeId)) {
      setError("L'ID du nœud doit être un entier positif (ex: 1, 2).");
      return false;
    }
    if (nodes.some((node) => node.id === nodeId)) {
      setError(`Un nœud avec l'ID "${nodeId}" existe déjà. Essayez un autre ID.`);
      return false;
    }
    return true;
  };

  const validateEdgeInputs = () => {
    if (!sourceNode || !targetNode || !edgeLabel) {
      setError("Tous les champs doivent être remplis.");
      return false;
    }
    if (!nodes.find((node) => node.id === sourceNode) || !nodes.find((node) => node.id === targetNode)) {
      setError(`Les sommets '${sourceNode}' ou '${targetNode}' n'existent pas.`);
      return false;
    }
    if (sourceNode === targetNode) {
      setError("Les arêtes ne peuvent pas connecter un sommet à lui-même.");
      return false;
    }
    if (edges.some((edge) => edge.source === sourceNode && edge.target === targetNode)) {
      setError(`Une arête de '${sourceNode}' à '${targetNode}' existe déjà.`);
      return false;
    }
    if (isNaN(Number(edgeLabel)) || Number(edgeLabel) <= 0) {
      setError("Le poids de l'arête doit être un nombre positif (ex: 5).");
      return false;
    }
    return true;
  };

  const addNode = () => {
    setError(null);
    setSuccess(null);
    if (!validateNodeInputs()) return;

    const newNode = {
      id: nodeId,
      label: nodeLabel || `S${nodeId}`,
    };

    console.log("Adding node:", newNode);
    setNodes([...nodes, newNode]);
    setSuccess(`Sommet '${newNode.label}' ajouté avec succès.`);
    setNodeId("");
    setNodeLabel("");
    nodeIdInputRef.current?.focus();
  };

  const modifyNode = () => {
    if (!selectedNode || !editNodeLabel.trim()) {
      setError("Le label du nœud ne peut pas être vide.");
      return;
    }

    setError(null);
    setSuccess(null);
    console.log("Modifying node:", selectedNode, "New label:", editNodeLabel);
    setNodes(
      nodes.map((node) =>
        node.id === selectedNode.id ? { ...node, label: editNodeLabel } : node
      )
    );
    setSelectedNode({ ...selectedNode, label: editNodeLabel });
    setSuccess(`Sommet '${selectedNode.id}' modifié en '${editNodeLabel}'.`);
    setEditNodeLabel("");
    setSelectedNode(null);
  };

  const confirmDeleteNode = () => {
    if (!selectedNode) return;

    setError(null);
    setSuccess(null);
    console.log("Deleting node:", selectedNode);
    setNodes(nodes.filter((node) => node.id !== selectedNode.id));
    setEdges(
      edges.filter(
        (edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id
      )
    );
    setSuccess(`Sommet '${selectedNode.id}' supprimé avec succès.`);
    setSelectedNode(null);
    setEditNodeLabel("");
    setShowNodeDeleteConfirm(false);
  };

  const addEdge = () => {
    setError(null);
    setSuccess(null);
    if (!validateEdgeInputs()) return;

    const newEdge = {
      id: `${sourceNode}-${targetNode}`,
      source: sourceNode,
      target: targetNode,
      label: edgeLabel,
    };

    console.log("Adding edge:", newEdge);
    setEdges([...edges, newEdge]);
    setSuccess(`Arête '${sourceNode} → ${targetNode}' ajoutée avec succès.`);
    setSourceNode("");
    setTargetNode("");
    setEdgeLabel("");
    sourceNodeInputRef.current?.focus();
  };

  const modifyEdge = () => {
    if (!selectedEdge || !editEdgeLabel.trim()) {
      setError("Le poids ne peut pas être vide.");
      return;
    }
    if (isNaN(Number(editEdgeLabel)) || Number(editEdgeLabel) <= 0) {
      setError("Le poids de l'arête doit être un nombre positif (ex: 5).");
      return;
    }

    setError(null);
    setSuccess(null);
    console.log("Modifying edge:", selectedEdge, "New label:", editEdgeLabel);
    setEdges(
      edges.map((edge) =>
        edge.id === selectedEdge.id ? { ...edge, label: editEdgeLabel } : edge
      )
    );
    setSelectedEdge({ ...selectedEdge, label: editEdgeLabel });
    setSuccess(`Arête '${selectedEdge.source} → ${selectedEdge.target}' modifiée en poids '${editEdgeLabel}'.`);
    setEditEdgeLabel("");
    setSelectedEdge(null); // Réinitialiser après modification
  };

  const confirmDeleteEdge = () => {
    if (!selectedEdge) return;

    setError(null);
    setSuccess(null);
    console.log("Deleting edge:", selectedEdge);
    setEdges(edges.filter((edge) => edge.id !== selectedEdge.id));
    setSuccess(`Arête '${selectedEdge.source} → ${selectedEdge.target}' supprimée avec succès.`);
    setSelectedEdge(null);
    setEditEdgeLabel("");
    setShowEdgeDeleteConfirm(false);
  };

  const handleClose = () => {
    console.log("GraphFormModal - Closing modal");
    setNodeId("");
    setNodeLabel("");
    setSourceNode("");
    setTargetNode("");
    setEdgeLabel("");
    setEditNodeLabel("");
    setEditEdgeLabel("");
    setError(null);
    setSuccess(null);
    setShowNodeDeleteConfirm(false);
    setShowEdgeDeleteConfirm(false);
    setMode(initialMode);
    setSelectedNode(null);
    setSelectedEdge(null);
    onClose();
  };

  if (!isOpen) {
    console.log("GraphFormModal - Not rendering (isOpen is false)");
    return null;
  }

  console.log("GraphFormModal - Rendering with isOpen:", isOpen, "mode:", mode, "selectedNode:", selectedNode, "selectedEdge:", selectedEdge);

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-white p-6 rounded-lg shadow-lg z-[1000] border border-gray-200">
      <div className="relative">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Gestion du Graphe</h2>
        <button
          onClick={handleClose}
          className="absolute top-0 right-0 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-200"
          title="Fermer"
        >
          <FaTimes className="text-sm" />
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => {
            setMode("node");
            setError(null);
            setSuccess(null);
            setShowEdgeDeleteConfirm(false);
            setShowNodeDeleteConfirm(false);
            setSelectedEdge(null);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
            mode === "node"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          <FaCircle className="text-sm" /> Sommets
        </button>
        <button
          onClick={() => {
            setMode("edge");
            setError(null);
            setSuccess(null);
            setShowNodeDeleteConfirm(false);
            setShowEdgeDeleteConfirm(false);
            setSelectedNode(null);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
            mode === "edge"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          <FaArrowRight className="text-sm" /> Arêtes
        </button>
      </div>

      {error && (
        <p className="text-red-600 text-sm mb-3 bg-red-100 p-2 rounded-md">{error}</p>
      )}
      {success && (
        <p className="text-green-600 text-sm mb-3 bg-green-100 p-2 rounded-md">{success}</p>
      )}

      {mode === "node" && (
        <>
          <div className="mb-6">
            <h3 className="text-md font-semibold text-gray-800 mb-2">Ajouter un Sommet</h3>
            <input
              type="text"
              value={nodeId}
              onChange={(e) => setNodeId(e.target.value)}
              placeholder="ID du nœud (ex: 4)"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 transition-all duration-200"
              ref={nodeIdInputRef}
            />
            <input
              type="text"
              value={nodeLabel}
              onChange={(e) => setNodeLabel(e.target.value)}
              placeholder="Label (optionnel, ex: S4)"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 transition-all duration-200"
            />
            <div className="flex justify-end">
              <button
                onClick={addNode}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
              >
                <FaPlus className="text-sm" /> Ajouter
              </button>
            </div>
          </div>

          {!selectedNode && nodes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-md font-semibold text-gray-800 mb-2">Sélectionner un Sommet</h3>
              <ul className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg">
                {nodes.map((node) => (
                  <li
                    key={node.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => setSelectedNode(node)}
                  >
                    {node.label || `S${node.id}`} (ID: {node.id})
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selectedNode && !showNodeDeleteConfirm && (
            <div>
              <h3 className="text-md font-semibold text-gray-800 mb-2">Modifier/Supprimer</h3>
              <p className="text-sm text-gray-600 mb-2">Sommet: {selectedNode.id}</p>
              <input
                type="text"
                value={editNodeLabel}
                onChange={(e) => setEditNodeLabel(e.target.value)}
                placeholder="Nouveau label"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 transition-all duration-200"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={modifyNode}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                >
                  <FaEdit className="text-sm" /> Modifier
                </button>
                <button
                  onClick={() => setShowNodeDeleteConfirm(true)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center gap-2"
                >
                  <FaTrash className="text-sm" /> Supprimer
                </button>
              </div>
            </div>
          )}

          {showNodeDeleteConfirm && selectedNode && (
            <div className="mt-4">
              <h3 className="text-md font-semibold text-gray-800 mb-2">Confirmer la suppression</h3>
              <p className="text-sm text-gray-600 mb-2">
                Voulez-vous vraiment supprimer le sommet '{selectedNode.id}' ? Cela supprimera également toutes les arêtes associées.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowNodeDeleteConfirm(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmDeleteNode}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Confirmer
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {mode === "edge" && (
        <>
          <div className="mb-6">
            <h3 className="text-md font-semibold text-gray-800 mb-2">Ajouter une Arête</h3>
            <input
              type="text"
              value={sourceNode}
              onChange={(e) => setSourceNode(e.target.value)}
              placeholder="Source (ex: 1)"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 transition-all duration-200"
              ref={sourceNodeInputRef}
            />
            <input
              type="text"
              value={targetNode}
              onChange={(e) => setTargetNode(e.target.value)}
              placeholder="Cible (ex: 2)"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 transition-all duration-200"
            />
            <input
              type="text"
              value={edgeLabel}
              onChange={(e) => setEdgeLabel(e.target.value)}
              placeholder="Poids (ex: 5)"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 transition-all duration-200"
            />
            <div className="flex justify-end">
              <button
                onClick={addEdge}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
              >
                <FaPlus className="text-sm" /> Ajouter
              </button>
            </div>
          </div>

          {!selectedEdge && edges.length > 0 && (
            <div className="mb-6">
              <h3 className="text-md font-semibold text-gray-800 mb-2">Sélectionner une Arête</h3>
              <ul className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg">
                {edges.map((edge) => (
                  <li
                    key={edge.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => setSelectedEdge(edge)}
                  >
                    {edge.source} → {edge.target} (Poids: {edge.label})
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selectedEdge && !showEdgeDeleteConfirm && (
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
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 transition-all duration-200"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={modifyEdge}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                >
                  <FaEdit className="text-sm" /> Modifier
                </button>
                <button
                  onClick={() => setShowEdgeDeleteConfirm(true)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center gap-2"
                >
                  <FaTrash className="text-sm" /> Supprimer
                </button>
              </div>
            </div>
          )}

          {showEdgeDeleteConfirm && selectedEdge && (
            <div className="mt-4">
              <h3 className="text-md font-semibold text-gray-800 mb-2">Confirmer la suppression</h3>
              <p className="text-sm text-gray-600 mb-2">
                Voulez-vous vraiment supprimer l'arête "{selectedEdge.source} → {selectedEdge.target}" ?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowEdgeDeleteConfirm(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmDeleteEdge}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Confirmer
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}