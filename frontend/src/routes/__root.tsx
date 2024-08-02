import { Outlet, createRootRoute, useLocation } from "@tanstack/react-router";
import { NavBar } from "../components/navigation/navbar";

export const Route = createRootRoute({
  component: () => {
    const location = useLocation();
    const isLoginPage = location.pathname === "/login";
    const isUsernamePage = location.pathname === "/Username";

    return (
      <>
        {!isLoginPage && !isUsernamePage && <NavBar />}
        <Outlet />
      </>
    );
  },
});
