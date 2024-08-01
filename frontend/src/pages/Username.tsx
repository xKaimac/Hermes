import { useState } from "react";
import { Button, TextInput, Text } from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

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
        `${import.meta.env.VITE_BACKEND_URL}/user/username`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: newUsername,
            email: userData.user.email,
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    updateUsername.mutate(username);
  };

  if (userLoading) {
    return <Text>Loading...</Text>;
  }

  if (!userData?.isAuthenticated) {
    navigate({ to: "/login" });
    return null;
  }

  return (
    <form onSubmit={handleSubmit}>
      <Text>Update your username!</Text>
      <TextInput
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter new username"
        required
      />
      {error && <Text className="color-red">{error}</Text>}
      <Button type="submit" loading={updateUsername.isPending}>
        Submit
      </Button>
    </form>
  );
};

export default Username;
