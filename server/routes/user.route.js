import express from "express";
import { signout, getstack } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/signout", signout);
router.get("/getstack", verifyToken, getstack);

export default router;
