import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Outlet } from "@tanstack/react-router";
export default function App() {
    return (_jsx(_Fragment, { children: _jsx("div", { children: _jsx(Outlet, {}) }) }));
}
