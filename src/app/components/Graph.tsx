"use client";

import { useEffect, useRef, useCallback } from "react";
import { Network, IdType, Edge as VisEdge, Node as VisNode } from "vis-network/standalone/esm/vis-network";
import dagre from "dagre";

interface GraphProps {
  nodes: { id: string; label?: string; x?: number; y?: number }[];
  edges: { id?: string; source: string; target: string; label?: string }[];
  setNodes: (nodes: { id: string; label?: string; x?: number; y?: number }[]) => void;
  setEdges: (edges: { id?: string; source: string; target: string; label?: string }[]) => void;
  onEdgeSelect: (edge: { id?: string; source: string; target: string; label?: string }) => void;
  onNodeSelect: (node: { id: string; label?: string }) => void;
  finalMatrix?: (number | string)[][];
  solutionEdges?: { source: string; target: string }[];
  changedCells?: Set<string>;
  currentStep?: number;
  showSolution?: boolean;
}

const defaultNodeStyle = {
  shape: "circle",
  size: 35,
  borderWidth: 2,
  borderWidthSelected: 4,
  color: {
    border: "#2E86C1",
    background: "#DDEBF7",
    highlight: { border: "#1B6B93", background: "#DDEBF7" },
  },
  font: { size: 16, color: "#1B1B1B", face: "Roboto", bold: true },
  shadow: { enabled: true, size: 5, x: 2, y: 2, color: "rgba(0,0,0,0.1)" },
};

const solutionNodeStyle = {
  ...defaultNodeStyle,
  color: { border: "#006400", background: "#90EE90" },
};

const getLayoutedElements = (
  nodes: { id: string; label?: string }[],
  edges: { id?: string; source: string; target: string; label?: string }[]
) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: "LR" });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 70, height: 70 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id) as { x: number; y: number };
    return {
      ...node,
      x: nodeWithPosition.x - 35,
      y: nodeWithPosition.y - 35,
    };
  });
};

const areNodesEqual = (
  nodesA: { id: string; label?: string; x?: number; y?: number }[],
  nodesB: { id: string; label?: string; x?: number; y?: number }[]
) => {
  if (nodesA.length !== nodesB.length) return false;
  return nodesA.every((nodeA, index) => {
    const nodeB = nodesB[index];
    return nodeA.id === nodeB.id && nodeA.label === nodeB.label;
  });
};

export default function Graph({
  nodes,
  edges,
  setNodes,
  onEdgeSelect,
  onNodeSelect,
  finalMatrix = [],
  solutionEdges = [],
  changedCells = new Set(),
  currentStep = 0,
  showSolution = false,
}: GraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);

  const updateGraph = useCallback(() => {
    if (!containerRef.current) return;

    const layoutedNodes = getLayoutedElements(nodes, edges).map((node) => {
      const isFinalSolution = currentStep === nodes.length - 1;
      const nodeIndex = nodes.findIndex((n) => n.id === node.id);
      const isSolutionNode =
        isFinalSolution &&
        (finalMatrix.some((row, i) => i !== nodeIndex && row[nodeIndex] !== "+∞") ||
          finalMatrix[nodeIndex]?.some((val, j) => j !== nodeIndex && val !== "+∞"));
      return {
        ...node,
        label: node.label || `S${node.id}`,
        style: isSolutionNode ? solutionNodeStyle : defaultNodeStyle,
      };
    });

    if (!areNodesEqual(layoutedNodes, nodes)) {
      setNodes(layoutedNodes);
    }

    const visEdges: VisEdge[] = edges.map((edge) => {
      const sourceIndex = nodes.findIndex((n) => n.id === edge.source);
      const targetIndex = nodes.findIndex((n) => n.id === edge.target);
      const isSolutionEdge =
        showSolution &&
        solutionEdges.some(
          (se) => se.source === edge.source && se.target === edge.target
        );
      const isChangedEdge = changedCells.has(`${sourceIndex}-${targetIndex}`);

      const baseEdge: VisEdge = {
        id: edge.id || `${edge.source}-${edge.target}`,
        from: edge.source,
        to: edge.target,
        label: edge.label || "",
        arrows: { to: { enabled: true, type: "arrow" } },
        font: { size: 14, color: "#1B1B1B", face: "Roboto" },
        color: { color: "#2E86C1", highlight: "#1B6B93" },
        width: 2,
      };

      if (isChangedEdge) {
        return {
          ...baseEdge,
          color: { color: "#FFA500", highlight: "#FF8C00" },
          dashes: [8, 4],
          width: 3,
        };
      } else if (isSolutionEdge) {
        return {
          ...baseEdge,
          color: { color: "#FF0000", highlight: "#FF3333" },
          width: 4,
          dashes: false,
        };
      }

      return { ...baseEdge, dashes: false };
    });

    const data = {
      nodes: layoutedNodes.map((node) => ({
        id: node.id,
        label: node.label,
        x: node.x,
        y: node.y,
        shape: node.style.shape,
        size: node.style.size,
        borderWidth: node.style.borderWidth,
        borderWidthSelected: node.style.borderWidthSelected,
        color: node.style.color,
        font: { ...node.style.font, bold: node.style.font.bold ? "bold" : undefined },
        shadow: node.style.shadow,
      })),
      edges: visEdges,
    };

    const options = {
      physics: false,
      autoResize: true,
      interaction: { zoomView: true, dragView: true, hover: true, selectable: true },
      edges: {
        arrows: { to: { enabled: true, type: "arrow" } },
        smooth: { enabled: true, type: "cubicBezier", roundness: 0.3 },
        font: { align: "top" },
        hoverWidth: 1.5,
      },
      nodes: {
        shape: "circle",
        font: { size: 16, face: "Roboto" },
      },
    };

    if (!networkRef.current) {
      networkRef.current = new Network(containerRef.current, data, options);
      networkRef.current.on("click", (params: { nodes: IdType[]; edges: IdType[] }) => {
        if (params.nodes.length > 0) {
          const nodeId = params.nodes[0];
          const node = layoutedNodes.find((n) => n.id === nodeId);
          if (node) {
            onNodeSelect(node);
          }
        } else if (params.edges.length > 0) {
          const edgeId = params.edges[0];
          const edge = visEdges.find((e) => e.id === edgeId);
          if (edge) {
            onEdgeSelect({
              id: edge.id !== undefined ? String(edge.id) : undefined,
              source: String(edge.from),
              target: String(edge.to),
              label: edge.label,
            });
          }
        }
      });      
    } else {
      networkRef.current.setData(data);
      networkRef.current.fit();
    }
  }, [nodes, edges, finalMatrix, solutionEdges, changedCells, currentStep, showSolution, setNodes, onNodeSelect, onEdgeSelect]);

  useEffect(() => {
    updateGraph();
  }, [updateGraph]);

  return (
    <div className="p-6 w-full lg:w-2/3">
      <div
        ref={containerRef}
        className="h-[600px] border-2 border-gray-200 rounded-lg shadow-md bg-white transition-all duration-300"
      />
    </div>
  );
}
