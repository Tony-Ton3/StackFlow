import express from "express";
import { getClaudeRecommendation } from "../controllers/recommendation.controllers.js";
import {
  getTutorialsForStack,
  getTutorialsForTechnology,
} from "../controllers/youtube.controllers.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post(
  "/claude-recommendation/:userId",
  verifyToken,
  getClaudeRecommendation
);
router.get("/youtube/tutorials/:technology", getTutorialsForTechnology);
router.get("/youtube/tutorials/:stack", getTutorialsForStack);

export default router;
