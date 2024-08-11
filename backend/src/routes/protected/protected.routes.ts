import { Router } from "express";
import userRoutes from "./user.routes";
import friendRoutes from "./friends.routes";
import chatRoutes from "./chats.routes";

const router = Router();

router.use("/user", userRoutes);
router.use("/chats", chatRoutes);
router.use("/friends", friendRoutes);

export default router;
