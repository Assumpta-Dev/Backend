import express from "express";
import { getStats } from "../controller/stats.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, authorize("admin", "vendor"), getStats);

export default router;
