import React, { useState, useCallback, useEffect } from "react";
import ReactFlow, { Controls, Background, applyNodeChanges, NodeChange, Node, Edge } from "reactflow";
import { useDockerComposerStore } from "../../stores/useDockerComposerStore";
import dagre from "dagre";
import "reactflow/dist/style.css";

// 🔹 Définition du type pour un service Docker Compose
interface Service {
  depends_on?: string[];
}

// 🔹 Définition du type d'un nœud ReactFlow
type DockerNode = Node<{ label: string }>;

// 🔹 Fonction pour générer un layout automatique avec `dagre`
const getLayoutedNodes = (nodes: DockerNode[], edges: Edge[], direction = "TB") => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 100,
    edgesep: 50,
    ranksep: 100 });
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // Ajouter les nœuds dans le graphe `dagre`
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 200, height: 50 });
  });

  // Ajouter les liens (edges) dans `dagre`
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  console.log('%cDockerComposerFlow.tsx :: 35 =============================', 'color: #f00; font-size: 1rem');
  console.log(edges);


  dagre.layout(dagreGraph);

  return nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: { x: nodeWithPosition.x, y: nodeWithPosition.y },
    };
  });
};

export const DockerComposerFlow: React.FC = () => {
  const { configuration } = useDockerComposerStore();
  const services: Record<string, Service> = configuration.services || {};

  // 🔹 Création des nœuds avec une position par défaut
  const initialNodes: DockerNode[] = Object.keys(services).map((serviceName) => ({
    id: serviceName,
    data: { label: serviceName },
    position: { x: 0, y: 0 }, // ✅ Ajout d'une position par défaut
  }));

  // 🔹 Création des liens entre services (depends_on)
  const initialEdges: Edge[] = Object.entries(services).flatMap(([serviceName, service]) =>
    (service.depends_on || []).map((dependency) => ({
      id: `e-${dependency}-${serviceName}`,
      source: dependency,
      target: serviceName,
      animated: true,
      style: { strokeWidth: 2 },
    }))
  );

  // 🔹 État des nœuds et edges avec layout automatique
  const [nodes, setNodes] = useState<DockerNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  useEffect(() => {
    // Générer la disposition automatique et mettre à jour les nœuds
    const layoutedNodes = getLayoutedNodes(initialNodes, initialEdges);
    setNodes(layoutedNodes);
  }, [configuration]); // Rafraîchir si les données changent

  // 🔹 Gérer le déplacement des nœuds
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        fitView
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};
