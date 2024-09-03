import { jsx as _jsx } from "react/jsx-runtime";
import "@mantine/core/styles.css";
import "./styles/index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { routeTree } from "./routeTree.gen";
import { MantineProvider } from "@mantine/core";
import { UserProvider } from "./utils/UserContext";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const router = createRouter({ routeTree });
const queryClient = new QueryClient();
function App() {
    return (_jsx(MantineProvider, { defaultColorScheme: "light", theme: {
            fontFamily: "Dosis, sans-serif",
            headings: { fontFamily: "Dosis, sans-serif" },
        }, children: _jsx(QueryClientProvider, { client: queryClient, children: _jsx(UserProvider, { children: _jsx(RouterProvider, { router: router }) }) }) }));
}
ReactDOM.createRoot(document.getElementById("root")).render(_jsx(React.StrictMode, { children: _jsx(App, {}) }));
