"use client";

import React, { useState } from "react";
import { Node, Edge } from "reactflow";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";

interface NodeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: Node[];
  edges: Edge[];
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  selectedNode: Node | null;
  setSelectedNode: (node: Node | null) => void;
}

const nodeStyle = {
  borderRadius: "50%",
  width: 50,
  height: 50,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: "3px 3px 10px rgba(0,0,0,0.2)",
  fontWeight: "bold",
  border: "2px solid #000",
  background: "#fff",
};

export default function NodeFormModal({
  isOpen,
  onClose,
  nodes,
  edges,
  setNodes,
  setEdges,
  selectedNode,
  setSelectedNode,
}: NodeFormModalProps) {
  const [newNodeId, setNewNodeId] = useState("");
  const [editNodeId, setEditNodeId] = useState(selectedNode?.id || "");
  const [errorMessage, setErrorMessage] = useState("");

  const clearErrors = () => setErrorMessage("");

  const addNode = () => {
    if (!newNodeId.trim()) {
      setErrorMessage("Le nom du sommet ne peut pas être vide.");
      return;
    }

    if (nodes.find((node) => node.id === newNodeId)) {
      setErrorMessage("Ce sommet existe déjà !");
      return;
    }

    const newNode: Node = {
      id: newNodeId,
      data: { label: newNodeId },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      style: nodeStyle,
    };

    setNodes([...nodes, newNode]);
    setNewNodeId("");
    clearErrors();
  };

  const deleteNode = () => {
    if (!selectedNode) return;
    setNodes(nodes.filter((node) => node.id !== selectedNode.id));
    setEdges(edges.filter((edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id));
    setSelectedNode(null);
    setEditNodeId("");
    onClose();
    clearErrors();
  };

  const modifyNode = () => {
    if (!selectedNode || !editNodeId.trim()) {
      setErrorMessage("Le nom du sommet ne peut pas être vide.");
      return;
    }

    if (nodes.find((node) => node.id === editNodeId && node.id !== selectedNode.id)) {
      setErrorMessage("Ce nom de sommet existe déjà !");
      return;
    }

    setNodes(
      nodes.map((node) =>
        node.id === selectedNode.id ? { ...node, id: editNodeId, data: { label: editNodeId } } : node
      )
    );
    setEdges(
      edges.map((edge) => ({
        ...edge,
        id:
          edge.source === selectedNode.id || edge.target === selectedNode.id
            ? `${edge.source === selectedNode.id ? editNodeId : edge.source}${
                edge.target === selectedNode.id ? editNodeId : edge.target
              }`
            : edge.id,
        source: edge.source === selectedNode.id ? editNodeId : edge.source,
        target: edge.target === selectedNode.id ? editNodeId : edge.target,
      }))
    );
    setSelectedNode(null);
    setEditNodeId("");
    onClose();
    clearErrors();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-20 left-4 w-72 bg-white p-4 rounded-lg shadow-lg z-50">
      <div className="relative">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Gestion des sommets</h2>
        <button
          onClick={onClose}
          className="absolute top-0 right-0 bg-gray-500 text-white p-1 rounded-full hover:bg-gray-600 transition-colors"
          title="Fermer la fenêtre"
        >
          <FaTimes className="text-md" />
        </button>
      </div>

      {/* Affichage des erreurs */}
      {errorMessage && (
        <p className="text-sm text-red-500 mb-2 p-1 border border-red-500 rounded bg-red-100">{errorMessage}</p>
      )}

      {/* Ajouter un sommet */}
      <div className="mb-4">
        <h3 className="text-md font-semibold text-gray-800 mb-2">Ajouter un sommet</h3>
        <input
          type="text"
          value={newNodeId}
          onChange={(e) => {
            setNewNodeId(e.target.value);
            clearErrors();
          }}
          placeholder="Nom du sommet"
          className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={addNode}
            className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
            title="Ajouter un sommet"
          >
            <FaPlus className="text-md" />
          </button>
        </div>
      </div>

      {/* Modifier/Supprimer un sommet */}
      {selectedNode && (
        <div>
          <h3 className="text-md font-semibold text-gray-800 mb-2">Modifier/Supprimer</h3>
          <p className="text-sm text-gray-600 mb-2">Sommet: {selectedNode.id}</p>
          <input
            type="text"
            value={editNodeId}
            onChange={(e) => {
              setEditNodeId(e.target.value);
              clearErrors();
            }}
            placeholder="Nouveau nom"
            className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={modifyNode}
              className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
              title="Modifier le sommet"
            >
              <FaEdit className="text-md" />
            </button>
            <button
              onClick={deleteNode}
              className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors"
              title="Supprimer le sommet"
            >
              <FaTrash className="text-md" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
