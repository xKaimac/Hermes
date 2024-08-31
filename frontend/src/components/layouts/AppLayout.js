import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import ChatPage from '../chat/ChatPage';
const AppLayout = ({ children }) => {
    return (_jsxs("div", { className: "flex h-screen", children: [_jsx(ChatPage, {}), children] }));
};
export default AppLayout;
