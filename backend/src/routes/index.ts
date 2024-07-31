import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./protected.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);

export default router;
