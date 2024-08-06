import express from "express";
import { getClaudeRecommendation } from "../controllers/recommendationController.js";
import { getTutorialsForTechnology } from "../controllers/youtubeController.js";

const router = express.Router();

router.post("/claude-recommendation", getClaudeRecommendation);
router.get("/youtube/tutorials/:technology", getTutorialsForTechnology);

export default router;
