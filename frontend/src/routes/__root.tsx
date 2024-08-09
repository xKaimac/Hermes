import {
  Navigate,
  Outlet,
  createRootRoute,
  useLocation,
} from "@tanstack/react-router";
import AppLayout from "../components/layouts/AppLayout";
import { useUser } from "../utils/UserContext";

export const Route = createRootRoute({
  component: () => {
    const location = useLocation();
    const isLoginPage = location.pathname.toLowerCase() === "/login";
    const isUsernamePage = location.pathname.toLowerCase() === "/username";
    const { userData, isLoading } = useUser();

    if (isLoading) {
      return <div> loading... </div>;
    }

    if (!userData && !isLoginPage) {
      console.log("leaving........");
      return <Navigate to="/login" />;
    }

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
