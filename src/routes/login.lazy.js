import { jsx as _jsx } from "react/jsx-runtime";
import { createLazyFileRoute } from "@tanstack/react-router";
import Login from "../pages/Login";
export const Route = createLazyFileRoute("/login")({
    component: () => _jsx(Login, {}),
});
