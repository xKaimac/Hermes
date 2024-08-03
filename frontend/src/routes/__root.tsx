import { Outlet, createRootRoute, useLocation } from "@tanstack/react-router";
import AppLayout from "../components/layouts/AppLayout";

export const Route = createRootRoute({
  component: () => {
    const location = useLocation();
    const isLoginPage = location.pathname.toLowerCase() === "/login";
    const isUsernamePage = location.pathname.toLowerCase() === "/username";

    if (isLoginPage || isUsernamePage) {
      return <Outlet />;
    }

    return (
      <AppLayout>
        <Outlet />
      </AppLayout>
    );
  },
});
