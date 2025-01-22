import './App.css';
import "./assets/scss/main.scss";


import { useEffect, useState } from "react";

import { useDockerComposerStore } from "./stores/useDockerComposerStore";

import { MonacoEditor } from './components/MonacoEditor/MonacoEditor';
import { DockerComposerGraph } from './components/DockerComposerGraph/DockerComposerGraph';


import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";


import {  usePanelStore } from "./stores/usePanelStore";



import {TestButton} from './components/TestButton/TestButton';


import Modal from 'react-modal';

import { NodeInfoPopup } from './components/NodeInfoPopup/NodeInfoPopup';

import { ContainerList } from './components/ContainerList/ContainerList';

// import { DockerComposerFlow } from './components/DockerComposerFlow/DockerComposerFlow';


Modal.setAppElement("#root")


function App() {

  const {
    selectedService,
  } = useDockerComposerStore();

  const [selectedNode, setSelectedNode] = useState<any>(null);


  const {
    leftPanelSize,
    rightPanelSize,
    setSizes
  } = usePanelStore();


  useEffect(() => {
    console.log('%cApp.tsx :: 33 =============================', 'color: #f00; font-size: 1rem');
    console.log('APP RENDER');
  });



  let resizeTimeout: NodeJS.Timeout | null = null;

  const handleResize = (sizes: number[]) => {
    if (resizeTimeout) clearTimeout(resizeTimeout);

    resizeTimeout = setTimeout(() => {
      setSizes({ leftPanelSize: sizes[0], rightPanelSize: sizes[1] });
    }, 300);
  };

  const handleNodeClick = (node: any) => {
    console.log('%cApp.tsx :: 53 =============================', 'color: #f00; font-size: 1rem');
    console.log(node);
    setSelectedNode(node);
  }


  return (
    <div className="App">
      <NodeInfoPopup/>
      <div className="header">HEADER {selectedService}</div>
      <div style={{ height: "100vh", width: "100vw" }}>
        <PanelGroup
          direction="horizontal"
          onLayout={(sizes) =>
            handleResize(sizes)
          }
        >
          <Panel defaultSize={leftPanelSize}>
            <div className="monaco_editor_container">
              <MonacoEditor/>
            </div>
          </Panel>
          <PanelResizeHandle className="w-2 bg-blue-800"/>
          <Panel defaultSize={rightPanelSize}>
            <DockerComposerGraph
              onNodeClick={(node) => handleNodeClick(node)}
            />


            {/* <ContainerList/> */}

          </Panel>
        </PanelGroup>
      </div>


        {/* <div>
          <DockerComposerFlow />
        </div> */}
    </div>
  );
}

export default App;
