import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate, Outlet, createRootRoute, useLocation, } from "@tanstack/react-router";
import AppLayout from "../components/layouts/AppLayout";
import { useUser } from "../utils/UserContext";
export const Route = createRootRoute({
    component: () => {
        const location = useLocation();
        const isLoginPage = location.pathname.toLowerCase() === "/login";
        const isUsernamePage = location.pathname.toLowerCase() === "/username";
        const { userData, isLoading } = useUser();
        if (isLoading) {
            return _jsx("div", { children: " loading... " });
        }
        if (!userData && !isLoginPage) {
            console.log("leaving........");
            return _jsx(Navigate, { to: "/login" });
        }
        if (isLoginPage || isUsernamePage) {
            return _jsx(Outlet, {});
        }
        return (_jsx(AppLayout, { children: _jsx(Outlet, {}) }));
    },
});
