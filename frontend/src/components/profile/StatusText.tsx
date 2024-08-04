import { useUser } from "../../utils/UserContext";
import { Textarea } from "@mantine/core";
import { FaArrowCircleRight } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";

interface UploadData {
  userStatus: string;
  userId: string;
}

const StatusText = () => {
  const { userData, updateUserData } = useUser();

  const userId = userData.user.id;
  let userStatus = userData.user.status_text;

  const updateStatusText = async ({ userStatus, userId }: UploadData) => {
    const formData = new FormData();
    formData.append("userStatus", userStatus);
    formData.append("userId", userId);

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/user/update-status-text`,
      {
        method: "POST",
        body: formData,
        credentials: "include",
      }
    );
    if (!response.ok) {
      throw new Error("Upload failed");
    }
    return response.json();
  };

  const mutation = useMutation({
    mutationFn: updateStatusText,
    onSuccess: (data) => {
      updateUserData({ status_text: data.result.status_text });
    },
  });

  const handleClick = () => {
    mutation.mutate({ userStatus, userId: userId });
  };

  const handleOnChange = (event: any) => {
    userStatus = event.target.value;
  };

  const EnterComponent = () => {
    return (
      <button onClick={handleClick}>
        <FaArrowCircleRight />
      </button>
    );
  };

  return (
    <div className="w-3/4 lg:w-1/2 xl:w-1/3 pt-5">
      <Textarea
        radius="xl"
        maxLength={255}
        autosize
        minRows={1}
        maxRows={8}
        defaultValue={userData.user.status_text}
        rightSection={<EnterComponent />}
        onChange={handleOnChange}
      />
    </div>
  );
};

export default StatusText;
