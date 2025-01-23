import './App.css';
import "./assets/scss/main.scss";


import { useEffect, useState } from "react";

import { useDockerComposerStore } from "./stores/useDockerComposerStore";

import { MonacoEditor } from './components/MonacoEditor/MonacoEditor';
import { DockerComposerGraph } from './components/DockerComposerGraph/DockerComposerGraph';


import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";


import {  usePanelStore } from "./stores/usePanelStore";


import Modal from 'react-modal';

import { NodeInfoPopup } from './components/NodeInfoPopup/NodeInfoPopup';

// import { ContainerList } from './components/ContainerList/ContainerList';
// import Box from '@mui/material/Box';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { TimeClock } from '@mui/x-date-pickers/TimeClock';




// import { DockerComposerFlow } from './components/DockerComposerFlow/DockerComposerFlow';


console.clear();

Modal.setAppElement("#root")






function App() {

  const {
    selectedService,
    setConfigurationByYaml,
  } = useDockerComposerStore();

  const {
    leftPanelSize,
    rightPanelSize,
    setSizes
  } = usePanelStore();

  const [selectedNode, setSelectedNode] = useState<any>(null);


  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/demos/00.yml');
      const yaml = await response.text();
      setConfigurationByYaml(yaml);
    };
    fetchData();
  }, []);


  useEffect(() => {
    console.log('%cApp.tsx::71', 'color: #f00; font-size: 1rem', 'RENDER APP');
  });



  let resizeTimeout: NodeJS.Timeout | null = null;

  const handleResize = (sizes: number[]) => {
    if (resizeTimeout) clearTimeout(resizeTimeout);

    resizeTimeout = setTimeout(() => {
      setSizes({ leftPanelSize: sizes[0], rightPanelSize: sizes[1] });
    }, 300);
  };

  const handleNodeClick = (node: any) => {
    console.log('%cApp.tsx::87::node clicked', 'color: #f00; font-size: 1rem', node);
    setSelectedNode(node);
  }


  return (
    <div className="App">
      <NodeInfoPopup/>
      <div className="header">HEADER {selectedService?.id || ""}</div>
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
