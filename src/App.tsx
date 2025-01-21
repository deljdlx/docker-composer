// import logo from './logo.svg';
import './App.css';

import { useDockerComposerStore } from "./stores/useDockerComposerStore";

import { MonacoEditor } from './components/MonacoEditor/MonacoEditor';
import { DockerComposerGraph } from './components/DockerComposerGraph/DockerComposerGraph';

function App() {

  const {
    content,
    parsedData,
  } = useDockerComposerStore(); // 🔥 Récupère le co


  return (
    <div className="App">

      <div>
        <div style={{
        }}>
          <MonacoEditor/>
        </div>
        <div>
         <DockerComposerGraph />
        </div>
      </div>


      <div style={{
        display: "none",
      }}>
        <pre
            style={{
              backgroundColor: "#282c34",
              textAlign: "left",
              color: "white",
              padding: "10px",
              borderRadius: "5px",
              overflowX: "auto",
              whiteSpace: "pre-wrap", // Permet le retour à la ligne
              wordBreak: "break-word",
              maxHeight: "300px", // Limite la hauteur pour éviter le débordement
            }}
          >
            {JSON.stringify(parsedData, null, 2)}
        </pre>
      </div>



      <div style={{
        display: "none",
      }}>
        <pre
            style={{
              backgroundColor: "#282c34",
              textAlign: "left",
              color: "white",
              padding: "10px",
              borderRadius: "5px",
              overflowX: "auto",
              whiteSpace: "pre-wrap", // Permet le retour à la ligne
              wordBreak: "break-word",
              maxHeight: "300px", // Limite la hauteur pour éviter le débordement
            }}
          >
            {content}
        </pre>
      </div>







    </div>
  );
}

export default App;
