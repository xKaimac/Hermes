import { createContext, useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type AppLayoutProps = {
  children: JSX.Element;
};

const UserContext = createContext(undefined);

export const UserProvider = ({ children }: AppLayoutProps) => {
  const queryClient = useQueryClient();

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
    staleTime: 5 * 60 * 1000,
  });

  const updateUserData = (newData: Partial<any>) => {
    queryClient.setQueryData(["userStatus"], (oldData: any) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        user: { ...oldData.user, ...newData },
      };
    });
  };

  return (
    <UserContext.Provider
      value={{ userData, isLoading, error, updateUserData }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
