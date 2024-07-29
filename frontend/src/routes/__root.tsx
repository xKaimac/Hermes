import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { NavBar } from "../components/navigation/navbar";

export const Route = createRootRoute({
  component: () => (
    <>
      <NavBar />
      <Outlet />
    </>
  ),
});
