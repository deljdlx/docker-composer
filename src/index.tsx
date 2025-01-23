import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";

const queryClient = new QueryClient();





declare global {
  interface Window {
      console: {
          _log: (message?: any, ...optionalParams: any[]) => void;
          log: (message?: any, ...optionalParams: any[]) => void;
      };
  }
}


window.console._log = window.console.log;

window.console.log = function(message?: any, ...optionalParams: any[]) {
  window.console._log(message, ...optionalParams);
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
