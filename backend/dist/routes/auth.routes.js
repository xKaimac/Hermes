"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
router.get("/auth/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
router.get("/auth/google/callback", passport_1.default.authenticate("google", { failureRedirect: "/login" }), (req, res) => {
    res.redirect("/");
});
router.get("/auth/discord", passport_1.default.authenticate("discord", { scope: ["profile", "email"] }));
router.get("/auth/discord/callback", passport_1.default.authenticate("discord", { failureRedirect: "/login" }), (req, res) => {
    res.redirect("/");
});
router.get("/auth/github", passport_1.default.authenticate("github", { scope: ["profile", "email"] }));
router.get("/auth/github/callback", passport_1.default.authenticate("github", { failureRedirect: "/login" }), (req, res) => {
    res.redirect("/");
});
router.get("/profile", (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ user: req.user });
    }
    else {
        res.status(401).json({ message: "Not authenticated" });
    }
});
exports.default = router;
