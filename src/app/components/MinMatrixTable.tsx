// components/MatrixTable.tsx
"use client";

import React from "react";
import { Node, Edge } from "reactflow";

interface MatrixTableProps {
  nodes: Node[];
  edges: Edge[];
}

export default function MatrixTable({ nodes, edges }: MatrixTableProps) {
  // Taille de la matrice = nombre de sommets
  const matrixSize = nodes.length;
  
  // Initialiser la matrice avec "∞" partout
  const matrix = Array(matrixSize)
    .fill(null)
    .map(() => Array(matrixSize).fill("∞"));

  // Remplir la matrice avec les poids des arêtes
  edges.forEach((edge) => {
    const sourceIndex = nodes.findIndex((node) => node.id === edge.source);
    const targetIndex = nodes.findIndex((node) => node.id === edge.target);
    if (sourceIndex !== -1 && targetIndex !== -1) {
      matrix[sourceIndex][targetIndex] = edge.label || "1"; // Utiliser le poids (label) ou "1" si pas de poids
    }
  });

  // Si aucun sommet, afficher un message
  if (nodes.length === 0) {
    return <div className="text-gray-600">Aucun sommet à afficher</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Matrice d'adjacence</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-center">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2 bg-gray-100"></th>
              {nodes.map((node) => (
                <th key={node.id} className="border border-gray-300 p-2 bg-gray-100 font-semibold">
                  {node.id}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {nodes.map((rowNode, rowIndex) => (
              <tr key={rowNode.id}>
                <td className="border border-gray-300 p-2 bg-gray-100 font-semibold">
                  {rowNode.id}
                </td>
                {matrix[rowIndex].map((value, colIndex) => (
                  <td
                    key={`${rowNode.id}-${nodes[colIndex].id}`}
                    className="border border-gray-300 p-2"
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}