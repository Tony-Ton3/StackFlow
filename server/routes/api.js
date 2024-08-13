import express from "express";
import { getClaudeRecommendation } from "../controllers/recommendation.controllers.js";
import {
  getTutorialsForStack,
  getTutorialsForTechnology,
} from "../controllers/youtube.controllers.js";

const router = express.Router();

router.post("/claude-recommendation", getClaudeRecommendation);
router.get("/youtube/tutorials/:technology", getTutorialsForTechnology);
router.get("/youtube/tutorials/:stack", getTutorialsForStack);

export default router;
