import path = require("path");
import cors from "cors";
import routes from "./routes/index";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import passport from "passport";
import bodyParser from "body-parser";
import publicRoutes from "./routes/public.routes";
import { isAuthenticated } from "./middleware/auth.middleware";
import { configurePassport } from "./config/passport.config";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const PORT = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.HERMES_URL,
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
