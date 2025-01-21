import React from "react";
import Editor from "@monaco-editor/react";
import { useDockerComposerStore } from "../../stores/useDockerComposerStore";

export const MonacoEditor: React.FC = () => {
  const { content, setContent, parseYaml } = useDockerComposerStore();

  return (
    <div>
      <Editor
        height="300px"
        defaultLanguage="yaml"
        value={content}
        onChange={(value) => setContent(value || "")}
        theme="vs-dark"  // 🌙 Mode sombre + coloration syntaxique
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: "on", // Retour à la ligne auto
          tabSize: 2,
        }}
      />
      <button
        onClick={parseYaml}
        style={{ marginTop: "10px", padding: "8px" }}
        className="btn btn-primary"
    >
        Convertir en JSON
      </button>
    </div>
  );
};

