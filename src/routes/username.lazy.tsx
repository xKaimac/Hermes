import { createLazyFileRoute } from "@tanstack/react-router";
import Username from "../pages/Username";

export const Route = createLazyFileRoute("/username")({
  component: () => <Username />,
});
