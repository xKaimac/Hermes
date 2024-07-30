// src/routes/auth.route.ts
import express from "express";
import { ExpressAuth } from "@auth/express";
import Google from "@auth/express/providers/google";

const router = express.Router();

router.use(
  "/auth",
  ExpressAuth({
    providers: [
      Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
    ],
    secret: process.env.AUTH_SECRET,
  })
);

export default router;
