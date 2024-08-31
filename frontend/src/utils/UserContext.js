import { jsx as _jsx } from "react/jsx-runtime";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext } from "react";
const UserContext = createContext(undefined);
export const UserProvider = ({ children }) => {
    const queryClient = useQueryClient();
    const { data: userData, isLoading, error, } = useQuery({
        queryKey: ["userStatus"],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/status`, {
                credentials: "include",
            });
            if (!response.ok)
                throw new Error("Failed to fetch user status");
            return response.json();
        },
        staleTime: 5 * 60 * 1000,
        retry: false,
    });
    const updateUserData = (newData) => {
        queryClient.setQueryData(["userStatus"], (oldData) => {
            if (!oldData)
                return oldData;
            return {
                ...oldData,
                user: { ...oldData.user, ...newData },
            };
        });
    };
    return (_jsx(UserContext.Provider, { value: { userData, isLoading, error, updateUserData }, children: children }));
};
export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
