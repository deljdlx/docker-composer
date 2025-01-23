import React, { useState, useRef } from 'react';
import { useDockerComposerStore } from "../../stores/useDockerComposerStore";

import Modal from 'react-modal';
import Editor from "@monaco-editor/react";
import YAML from "yaml";

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

export const NodeInfoPopup: React.FC = () => {
    const {
        configuration,
        selectedNode,
        setSelectedNode,
        updateConfiguration,
    } = useDockerComposerStore();


    const [newConfiguration, setNewConfiguration] = useState<string>("");
    // const content: string = JSON.stringify(selectedNode?.data, null, 2);
    const content: string = selectedNode?.service.getYaml();

    const closeModal = () => {
        setSelectedNode(null);
    }

    const commitChange = () => {
        updateConfiguration(selectedNode, newConfiguration);
        setSelectedNode(null);
    };

    return (
      <Modal
        isOpen={!!selectedNode}
        onRequestClose={closeModal}
        contentLabel="Informations du Service"
        style={{
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
          content: {
            maxWidth: "90vw",
            margin: "auto",
            padding: "20px",
            borderRadius: "10px",
            background: "#2c3e50",
            color: "#ecf0f1",
            boxShadow: "0px 0px 15px rgba(0,0,0,0.3)",
          },
        }}
      >



        <Tabs>
            <TabList>
            <Tab>Informations</Tab>
            <Tab>Title 2</Tab>
            </TabList>

            <TabPanel>
                <h2>Service ID : {selectedNode?.id}</h2>
                <p><b>Depends On:</b> {selectedNode?.data?.depends_on?.join(", ") || "None"}</p>
                <p><b>Volumes:</b> {selectedNode?.data?.volumes?.join(", ") || "None"}</p>

                <div>
                    <Editor
                        height="70vh"
                        defaultLanguage="yaml"
                        value = {content}
                        // onMount={handleEditorDidMount}
                        onChange={(value) => setNewConfiguration(value ?? "")}
                        // value={JSON.stringify(selectedNode?.data, null, 2)}
                        // onChange={(value) => handleChange(value || "", )}
                        theme="vs-dark"  // 🌙 Mode sombre + coloration syntaxique
                        options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        wordWrap: "on", // Retour à la ligne auto
                        tabSize: 2,
                        }}
                    />
                </div>
            </TabPanel>
            <TabPanel>
            <h2>Any content 2</h2>
            </TabPanel>
        </Tabs>



        <div className="flex justify-between gap-1">
            <button
                onClick={commitChange}
                style={{
                    background: "#00aa33",
                    color: "#fff",
                    padding: "10px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginTop: "10px",
                    width: "100%",
                }}
            >Enregistrer</button>

            <button
                onClick={closeModal}
                style={{
                    background: "#e74c3c",
                    color: "#fff",
                    padding: "10px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginTop: "10px",
                    width: "100%",
                }}
            >Fermer</button>
        </div>






{/*     kept for future enhancement
        <div>
            {
                Object.keys(parsedData.services).map((serviceName) => {
                    const service = parsedData.services[serviceName];
                    return (
                        <div key={serviceName}>
                            <label>
                                {serviceName}
                                <input
                                    checked={selectedNode?.data?.depends_on?.includes(serviceName)}
                                    type="checkbox"
                                    className="checkbox checkbox-primary"
                                />
                            </label>
                        </div>
                    );

                })
            }
        </div> */}






      </Modal>

    );
};