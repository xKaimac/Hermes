import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import BackgroundWithAnimation from "../components/layouts/BackgroundAnimation";
import HermesLogo from "../components/login/hermes.logo";
import LoginButton from "../components/login/login.button";
import providers from "../components/login/providers";
import ThemeToggle from "../utils/theme-toggle.util";
export default function Login() {
    return (_jsxs("div", { className: "relative w-screen h-screen overflow-hidden bg-background-light dark:bg-background-dark transition-colors duration-200", children: [_jsx(BackgroundWithAnimation, {}), _jsxs("div", { className: "absolute inset-0 z-10 flex flex-col items-center justify-center", children: [_jsx(HermesLogo, {}), _jsxs("div", { className: "items-center bg-surface-light dark:bg-surface-dark p-8 rounded-xl shadow-lg w-4/5 md:w-1/2 transition-colors duration-200", children: [_jsx("h1", { className: "text-2xl font-bold mb-6 text-center text-text-light-primary dark:text-text-dark-primary", children: "Sign up or log in" }), _jsx("p", { className: "mb-6 text-center text-text-light-secondary dark:text-text-dark-secondary", children: "Choose a provider to get started" }), _jsx("div", { className: "grid grid-cols-3 gap-0 items-center", children: providers.map((entry) => (_jsx(LoginButton, { name: entry }, entry))) })] }), _jsx("div", { className: "pt-2", children: _jsx(ThemeToggle, {}) })] })] }));
}
