import { create } from "zustand";
import YAML from "yaml";

interface DockerComposerStore {
  content: string;
  parsedData: any;
  setContent: (newContent: string) => void;
  parseYaml: () => void;
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

  setContent: (newContent) => set({ content: newContent }),

  parseYaml: () => {
    try {
      const yamlData = YAML.parse(get().content);
      set({ parsedData: yamlData });
    } catch (error) {
      console.error("Erreur de parsing YAML:", error);
    }
  },
}));
