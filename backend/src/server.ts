import express from "express";
import passport from "passport";
import session from "express-session";
import { createUsersTable } from "./models/user.model";
import { configurePassport } from "./config/passport.config";
import publicRoutes from "./routes/public.routes";
import routes from "./routes/index";
import dotenv from "dotenv";
import path = require("path");
import { isAuthenticated } from "./middleware/auth.middleware";

dotenv.config({ path: path.resolve(__dirname, "../.env") });
console.log(process.env.AUTH_DISCORD_CLIENT!);
console.log(process.env.AUTH_DISCORD_SECRET!);

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
    clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    callbackURL: "/auth/google/callback",
    scope: ["profile", "email"],
  },
  discord: {
    clientID: process.env.AUTH_DISCORD_CLIENT!,
    clientSecret: process.env.AUTH_DISCORD_SECRET!,
    callbackURL: "/auth/discord/callback",
    scope: ["identify", "email"],
  },
  github: {
    clientID: process.env.AUTH_GITHUB_CLIENT!,
    clientSecret: process.env.AUTH_GITHUB_SECRET!,
    callbackURL: "/auth/github/callback",
    scope: ["user:email"],
  },
});

app.use((req, res, next) => {
  if (publicRoutes.includes(req.path)) {
    return next();
  }
  isAuthenticated(req, res, next);
});

app.use(routes);

createUsersTable();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
