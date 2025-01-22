import React, { useRef } from "react";
import Editor from "@monaco-editor/react";
import YAML from "yaml";

import { useDockerComposerStore } from "../../stores/useDockerComposerStore";
import { usePanelStore } from "../../stores/usePanelStore";

export const MonacoEditor: React.FC = () => {
  const {
    content,
    setContent,
    parseYaml,
    setSelectedService,
  } = useDockerComposerStore();

  const handleChange = (value: string) => {
    setContent(value);
    parseYaml();
  };

  // used to resize the editor
  const { leftPanelSize } = usePanelStore();


  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
      editorRef.current = editor;


      console.log('%cNodeInfoPopup.tsx :: 39 =============================', 'color: #f00; font-size: 1rem');
      console.log(editor);

      // Écouter les clics sur le code
      editor.onMouseDown((event: any) => {
      if (event.target && event.target.position) {
          const lineNumber = event.target.position.lineNumber;
          console.log("Ligne cliquée :", lineNumber);

          // 🔥 Exécuter une action spécifique selon la ligne
          // handleLineClick(lineNumber);

          detectServiceFromLine(lineNumber);
      }
      });
  };

  const handleLineClick = (line: number) => {
      alert(`Ligne ${line} cliquée !`);
  };




   // 🔥 Fonction pour récupérer le service en fonction de la ligne cliquée
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

      if (foundService) {
        console.log('%cMonacoEditor.tsx :: 90 =============================', 'color: #f00; font-size: 1rem');
        console.log(foundService);
        setSelectedService(foundService);
        return;
      }

      setSelectedService("");
    }
  };





  return (


    <div className="monaco_editor_wrapper"
        data-size={leftPanelSize}
    >
      <Editor
        height="100%"
        defaultLanguage="yaml"
        value={content}
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

