import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import path from "path";
import express from "express";
import passport from "passport";
import routes from "./routes/index";
import bodyParser from "body-parser";
import session from "express-session";
import { Server } from "socket.io";
import createAllTables from "./models/user.model";
import publicRoutes from "./routes/public.routes";
import { isAuthenticated } from "./middleware/auth.middleware";
import { configurePassport } from "./config/passport.config";
import { initializeSocket } from "./services/socket/socket.service";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.HERMES_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

initializeSocket(io);

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
    scope: ["profile"],
  },
  discord: {
    clientID: process.env.AUTH_DISCORD_CLIENT!,
    clientSecret: process.env.AUTH_DISCORD_SECRET!,
    callbackURL: "/auth/discord/callback",
    scope: ["identify"],
  },
  github: {
    clientID: process.env.AUTH_GITHUB_CLIENT!,
    clientSecret: process.env.AUTH_GITHUB_SECRET!,
    callbackURL: "/auth/github/callback",
    scope: ["read:user"],
  },
});

app.use((req, res, next) => {
  if (publicRoutes.includes(req.path)) {
    return next();
  }
  isAuthenticated(req, res, next);
});

createAllTables();

app.use(routes);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
