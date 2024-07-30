import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/routes/auth.route.js";
import { ExpressAuth } from "@auth/express";
import Google from "@auth/express/providers/google";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const HERMES = process.env.HERMES_URL;

// Enable CORS
app.use(
  cors({
    origin: HERMES,
    credentials: true,
  })
);

app.set("trust proxy", true);

// Body parsing middleware
//app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

// Use the auth routes
//app.use(authRoutes);

app.use("/auth/*", ExpressAuth({ providers: [Google] }));

// Error handling middleware
app.use((err, res) => {
  console.error(err);
  res.status(500).send("Something went wrong!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(process.env.AUTH_SECRET);
});
