import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, Avatar } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { useUser } from "../../utils/UserContext";
const uploadProfilePicture = async ({ file, user_id }) => {
    const formData = new FormData();
    formData.append("profile_picture", file);
    formData.append("user_id", user_id.toString());
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/protected/user/upload-profile-picture`, {
        method: "POST",
        body: formData,
        credentials: "include",
    });
    if (!response.ok)
        throw new Error("Upload failed");
    return response.json();
};
const ProfilePictureUpload = () => {
    const { userData, updateUserData } = useUser();
    const user_id = userData.user.id;
    const currentPicture = userData.user.profile_picture;
    const mutation = useMutation({
        mutationFn: uploadProfilePicture,
        onSuccess: (data) => {
            updateUserData({ profile_picture: data.result.secure_url });
        },
    });
    const handleFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            mutation.mutate({ file, user_id });
        }
    };
    return (_jsxs("div", { className: "flex flex-col items-center justify-center pt-5", children: [_jsx(Avatar, { className: "size-[20vh]", src: currentPicture }), _jsx("input", { type: "file", onChange: handleFileChange, accept: "image/*", style: { display: "none" }, id: "profile-picture-input" }), _jsx("div", { className: "pt-5", children: _jsx("label", { htmlFor: "profile-picture-input", children: _jsx(Button, { component: "span", className: "bg-primary hover:bg-primary-light dark:bg-primary-dark dark:hover:bg-primary text-text-dark-primary", loading: mutation.isPending, children: mutation.isPending ? "Uploading..." : "Change Your Picture" }) }) }), mutation.isError && (_jsxs("p", { className: "text-red-500 mt-2", children: ["Upload failed. Please try again. Error: ", mutation.error?.message] }))] }));
};
export default ProfilePictureUpload;
