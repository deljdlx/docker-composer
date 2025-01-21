import React from "react";
import ReactECharts from "echarts-for-react";
import { useDockerComposerStore } from "../../stores/useDockerComposerStore";

export const DockerComposerGraph: React.FC = () => {
  const { parsedData } = useDockerComposerStore();
  const services = parsedData.services || {};
  const volumes = parsedData.volumes || {};

  const nodes: { id: string; name: string; category: number }[] = [];
  const links: {
    source: string;
    target: string;
    symbol?: string[];
  }[] = [];

  // 🔹 Générer les nœuds des services et leurs relations
  Object.keys(services).forEach((serviceName, index) => {
    const service = services[serviceName];

    nodes.push({
      id: serviceName,
      name: serviceName,
      category: 0, // Catégorie "Service"
    });

    if (service.depends_on) {
      service.depends_on.forEach((dependency: string) => {
        links.push({
          source: serviceName,
          target: dependency,
        });
      });
    }

    // 🔹 Ajout des volumes utilisés par chaque service
    if (service.volumes) {
      service.volumes.forEach((volume: string) => {
        const volumeName = volume.split(":")[0]; // Extraire le nom du volume

        // Vérifier si le volume est déjà ajouté
        if (!nodes.find((n) => n.id === volumeName)) {
          nodes.push({
            id: volumeName,
            name: volumeName,
            category: 1, // Catégorie "Volume"
          });
        }

        // Lien entre le service et son volume
        links.push({
          source: serviceName,
          target: volumeName,
          symbol: ["none", "arrow"],
        });
      });
    }
  });

  const options = {
    tooltip: {
      trigger: "item",
      formatter: (params: any) => {
        if (params.dataType === "edge") {
          return `💡 <b>${params.data.source}</b> depends on <b>${params.data.target}</b>`;
        }
        return params.data.name;
      },
    },
    legend: [{ data: ["Services", "Volumes"] }],
    series: [
      {

        edgeSymbol: ["none", "arrow"], // 🔥 Définit les flèches pour tous les liens
        edgeSymbolSize: 10, // 🔹 Taille de la flèche

        type: "graph",
        layout: "force",
        force: {
          edgeLength: 5,
          repulsion: 200,
          gravity: 0.1
        },
        roam: true,
        draggable: true,
        label: {
          show: true,
          color: "#aaa",
        },
        data: nodes.map((node) => ({
          id: node.id,
          name: node.name,
          category: node.category,
          symbolSize: node.category === 0 ? 20 : 10, // Taille différente pour services et volumes
        })),
        links: links,
        categories: [
          { name: "Services", itemStyle: { color: "#3498db" } },
          { name: "Volumes", itemStyle: { color: "#f39c12" } },
        ],
        lineStyle: {
          color: "source",
          // curveness: 0.3,
          width: 3,
        },
      },
    ],
  };

  return <ReactECharts option={options} style={{ height: "500px" }} />;
};
