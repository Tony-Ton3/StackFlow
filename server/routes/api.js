import express from "express";
import { getRecommendation } from "../controllers/recommendationController";

const router = express.Router();

router.post("/claude-recommendation", getRecommendation);

export default router;
