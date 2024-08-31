import { jsx as _jsx } from "react/jsx-runtime";
import './styles/BackgroundAnimation.styles.scss';
const BackgroundWithAnimation = () => {
    return (_jsx("div", { className: "background-animation", children: _jsx("div", { className: "stars", children: [...Array(50)].map((_, index) => (_jsx("div", { className: "star" }, index))) }) }));
};
export default BackgroundWithAnimation;
