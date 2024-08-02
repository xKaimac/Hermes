import "@mantine/core/styles.css";
import "./styles/index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { routeTree } from "./routeTree.gen";
import { MantineProvider } from "@mantine/core";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const router = createRouter({ routeTree });
const queryClient = new QueryClient();

function App() {
  return (
    <MantineProvider
      defaultColorScheme="light"
      theme={{
        fontFamily: "Dosis, sans-serif",
        headings: { fontFamily: "Dosis, sans-serif" },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </MantineProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
