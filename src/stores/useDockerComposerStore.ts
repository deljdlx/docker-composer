import { create } from "zustand";
import YAML from "yaml";

interface DockerComposerStore {
  content: string;
  setContent: (newContent: string) => void;

  selectedNode: any
  setSelectedNode: (node: any) => void;

  parsedData: any;

  selectedService: string;
  setSelectedService: (service: string) => void;



  parseYaml: () => void;


  updateConfiguration: (selectedNode: any, newConfiguration: string) => void;




}

export const useDockerComposerStore = create<DockerComposerStore>((set, get) => ({
  content: `version: '3.8'
services:
  web:
    image: nginx
    ports:
      - "80:80"
  db:
    image: mysql
    environment:
      MYSQL_ROOT_PASSWORD: example
    depends_on:
      - web
  `,
  parsedData: {},

  selectedNode: null,
  setSelectedNode: (node) => set((state) => {
    console.log("🛑 Zustand update triggered"); // 🔥 Vérifie si Zustand met à jour
    return { selectedNode: node };
  }),

  selectedService: "",
  setSelectedService: (service) => set({ selectedService: service }),

  //setSelectedNode: (node) => set({ selectedNode: node }),

  setContent: (newContent) => set({ content: newContent }),

  parseYaml: () => {
    try {
      const yamlData = YAML.parse(get().content);
      set({ parsedData: yamlData });
    } catch (error) {
      console.error("Erreur de parsing YAML:", error);
    }
  },


  updateConfiguration: (selectedNode, newConfiguration) => {
    // const yamlString = YAML.stringify(newConfiguration);
    //console.log(newConfiguration);

    const json = YAML.parse(newConfiguration);
    // const json = JSON.parse(newConfiguration);

    console.log(selectedNode);
    console.log(json);

    if(json) {
      const serviceId = selectedNode.id;

      // find the service in the parsedData
      const services = get().parsedData.services;

      if(services[serviceId]) {
        services[serviceId] = json;

        // create a deep copy of the services object

        const newParsedData = JSON.parse(JSON.stringify(get().parsedData));
        console.log('%cuseDockerComposerStore.ts :: 81 =============================', 'color: #f00; font-size: 1rem');
        console.log(newParsedData);


        set({ parsedData: newParsedData });

        try {
          const yml = YAML.stringify(get().parsedData)
          set({ content: yml });
        }
        catch (error) {
          console.error("Erreur de parsing YAML:", error);
        }
      }
    }
  }
}));
