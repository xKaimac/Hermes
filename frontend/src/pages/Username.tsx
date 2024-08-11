import { useState } from "react";
import { Button, TextInput } from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import BackgroundWithAnimation from "../components/layouts/BackgroundAnimation";

const Username = () => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { data: userData, isLoading: userLoading } = useQuery({
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
  });

  const updateUsername = useMutation({
    mutationFn: async (newUsername) => {
      console.log(newUsername);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/protected/user/set-username`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: newUsername,
            userId: userData.user.id,
          }),
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    onSuccess: (data) => {
      if (data === true) {
        navigate({ to: "/" });
      } else {
        setError("Username is not available. Please try another.");
      }
    },
    onError: () => {
      setError("Something went wrong. Please try again.");
    },
  });

  const handleSubmit = (error: React.FormEvent<HTMLFormElement>) => {
    error.preventDefault();
    setError("");
    updateUsername.mutate(username);
  };

  if (userLoading) {
    return <h3>Loading...</h3>;
  }

  if (!userData?.isAuthenticated) {
    navigate({ to: "/login" });
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-200">
      <BackgroundWithAnimation />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
        <div className="text-center bg-surface-light dark:bg-surface-dark p-8 rounded-xl shadow-lg w-4/5 md:w-1/2 transition-colors duration-200">
          <h1 className="text-2xl font-bold mb-4 text-text-light-primary dark:text-text-dark-primary">
            It looks like you're new here!
          </h1>
          <p className="text-lg mb-6 text-text-light-secondary dark:text-text-dark-secondary">
            What should we know you by?
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextInput
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter new username"
              required
            />
            {error && <p className="text-red-500 dark:text-red-400">{error}</p>}
            <Button
              type="submit"
              loading={updateUsername.isPending}
              fullWidth
              className="bg-primary hover:bg-primary-light dark:bg-primary-dark dark:hover:bg-primary text-text-dark-primary"
            >
              Let's go!
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Username;
