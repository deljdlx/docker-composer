import { create } from "zustand";
import YAML from "yaml";


import { DockerComposeConfiguration } from "../types/DockerComposeConfiguration";
import { DockerComposeService } from "../types/DockerComposeService";

interface DockerComposerStore {
  configuration: DockerComposeConfiguration;
  setConfiguration: (newConfiguration: DockerComposeConfiguration) => void;
  setConfigurationByYaml: (yaml: string) => void;

  selectedNode: any
  setSelectedNode: (node: any) => void;

  // parsedData: any;

  selectedService: DockerComposeService | null;
  setSelectedServiceById: (service: string) => void;

  updateConfiguration: (selectedNode: any, newConfiguration: string) => void;
}

export const useDockerComposerStore = create<DockerComposerStore>((set, get) => ({

  configuration: new DockerComposeConfiguration(),

  setConfiguration: (newConfiguration: DockerComposeConfiguration) => {
    set({ configuration: newConfiguration });
  },

  setConfigurationByYaml: (yaml: string) => {
    const newConfiguration = new DockerComposeConfiguration(yaml);
    set({ configuration: newConfiguration });
  },


  selectedNode: null,
  // setSelectedNode: (node) => set((state) => {
  //   console.log("🛑 Zustand update triggered"); // 🔥 Vérifie si Zustand met à jour
  //   return { selectedNode: node };
  // }),

  setSelectedNode: (node) => {
    set({ selectedNode: node });
    console.log('%cuseDockerComposerStore.ts::45', 'color: #f00; font-size: 1rem', node);
  },

  selectedService: null,
  setSelectedServiceById: (serviceId) => {
    const selectedService = get().configuration.getServiceById(serviceId);
    console.log('%cuseDockerComposerStore.ts::52', 'color: #f00; font-size: 1rem', selectedService);
    if(selectedService) {
      set({ selectedService: selectedService });
    }
  },




  updateConfiguration: (selectedNode, serviceConfiguration) => {
    const json = YAML.parse(serviceConfiguration);
    if(json) {
      const serviceId = selectedNode.id;

      const newConfiguration = new DockerComposeConfiguration(
        get().configuration.yaml
      );

      newConfiguration.setService(serviceId, json);
      set({ configuration: newConfiguration });
    }
  }
}));
