import React from "react";
import App from "./App";
import AlertsContextProvider from "./context/AlertsContext";
import MiniPagesContextProvider from "./context/MiniPagesContext";
import UserContextProvider from "./context/UserContext";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "react-query";
import { createRoot } from "react-dom/client";
import ComponentCommunicationContextProvider from "@/context/ComponentCommunicationContext.jsx";

const queryClient = new QueryClient({
  defaultOptions: { queries: { networkMode: "offlineFirst" } },
});

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  // <React.StrictMode>
  <AlertsContextProvider>
    <MiniPagesContextProvider>
      <UserContextProvider>
        <ComponentCommunicationContextProvider>
          <BrowserRouter>
            <QueryClientProvider client={queryClient}>
              <App />
            </QueryClientProvider>
          </BrowserRouter>
        </ComponentCommunicationContextProvider>
      </UserContextProvider>
    </MiniPagesContextProvider>
  </AlertsContextProvider>,
  // </React.StrictMode>
);
