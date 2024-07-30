import express from "express";
import passport from "passport";
import session from "express-session";
import { createUsersTable } from "./models/user.model";
import { configurePassport } from "./config/passport.config";
import authRoutes from "./routes/auth.routes";
import dotenv from "dotenv";
import path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET || "",
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport
configurePassport({
  google: {
    clientID: process.env.AUTH_GOOGLE_CLIENT!,
    clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET!,
    callbackURL: "/auth/google/callback",
    scope: ["profile", "email"],
  },
  discord: {
    clientID: process.env.AUTH_DISCORD_CLIENT!,
    clientSecret: process.env.AUTH_DISCORD_CLIENT_SECRET!,
    callbackURL: "/auth/discord/callback",
    scope: ["identify", "email"],
  },
  github: {
    clientID: process.env.AUTH_GITHUB_CLIENT!,
    clientSecret: process.env.AUTH_GITHUB_CLIENT_SECRET!,
    callbackURL: "/auth/github/callback",
    scope: ["user:email"],
  },
});

app.use(authRoutes);

createUsersTable();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
