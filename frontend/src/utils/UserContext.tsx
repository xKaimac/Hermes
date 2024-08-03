// UserContext.js
import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";

type AppLayoutProps = {
  children: JSX.Element;
};

const UserContext = createContext();

export const UserProvider = ({ children }: AppLayoutProps) => {
  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userStatus"],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/status`,
        {
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user status");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });

  return (
    <UserContext.Provider value={{ userData, isLoading, error }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
