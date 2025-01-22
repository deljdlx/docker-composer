import { useQuery } from "@tanstack/react-query";


const fetchContainers = async () => {
  const response = await fetch("/containers/json?all=1", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des conteneurs");
  }

  return response.json();
};

export const ContainerList = () => {

  const interval = 5000;

  const { data, isLoading, error } = useQuery({
    queryKey: ["containers"],
    queryFn: fetchContainers,
    refetchInterval: interval,
  });


  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error.message}</div>;

  return (
    <div className="container_list_panel">



      <div className="container_list">
        {new Date().toLocaleTimeString()} Liste des Conteneurs
        <div role="tablist" className="tabs tabs-lifted ">
          <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="Running containers" />
          <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
              <ul>
                {data.map((container: any) => (
                  (container.State === 'running' && <li key={container.Id}>
                    {container.Names[0]}
                  </li>)
                ))}
              </ul>
          </div>

          <input
            type="radio"
            name="my_tabs_2"
            role="tab"
            className="tab"
            aria-label="Exited containers"
          />
          <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
            <ul>
              {data.map((container: any) => (
                (container.State === 'exited' && <li key={container.Id}>
                  {container.Names[0]} - {container.State}
                </li>)
              ))}
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
};
