import React, { useRef } from "react";
import Editor from "@monaco-editor/react";
import YAML from "yaml";

import { useDockerComposerStore } from "../../stores/useDockerComposerStore";
import { usePanelStore } from "../../stores/usePanelStore";

export const MonacoEditor: React.FC = () => {
  const {
    configuration,
    setConfigurationByYaml,
    setSelectedServiceById,
  } = useDockerComposerStore();

  const handleChange = (value: string) => {
    setConfigurationByYaml(value);
  };

  // used to resize the editor
  const { leftPanelSize } = usePanelStore();


  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
      editorRef.current = editor;

      // listen for line clicks
      editor.onMouseDown((event: any) => {
        if (event.target && event.target.position) {
            const lineNumber = event.target.position.lineNumber;
            console.log("Click on line:", lineNumber);
            detectServiceFromLine(lineNumber);
        }
      });
  };

   const detectServiceFromLine = (line: number) => {
    if (!editorRef.current) {
        return;
    }

    const model = editorRef.current.getModel();
    const content = model.getValue();
    const yamlData = YAML.parse(content);


    if (yamlData.services) {
      const services = Object.keys(yamlData.services);

      const lines = content.split("\n");

      let maxLength = Infinity;
      let foundService = null;

      for (const service of services) {
        const serviceLine = lines.findIndex((lineText: string) => lineText.trim().startsWith(service + ":")) + 1;

        if (serviceLine === line) {
          foundService = service;
          break;
        }

        const length = line - serviceLine;
        if (length >=  0 && length < maxLength) {
          maxLength = length;
          foundService = service;
        }
      }

      if(foundService) {
        console.log('%cMonacoEditor.tsx::72::', 'color: #f00; font-size: 1rem', foundService);
        setSelectedServiceById(foundService);
        return;
      }

      setSelectedServiceById("");
    }
  };





  return (


    <div className="monaco_editor_wrapper"
        data-size={leftPanelSize}
    >
      <Editor
        height="100%"
        defaultLanguage="yaml"
        value={configuration.yaml}
        onChange={(value) => handleChange(value || "")}
        onMount={handleEditorDidMount}
        theme="vs-dark"  // 🌙 Mode sombre + coloration syntaxique
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: "on", // Retour à la ligne auto
          tabSize: 2,
        }}
      />


      {/* <button
        onClick={parseYaml}
        style={{ marginTop: "10px", padding: "8px" }}
        className="btn btn-primary"
    >
        Convertir en JSON
      </button> */}
    </div>
  );
};

