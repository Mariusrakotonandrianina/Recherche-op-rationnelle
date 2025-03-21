"use client";

import React, { useState, useEffect } from "react";
import { Node, Edge } from "reactflow";

interface MaxMatrixTableProps {
  nodes: Node[];
  edges: Edge[];
}

export default function MaxMatrixTable({ nodes, edges }: MaxMatrixTableProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [matrices, setMatrices] = useState<string[][][]>([]);
  const [vValues, setVValues] = useState<(number | string)[][]>([]);
  const [ranks, setRanks] = useState<number[]>([]);
  const [changedCellsByStep, setChangedCellsByStep] = useState<Set<string>[]>([]); // Changé en tableau de Sets
  const [calculations, setCalculations] = useState<string[][]>([]);

  const calculateTopologicalRanks = () => {
    const inDegree = new Array(nodes.length).fill(0);
    const rank = new Array(nodes.length).fill(-1);
    const queue: number[] = [];

    edges.forEach((edge) => {
      const targetIndex = nodes.findIndex((node) => node.id === edge.target);
      const sourceIndex = nodes.findIndex((node) => node.id === edge.source);
      if (targetIndex !== -1 && sourceIndex !== -1) {
        inDegree[targetIndex]++;
      }
    });

    inDegree.forEach((degree, index) => {
      if (degree === 0) queue.push(index);
    });

    let currentRank = 0;
    while (queue.length > 0) {
      const levelSize = queue.length;
      for (let i = 0; i < levelSize; i++) {
        const nodeIndex = queue.shift()!;
        rank[nodeIndex] = currentRank;

        edges.forEach((edge) => {
          const sourceIndex = nodes.findIndex((node) => node.id === edge.source);
          const targetIndex = nodes.findIndex((node) => node.id === edge.target);
          if (sourceIndex === nodeIndex && targetIndex !== -1) {
            inDegree[targetIndex]--;
            if (inDegree[targetIndex] === 0) queue.push(targetIndex);
          }
        });
      }
      currentRank++;
    }

    return rank;
  };

  useEffect(() => {
    if (nodes.length === 0) {
      setMatrices([]);
      setVValues([]);
      setRanks([]);
      setCurrentStep(0);
      setCalculations([]);
      setChangedCellsByStep([]);
      return;
    }

    const topologicalRanks = calculateTopologicalRanks();
    setRanks(topologicalRanks);

    const matrixSize = nodes.length;
    const initialMatrix = Array(matrixSize)
      .fill(null)
      .map(() => Array(matrixSize).fill("+∞"));

    edges.forEach((edge) => {
      const sourceIndex = nodes.findIndex((node) => node.id === edge.source);
      const targetIndex = nodes.findIndex((node) => node.id === edge.target);
      if (sourceIndex !== -1 && targetIndex !== -1) {
        initialMatrix[sourceIndex][targetIndex] = edge.label?.toString() || "1";
      }
    });

    const initialV = new Array(matrixSize).fill("+∞");
    const startNodeIndex = topologicalRanks.findIndex((rank) => rank === 0);
    if (startNodeIndex !== -1) {
      initialV[startNodeIndex] = "0"; // Utiliser string pour cohérence
    }

    const allMatrices = [initialMatrix];
    const allVValues = [initialV];
    const allCalculations: string[][] = [[]];
    const allChangedCells: Set<string>[] = [new Set()];

    let currentMatrix = initialMatrix.map((row) => [...row]);
    let currentV = [...initialV];
    const maxRank = Math.max(...topologicalRanks.filter(r => r !== -1), 0);

    for (let k = 1; k <= maxRank + 1; k++) {
      const newMatrix = currentMatrix.map((row) => [...row]);
      const newV = [...currentV];
      const stepCalculations: string[] = [];
      const changedCellsSet = new Set<string>();

      const nodesAtRankK = topologicalRanks
        .map((rank, index) => (rank === k - 1 ? index : -1))
        .filter((index) => index !== -1);

      nodesAtRankK.forEach((j) => {
        let minValue = Infinity;
        const wValues: string[] = [];

        edges.forEach((edge) => {
          const sourceIndex = nodes.findIndex((node) => node.id === edge.source);
          const targetIndex = nodes.findIndex((node) => node.id === edge.target);
          if (targetIndex === j && sourceIndex !== -1) {
            const weight = parseFloat(edge.label?.toString() || "1");
            const vSource = currentV[sourceIndex] === "+∞" ? Infinity : parseFloat(currentV[sourceIndex] as string);
            const total = Number.isFinite(vSource) ? vSource + weight : Infinity;
            wValues.push(
              `W_${nodes[sourceIndex].id}${nodes[j].id}(${k-1}) = V_${nodes[sourceIndex].id}(${k-1}) + d_${nodes[sourceIndex].id}${nodes[j].id} = ${currentV[sourceIndex]} + ${weight} = ${Number.isFinite(total) ? total : "+∞"}`
            );
            minValue = Math.min(minValue, total);
          }
        });

        const previousV = currentV[j] === "+∞" ? Infinity : parseFloat(currentV[j] as string);
        newV[j] = Number.isFinite(minValue) ? Math.min(minValue, previousV).toString() : "+∞";
        if (wValues.length > 0) {
          stepCalculations.push(
            `V_${nodes[j].id}(${k}) = MIN(${wValues.map(w => w.split("=").pop()?.trim()).join(", ")}, V_${nodes[j].id}(${k-1})=${currentV[j]}) = ${newV[j]}`
          );
        }
      });

      nodesAtRankK.forEach((kIndex) => {
        for (let i = 0; i < matrixSize; i++) {
          for (let j = 0; j < matrixSize; j++) {
            const direct = currentMatrix[i][j] === "+∞" ? Infinity : parseFloat(currentMatrix[i][j]);
            const viaK =
              (currentMatrix[i][kIndex] === "+∞" ? Infinity : parseFloat(currentMatrix[i][kIndex])) +
              (currentMatrix[kIndex][j] === "+∞" ? Infinity : parseFloat(currentMatrix[kIndex][j]));
            const newValue = Math.min(direct, viaK);
            newMatrix[i][j] = Number.isFinite(newValue) ? newValue.toString() : "+∞";

            if (newMatrix[i][j] !== currentMatrix[i][j]) {
              changedCellsSet.add(`${i}-${j}`);
            }
          }
        }
      });

      allMatrices.push(newMatrix);
      allVValues.push(newV);
      allCalculations.push(stepCalculations);
      allChangedCells.push(changedCellsSet);
      currentMatrix = newMatrix;
      currentV = newV;
    }

    setMatrices(allMatrices);
    setVValues(allVValues);
    setCalculations(allCalculations);
    setChangedCellsByStep(allChangedCells);
    setCurrentStep(0);
  }, [nodes, edges]);

  if (nodes.length === 0) {
    return <div className="text-gray-600">Aucun sommet à afficher</div>;
  }

  const handleNextStep = () => {
    if (currentStep < matrices.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
  };

  const currentMatrix = matrices[currentStep] || [];
  const currentV = vValues[currentStep] || [];
  const currentCalculations = calculations[currentStep] || [];
  const currentChangedCells = changedCellsByStep[currentStep] || new Set();

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        Matrice D<sub>{currentStep}</sub> (Étape {currentStep})
      </h2>
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
                {currentMatrix[rowIndex]?.map((value, colIndex) => (
                  <td
                    key={`${rowNode.id}-${nodes[colIndex].id}`}
                    className={`border border-gray-300 p-2 ${
                      currentChangedCells.has(`${rowIndex}-${colIndex}`) ? "text-red-500 font-bold" : ""
                    }`}
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <h3 className="text-md font-semibold text-gray-800 mb-2">Valeurs V<sub>{currentStep}</sub></h3>
        <div className="flex flex-wrap gap-4">
          {nodes.map((node, index) => (
            <div key={node.id}>
              V<sub>{currentStep}</sub>({node.id}) = {currentV[index]}
            </div>
          ))}
        </div>
      </div>

      {currentCalculations.length > 0 && (
        <div className="mt-4">
          <h3 className="text-md font-semibold text-gray-800 mb-2">Calculs pour l'étape {currentStep}</h3>
          <div className="text-gray-700">
            {currentCalculations.map((calc, index) => (
              <div key={index}>{calc}</div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <button
          onClick={handleRestart}
          className="bg-blue-500 text-white py-1.5 px-3 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-200"
        >
          Recommencer
        </button>
        {currentStep < matrices.length - 1 && (
          <button
            onClick={handleNextStep}
            className="bg-green-500 text-white py-1.5 px-3 rounded-lg shadow-md hover:bg-green-600 transition-all duration-200"
          >
            Suivant
          </button>
        )}
      </div>
    </div>
  );
}