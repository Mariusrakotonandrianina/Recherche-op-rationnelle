"use client";

import { useState, useEffect, useRef } from "react";

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

export function useGraphStorage() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const firstLoad = useRef(true);

  useEffect(() => {
    const savedNodes = JSON.parse(localStorage.getItem("graphNodes") || "[]");
    const savedEdges = JSON.parse(localStorage.getItem("graphEdges") || "[]");
    setNodes(savedNodes);
    setEdges(savedEdges);
  }, []);

  useEffect(() => {
    if (!firstLoad.current) {
      localStorage.setItem("graphNodes", JSON.stringify(nodes));
    }
  }, [nodes]);

  useEffect(() => {
    if (!firstLoad.current) {
      localStorage.setItem("graphEdges", JSON.stringify(edges));
    }
  }, [edges]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "graphNodes") {
        setNodes(JSON.parse(e.newValue || "[]"));
      } else if (e.key === "graphEdges") {
        setEdges(JSON.parse(e.newValue || "[]"));
      }
    };
    window.addEventListener("storage", handleStorageChange);
    firstLoad.current = false;
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return { nodes, setNodes, edges, setEdges };
}
