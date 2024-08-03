import { createLazyFileRoute } from "@tanstack/react-router";
import Chat from "../components/chat/Chat";

export const Route = createLazyFileRoute("/")({
  component: () => <Chat />,
});
