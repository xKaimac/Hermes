import { jsx as _jsx } from "react/jsx-runtime";
import { createLazyFileRoute } from "@tanstack/react-router";
import Username from "../pages/Username";
export const Route = createLazyFileRoute("/username")({
    component: () => _jsx(Username, {}),
});
