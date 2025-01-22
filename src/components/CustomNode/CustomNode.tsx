import React from "react";
import { Handle, Position, NodeProps } from "reactflow";

export const CustomNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <div style={{ padding: 10, borderRadius: 5, backgroundColor: "#3498db", color: "#fff", textAlign: "center" }}>
      {data.label}

      {/* Ports d'entrée (haut et gauche) */}
      <Handle type="target" position={Position.Top} style={{ background: "red" }} />
      <Handle type="target" position={Position.Left} style={{ background: "red" }} />

      {/* Ports de sortie (bas et droite) */}
      <Handle type="source" position={Position.Right} style={{ background: "green" }} />
      <Handle type="source" position={Position.Bottom} style={{ background: "green" }} />
    </div>
  );
};

