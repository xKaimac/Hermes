"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const user_model_1 = require("./models/user.model");
const passport_config_1 = require("./config/passport.config");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const dotenv_1 = __importDefault(require("dotenv"));
const path = require("path");
dotenv_1.default.config({ path: path.resolve(__dirname, "../.env") });
const app = (0, express_1.default)();
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || "",
    resave: false,
    saveUninitialized: false,
}));
// Initialize Passport
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Configure Passport
(0, passport_config_1.configurePassport)({
    google: {
        clientID: process.env.AUTH_GOOGLE_CLIENT,
        clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
        scope: ["profile", "email"],
    },
    discord: {
        clientID: process.env.AUTH_DISCORD_CLIENT,
        clientSecret: process.env.AUTH_DISCORD_CLIENT_SECRET,
        callbackURL: "/auth/discord/callback",
        scope: ["identify", "email"],
    },
    github: {
        clientID: process.env.AUTH_GITHUB_CLIENT,
        clientSecret: process.env.AUTH_GITHUB_CLIENT_SECRET,
        callbackURL: "/auth/github/callback",
        scope: ["user:email"],
    },
});
app.use(auth_routes_1.default);
(0, user_model_1.createUsersTable)();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
