import React, { useRef, useEffect, useMemo, useState, useCallback } from "react";
import ReactECharts from "echarts-for-react";

import { useDockerComposerStore } from "../../stores/useDockerComposerStore";


type DockerComposerGraphProps = {
  onNodeClick?: (node: any) => void;
};

export const DockerComposerGraph: React.FC<DockerComposerGraphProps> = ({
  onNodeClick,
}) => {


  // const {doNothing, setSelectedNode, parsedData } = useDockerComposerStore();
  const { parsedData, content } = useDockerComposerStore();
  // const setSelectedNode = useDockerComposerStore((state) => state.setSelectedNode);

  // const parsedData = useDockerComposerStore.getState().parsedData;
  const setSelectedNode = useDockerComposerStore.getState().setSelectedNode;

  const services = parsedData.services || {};
  const chartRef = useRef<any>(null);


  const categoriesColors = [
    "#3498db",
    "#3498db",
    "#f39c12",
    "#2eac31",
    "#e74c3c",
    "#9b59b6",
    "#34495e",
    "#1abc9c",
    "#f1c40f",
    "#d35400",
    "#7f8c8d",
  ];

  const nodes: {
    id: string;
    name: string;
    category: number;
    dependsOnCount ?: number;
    data ?: any;
  }[] = [];

  const links: {
    source: string;
    target: string;
    symbol?: string[];
  }[] = [];

  const dependsOnCount: Record<string, number> = {};

  const categories: {
    name: string;
    itemStyle: {
      color: string
      borderColor ?: string
      borderWidth ?: number
    };
  }[] = [
    { name: "Service", itemStyle: { color: "#ff00ff"}},
    { name: "Volumes", itemStyle: { color: "#aaaaaa"}},
    { name: "Shared Volumes", itemStyle: { color: "#aaaaaa", borderColor: "#ff0000", borderWidth: 1  }},
  ];


  // ==========================================================

  useEffect(() => {
    console.log('%cDockerComposerGraph.tsx :: 67 =============================', 'color: #f00; font-size: 1rem');
    console.log("RENDER");
  });


  //================================================================

  // 🔹 Générer les nœuds des services et leurs relations
  Object.keys(services).forEach((serviceName) => {
    const service = services[serviceName];


    // extract categories from labels
    let categoryIndex = 0;
    if(service.labels) {
      service.labels.forEach((label: string) => {
        if(label.startsWith('docker-composer.category=')) {
          const categoryName = label.split('=')[1];
          if(!categories.find((c) => c.name === categoryName)) {
            categories.push({
              name: categoryName,
              itemStyle: {
                color: categoriesColors[categories.length % categoriesColors.length],
              }
            });
          }
          categoryIndex = categories.findIndex((c) => c.name === categoryName);
        }
      });
    }


    nodes.push({
      id: serviceName,
      name: serviceName,
      category: categoryIndex,
      data: service,
    });

    if (service.depends_on) {
      service.depends_on.forEach((dependency: string) => {
        links.push({
          source: serviceName,
          target: dependency,
        });

        dependsOnCount[dependency] = (dependsOnCount[dependency] || 0) + 1;
      });
    }

    // handle service volumes
    if (service.volumes) {
      service.volumes.forEach((volume: string) => {
        const volumeName = volume.split(":")[0];

        // Vérifier si le volume est déjà ajouté
        if (!nodes.find((n) => n.id === volumeName)) {


          // check if volume is a shared volume
          let categoryIndex = 1;
          if(volume.startsWith('.') || volume.startsWith('/')) {
            categoryIndex = 2;
          }

          nodes.push({
            id: volumeName,
            name: volumeName,
            category: categoryIndex,
          });
        }

        // link service to volume
        links.push({
          source: serviceName,
          target: volumeName,
          symbol: ["none", "arrow"],
        });
      });
    }
  });

  Object.keys(dependsOnCount).forEach((serviceName) => {
    const count = dependsOnCount[serviceName];
    const node = nodes.find((n) => n.id === serviceName);
    if (node) {
      node.dependsOnCount = count;
    }
  });

  const handleGraphClick = useCallback((params: any) => {
    console.log('%cDockerComposerGraph.tsx :: 165 =============================', 'color: #f00; font-size: 1rem');
    console.log(params);
    if(onNodeClick) {
      const node = nodes.find((n) => n.id === params.name);
      if(node) {
        setSelectedNode(node);
        onNodeClick(node);
      }
    }

  }, [services]); // ✅ Ne change pas entre chaque render

  // ==========================================================

  const options ={
    tooltip: {
      trigger: "item",
      formatter: (params: any) => {
        if (params.dataType === "edge") {
          return `💡 <b>${params.data.source}</b> depends on <b>${params.data.target}</b>`;
        }
        return params.data.name;
      },
    },
    legend: [{
      data: categories.map((c) => c.name),
      textStyle: {
        color: "#FFFF00",
        fontSize: 14,
        // fontWeight: "bold",
        // fontFamily: "Arial",
      },
      selected: {
        "Volumes": false,
        "Shared Volumes": false,
      }
    }],
    series: [
      {
        edgeSymbol: ["none", "arrow"], // 🔥 Définit les flèches pour tous les liens
        edgeSymbolSize: 10, // 🔹 Taille de la flèche

        type: "graph",
        layout: "force",
        force: {
          edgeLength: [30, 40],
          repulsion: 100,
          gravity: 0.1
        },
        roam: true,
        draggable: true,
        label: {
          show: true,
          fontSize: 12,
          color: "#ccc",
          // fontWeight: "bold",
          // fontFamily: "Arial",
        },
        data: nodes.map((node) => ({
          id: node.id,
          name: node.name,
          category: node.category,
          symbolSize: 20 + (node.dependsOnCount || 0) * 5,
          data: node.data,

        })),
        links: links,
        categories: categories,
        lineStyle: {
          color: "source",
          // curveness: 0.3,
          width: 3,
        },
      },
    ],
  };

  return (
    <>
      <ReactECharts
        ref={chartRef}
        className="docker_composer_graph"
        option={options}
        style={{
          height: "100vh",
          width: "100%"
        }}
        onEvents={{
          click: handleGraphClick
        }}
      />
    </>
  );
};
