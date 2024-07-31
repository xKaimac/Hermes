import express from "express";
import passport from "passport";
import dotenv from "dotenv";
import path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const router = express.Router();
const HERMES_URL = process.env.HERMES_URL || "";
const FAILURE = `${HERMES_URL}/login`;

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: FAILURE }),
  (req, res) => {
    res.redirect(HERMES_URL);
  }
);

router.get(
  "/auth/discord",
  passport.authenticate("discord", { scope: ["identify", "email"] })
);

router.get(
  "/auth/discord/callback",
  passport.authenticate("discord", { failureRedirect: FAILURE }),
  (req, res) => {
    res.redirect(HERMES_URL);
  }
);

router.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: FAILURE }),
  (req, res) => {
    res.redirect(HERMES_URL);
  }
);

router.get("/auth/status", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ isAuthenticated: true, user: req.user });
  } else {
    res.json({ isAuthenticated: false });
  }
});

export default router;
