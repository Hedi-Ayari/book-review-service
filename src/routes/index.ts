import { Router } from "express";
import userRoutes from "./userRoutes";
import bookRoutes from "./bookRoutes";
import reviewRoutes from "./reviewRoutes";

const router = Router();

router.use("/users", userRoutes);
router.use("/books", bookRoutes);
router.use("/reviews", reviewRoutes);

export default router;
