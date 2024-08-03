import { Outlet, createRootRoute, useLocation } from "@tanstack/react-router";
import { NavBar } from "../components/navigation/navbar";

export const Route = createRootRoute({
  component: () => {
    const location = useLocation();
    const isLoginPage = location.pathname.toLowerCase() == "/login";
    const isUsernamePage = location.pathname.toLowerCase() === "/username";

    return (
      <>
        {!isLoginPage && !isUsernamePage && <NavBar />}
        <Outlet />
      </>
    );
  },
});
