"use client";

import { useEffect, useRef, useCallback } from "react";
import { Network } from "vis-network/standalone/esm/vis-network";
import dagre from "dagre";

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

interface GraphProps {
  nodes: Node[];
  edges: Edge[];
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodeSelect: (node: Node) => void;
  onEdgeSelect: (edge: Edge) => void;
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
  font: { size: 16, color: "#1B1B1B", face: "Roboto" },
  shadow: { enabled: true, size: 5, x: 2, y: 2, color: "rgba(0,0,0,0.1)" },
};

const solutionNodeStyle = {
  ...defaultNodeStyle,
  color: {
    border: "#006400",
    background: "#90EE90",
    highlight: { border: "#004d00", background: "#90EE90" },
  },
};

const getLayoutedElements = (nodes: Node[], edges: Edge[]): Node[] => {
  try {
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
      const nodeWithPosition = dagreGraph.node(node.id);
      return {
        ...node,
        x: nodeWithPosition ? nodeWithPosition.x - 35 : 0,
        y: nodeWithPosition ? nodeWithPosition.y - 35 : 0,
      };
    });
  } catch (error) {
    console.error("Erreur lors du calcul du layout avec dagre:", error);
    return nodes.map((node) => ({ ...node, x: node.x ?? 0, y: node.y ?? 0 }));
  }
};

const areNodesEqual = (nodesA: Node[], nodesB: Node[]): boolean => {
  if (nodesA.length !== nodesB.length) return false;
  const nodesAMap = new Map(nodesA.map((node) => [node.id, node]));
  return nodesB.every((nodeB) => {
    const nodeA = nodesAMap.get(nodeB.id);
    if (!nodeA) return false;
    return (
      nodeA.label === nodeB.label &&
      (nodeA.x ?? 0) === (nodeB.x ?? 0) &&
      (nodeA.y ?? 0) === (nodeB.y ?? 0)
    );
  });
};

const areEdgesEqual = (edgesA: Edge[], edgesB: Edge[]): boolean => {
  if (edgesA.length !== edgesB.length) return false;
  const edgesAMap = new Map(edgesA.map((edge) => [edge.id || `${edge.source}-${edge.target}`, edge]));
  return edgesB.every((edgeB) => {
    const edgeA = edgesAMap.get(edgeB.id || `${edgeB.source}-${edgeB.target}`);
    if (!edgeA) return false;
    return (
      edgeA.source === edgeB.source &&
      edgeA.target === edgeB.target &&
      edgeA.label === edgeB.label
    );
  });
};

interface VisEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
  arrows: { to: { enabled: boolean; type: string } };
  font: { size: number; color: string; face: string };
  color: { color: string; highlight: string };
  width: number;
  dashes: boolean | number[];
}

export default function Graph({
  nodes,
  edges,
  setNodes,
  onNodeSelect,
  onEdgeSelect,
  finalMatrix = [],
  solutionEdges = [],
  changedCells = new Set(),
  currentStep = 0,
  showSolution = false,
}: GraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);
  const prevNodesRef = useRef<Node[]>(nodes);
  const prevEdgesRef = useRef<Edge[]>(edges);

  const updateGraph = useCallback(() => {
    if (!containerRef.current) return;

    const nodesChanged = !areNodesEqual(nodes, prevNodesRef.current);
    const edgesChanged = !areEdgesEqual(edges, prevEdgesRef.current);
    prevNodesRef.current = nodes;
    prevEdgesRef.current = edges;

    const positionedNodes = nodesChanged || edgesChanged ? getLayoutedElements(nodes, edges) : nodes;

    const layoutedNodes = positionedNodes.map((node) => {
      const isSolutionNode =
        showSolution &&
        solutionEdges.some((se) => se.source === node.id || se.target === node.id);

      console.log(
        `Nœud ${node.id}: isSolutionNode=${isSolutionNode}, showSolution=${showSolution}, solutionEdges=`,
        solutionEdges
      );

      return {
        ...node,
        label: node.label || `S${node.id}`,
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
        solutionEdges.some((se) => se.source === edge.source && se.target === edge.target);
      const isChangedEdge =
        sourceIndex >= 0 && targetIndex >= 0 && changedCells.has(`${sourceIndex}-${targetIndex}`);

      console.log(
        `Arête ${edge.source}->${edge.target}: isSolutionEdge=${isSolutionEdge}, isChangedEdge=${isChangedEdge}`
      );

      const edgeStyle: VisEdge = {
        id: edge.id || `${edge.source}-${edge.target}`,
        from: edge.source,
        to: edge.target,
        label: edge.label || "",
        arrows: { to: { enabled: true, type: "arrow" } },
        font: { size: 14, color: "#1B1B1B", face: "Roboto" },
        color: { color: "#2E86C1", highlight: "#1B6B93" },
        width: 2,
        dashes: false,
      };

      if (isChangedEdge) {
        return {
          ...edgeStyle,
          color: { color: "#FFA500", highlight: "#FF8C00" },
          dashes: [8, 4],
          width: 3,
        };
      } else if (isSolutionEdge) {
        return {
          ...edgeStyle,
          color: { color: "#FF0000", highlight: "#FF3333" },
          width: 4,
          dashes: false,
        };
      }

      return edgeStyle;
    });

    const data = {
      nodes: layoutedNodes.map((node) => {
        const isSolutionNode =
          showSolution &&
          solutionEdges.some((se) => se.source === node.id || se.target === node.id);

        const style = isSolutionNode ? solutionNodeStyle : defaultNodeStyle;

        return {
          id: node.id,
          label: node.label,
          x: node.x ?? 0,
          y: node.y ?? 0,
          shape: style.shape,
          size: style.size,
          borderWidth: style.borderWidth,
          borderWidthSelected: style.borderWidthSelected,
          color: style.color,
          font: style.font,
          shadow: style.shadow,
        };
      }),
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

    try {
      if (!networkRef.current) {
        networkRef.current = new Network(containerRef.current, data, options);
        networkRef.current.on("click", (params: { nodes: string[]; edges: string[] }) => {
          if (params.nodes.length > 0) {
            const nodeId = params.nodes[0];
            const node = layoutedNodes.find((n) => n.id === nodeId);
            if (node) onNodeSelect(node);
          } else if (params.edges.length > 0) {
            const edgeId = params.edges[0];
            const edge = visEdges.find((e) => e.id === edgeId);
            if (edge) onEdgeSelect({ id: edge.id, source: edge.from, target: edge.to, label: edge.label });
          }
        });
      } else {
        networkRef.current.setData(data);
        networkRef.current.fit();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du réseau vis-network:", error);
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