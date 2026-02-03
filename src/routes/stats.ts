import express from "express";
import { getStats } from "../controller/stats";
import { protect, authorize } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", protect, authorize("admin", "vendor"), getStats);

export default router;