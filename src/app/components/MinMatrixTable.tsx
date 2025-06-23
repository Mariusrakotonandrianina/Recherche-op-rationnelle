"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";

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

interface MinMatrixTableProps {
  nodes: Node[];
  edges: Edge[];
  onFinalValuesCalculated?: (
    matrix: (number | string)[][],
    solutionEdges: { source: string; target: string }[]
  ) => void;
  onStepChange?: (
    step: number,
    changedCells: Set<string>,
    currentMatrix: (number | string)[][],
    currentStep: number,
    showSolution?: boolean
  ) => void;
}

interface State {
  matrices: (number | string)[][][];
  calculations: string[][][];
  changedCellsByStep: Set<string>[];
  predecessors: (number | null)[][][];
}

export default function MinMatrixTable({
  nodes,
  edges,
  onFinalValuesCalculated,
  onStepChange,
}: MinMatrixTableProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [, setShowSolution] = useState(false);
  const [state, setState] = useState<State>({
    matrices: [],
    calculations: [],
    changedCellsByStep: [],
    predecessors: [],
  });

  const prevFinalMatrixRef = useRef<(number | string)[][] | null>(null);
  const prevSolutionEdgesRef = useRef<{ source: string; target: string }[] | null>(null);
  const prevInitialMatrixRef = useRef<(number | string)[][] | null>(null);
  const prevInitialChangedCellsRef = useRef<Set<string> | null>(null);

  const computedData = useMemo(() => {
    if (nodes.length === 0) {
      return {
        matrices: [],
        calculations: [],
        changedCellsByStep: [],
        predecessors: [],
        finalMatrix: [],
        solutionEdges: [],
        minValueCells: new Set<string>(),
      };
    }

    const matrixSize = nodes.length;
    const initialMatrix = Array(matrixSize)
      .fill(null)
      .map(() => Array(matrixSize).fill("+∞"));
    const initialPredecessors = Array(matrixSize)
      .fill(null)
      .map(() => Array(matrixSize).fill(null));
    edges.forEach((edge) => {
      const sourceIndex = nodes.findIndex((node) => node.id === edge.source);
      const targetIndex = nodes.findIndex((node) => node.id === edge.target);
      if (sourceIndex !== -1 && targetIndex !== -1) {
        const weight = edge.label ? parseFloat(edge.label) : 1;
        if (!isNaN(weight)) {
          initialMatrix[sourceIndex][targetIndex] = weight;
          initialPredecessors[sourceIndex][targetIndex] = sourceIndex;
        }
      }
    });

    const allMatrices = [initialMatrix];
    const allCalculations: string[][][] = [Array(matrixSize).fill([])];
    const allChangedCells: Set<string>[] = [new Set()];
    const allPredecessors = [initialPredecessors];
    let currentMatrix = initialMatrix.map((row) => [...row]);
    let currentPredecessors = initialPredecessors.map((row) => [...row]);

    for (let k = 0; k < matrixSize - 1; k++) {
      const newMatrix = currentMatrix.map((row) => [...row]);
      const newPredecessors = currentPredecessors.map((row) => [...row]);
      const stepCalculations: string[][] = Array(matrixSize)
        .fill(null)
        .map(() => Array(matrixSize).fill(""));
      const changedCellsSet = new Set<string>();

      for (let i = 0; i < matrixSize; i++) {
        for (let j = 0; j < matrixSize; j++) {
          if (i === j) continue;

          const direct =
            currentMatrix[i][j] === "+∞" ? Infinity : parseFloat(currentMatrix[i][j] as string);
          const viaK =
            (currentMatrix[i][k] === "+∞" ? Infinity : parseFloat(currentMatrix[i][k] as string)) +
            (currentMatrix[k][j] === "+∞" ? Infinity : parseFloat(currentMatrix[k][j] as string));
          const wValue = Number.isFinite(viaK) ? viaK : "+∞";

          let newValue: number | string;
          if (Number.isFinite(viaK)) {
            newValue = Number.isFinite(direct) ? Math.min(direct, viaK) : viaK;
          } else {
            newValue = direct;
          }
          newMatrix[i][j] = Number.isFinite(newValue) ? newValue : "+∞";

          if (currentMatrix[i][k] !== "+∞" && currentMatrix[k][j] !== "+∞") {
            stepCalculations[i][j] = `W_${nodes[i].id}${nodes[j].id}(${k}) = V_${nodes[i].id}${
              nodes[k].id
            }(${k}) + V_${nodes[k].id}${nodes[j].id}(${k}) = ${currentMatrix[i][k]} + ${
              currentMatrix[k][j]
            } = ${wValue}, V_${nodes[i].id}${nodes[j].id}(${k+1}) = min(${wValue}, ${
              currentMatrix[i][j]
            }) = ${newMatrix[i][j]}`;
          }

          if (newMatrix[i][j] !== currentMatrix[i][j]) {
            changedCellsSet.add(`${i}-${j}`);
            newPredecessors[i][j] =
              currentPredecessors[k][j] !== null
                ? currentPredecessors[k][j]
                : currentPredecessors[i][j];
          }
        }
      }

      allMatrices.push(newMatrix);
      allCalculations.push(stepCalculations);
      allChangedCells.push(changedCellsSet);
      allPredecessors.push(newPredecessors);
      currentMatrix = newMatrix;
      currentPredecessors = newPredecessors;
    }

    const finalMatrix = allMatrices[allMatrices.length - 1];
    const finalPredecessors = allPredecessors[allPredecessors.length - 1];
    const solutionEdges: { source: string; target: string }[] = [];
    const addedEdges = new Set<string>();
    const minValueCells = new Set<string>();

    let initialNodeIndex = -1;
    let finalNodeIndex = -1;
    for (let i = 0; i < matrixSize; i++) {
      const hasIncoming = finalMatrix.some((row, j) => j !== i && row[i] !== "+∞");
      if (!hasIncoming) {
        initialNodeIndex = i;
      }

      const hasOutgoing = finalMatrix[i].some((val, j) => j !== i && val !== "+∞");
      if (!hasOutgoing) {
        finalNodeIndex = i;
      }
    }

    if (initialNodeIndex !== -1 && finalNodeIndex !== -1 && initialNodeIndex !== finalNodeIndex) {
      let current = finalNodeIndex;
      const path = [current];
      while (current !== initialNodeIndex && finalPredecessors[initialNodeIndex][current] !== null) {
        const next = finalPredecessors[initialNodeIndex][current]!;
        if (path.includes(next)) break;
        path.unshift(next);
        current = next;
      }
      
      if (current === initialNodeIndex) {
        path.unshift(initialNodeIndex);
        for (let p = 0; p < path.length - 1; p++) {
          const edgeKey = `${nodes[path[p]].id}-${nodes[path[p + 1]].id}`;
          if (!addedEdges.has(edgeKey)) {
            solutionEdges.push({
              source: nodes[path[p]].id,
              target: nodes[path[p + 1]].id,
            });
            addedEdges.add(edgeKey);
          }
        }
      
        for (let p = 0; p < path.length - 1; p++) {
          const sourceIndex = nodes.findIndex((n) => n.id === nodes[path[p]].id);
          const targetIndex = nodes.findIndex((n) => n.id === nodes[path[p + 1]].id);
          minValueCells.add(`${sourceIndex}-${targetIndex}`);
        }
      }
    }

    return {
      matrices: allMatrices,
      calculations: allCalculations,
      changedCellsByStep: allChangedCells,
      predecessors: allPredecessors,
      finalMatrix,
      solutionEdges,
      minValueCells,
    };
  }, [nodes, edges]);

  useEffect(() => {
    setState({
      matrices: computedData.matrices,
      calculations: computedData.calculations,
      changedCellsByStep: computedData.changedCellsByStep,
      predecessors: computedData.predecessors,
    });
    setCurrentStep(0);
    setShowSolution(false);

    const finalMatrixStr = JSON.stringify(computedData.finalMatrix);
    const solutionEdgesStr = JSON.stringify(computedData.solutionEdges);
    if (
      onFinalValuesCalculated &&
      (finalMatrixStr !== JSON.stringify(prevFinalMatrixRef.current) ||
        solutionEdgesStr !== JSON.stringify(prevSolutionEdgesRef.current))
    ) {
      onFinalValuesCalculated(computedData.finalMatrix, computedData.solutionEdges);
      prevFinalMatrixRef.current = computedData.finalMatrix;
      prevSolutionEdgesRef.current = computedData.solutionEdges;
    }

    const initialMatrixStr = JSON.stringify(computedData.matrices[0]);
    const initialChangedCellsStr = JSON.stringify([...(computedData.changedCellsByStep[0] || new Set())]);
    if (
      onStepChange &&
      (initialMatrixStr !== JSON.stringify(prevInitialMatrixRef.current) ||
        initialChangedCellsStr !== JSON.stringify([...(prevInitialChangedCellsRef.current || new Set())]))
    ) {
      onStepChange(0, computedData.changedCellsByStep[0] || new Set(), computedData.matrices[0], 0);
      prevInitialMatrixRef.current = computedData.matrices[0];
      prevInitialChangedCellsRef.current = computedData.changedCellsByStep[0] || new Set();
    }
  }, [computedData, onFinalValuesCalculated, onStepChange]);

  const handleNextStep = () => {
    if (currentStep < state.matrices.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
       setShowSolution(false);
      if (onStepChange) {
        onStepChange(
          newStep,
          state.changedCellsByStep[newStep] || new Set(),
          state.matrices[newStep],
          newStep
        );
      }
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      setShowSolution(false);
      if (onStepChange) {
        onStepChange(
          newStep,
          state.changedCellsByStep[newStep] || new Set(),
          state.matrices[newStep],
          newStep
        );
      }
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setShowSolution(false);
    if (onStepChange) {
      onStepChange(
        0,
        state.changedCellsByStep[0] || new Set(),
        state.matrices[0],
        0
      );
    }
  };

  const handleShowSolution = () => {
    if (currentStep === state.matrices.length - 1) {
      setShowSolution(true);
      if (onStepChange) {
        onStepChange(
          currentStep,
          state.changedCellsByStep[currentStep] || new Set(),
          state.matrices[currentStep],
          currentStep,
          true
        );
      }
    }
  };

  const currentMatrix = state.matrices[currentStep] || [];
  const currentCalculations = state.calculations[currentStep] || [];
  const currentChangedCells = state.changedCellsByStep[currentStep] || new Set();

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        {currentStep === 0
          ? "Matrice Initiale D₁"
          : `Matrice D${currentStep + 1} (Étape k=${currentStep})`}
      </h2>
      {nodes.length === 0 ? (
        <p className="text-gray-600">Aucun sommet. Ajoutez des sommets pour commencer.</p>
      ) : (
        <>
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
                    <td className="border border-gray-300 p-2 bg-gray-100 font-semibold">{rowNode.id}</td>
                    {currentMatrix[rowIndex]?.map((value, colIndex) => {
                      const isFinalStep = currentStep === state.matrices.length - 1;
                      const isMinValue =
                        isFinalStep && computedData.minValueCells.has(`${rowIndex}-${colIndex}`);
                      return (
                        <td
                          key={`${rowNode.id}-${nodes[colIndex].id}`}
                          className={`border border-gray-300 p-2 ${
                            currentChangedCells.has(`${rowIndex}-${colIndex}`)
                              ? "text-red-500 font-bold bg-red-100"
                              : isMinValue
                              ? "text-blue-600 font-bold bg-blue-200"
                              : isFinalStep && value !== "+∞"
                              ? "text-green-500 font-bold bg-green-100"
                              : ""
                          }`}
                        >
                          {value}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {currentCalculations.length > 0 && currentCalculations.some((row) => row.some((calc) => calc)) && (
            <div className="mt-4">
              <h3 className="text-md font-semibold text-gray-800 mb-2">
                Calculs pour létape {currentStep === 0 ? 'Initiale' : `k=${currentStep}`}
              </h3>
              <div className="text-gray-700">
                {currentCalculations.map((rowCalcs, rowIndex) =>
                  rowCalcs.map((calc, calcIndex) =>
                    calc ? (
                      <div key={`${rowIndex}-${calcIndex}`} className="mb-1">
                        {calc}
                      </div>
                    ) : null
                  )
                )}
              </div>
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <button
              onClick={handleRestart}
              className="bg-blue-500 text-white py-1.5 px-3 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-200"
              aria-label="Recommencer le processus"
            >
              Recommencer
            </button>
            <button
              onClick={handlePreviousStep}
              disabled={currentStep === 0}
              className={`py-1 px-1 rounded-lg shadow-md transition-all duration-200 ${
                currentStep === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-yellow-500 text-white hover:bg-yellow-600"
              }`}
              aria-label="Revenir à l'étape précédente"
            >
              Précédent
            </button>
            <button
              onClick={handleNextStep}
              disabled={currentStep >= state.matrices.length - 1}
              className={`py-1 px-1 rounded-lg shadow-md transition-all duration-200 ${
                currentStep >= state.matrices.length - 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
              aria-label="Avancer à l'étape suivante"
            >
              Suivant
            </button>
            <button
              onClick={handleShowSolution}
              disabled={currentStep < state.matrices.length - 1}
              className={`py-1 px-1 rounded-lg shadow-md transition-all duration-200 ${
                currentStep < state.matrices.length - 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-400 text-white hover:bg-blue-500"
              }`}
              aria-label="Afficher la solution"
            >
              Afficher Solution
            </button>
          </div>
        </>
      )}
    </div>
  );
}