import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { recommendationRouter } from "./controllers/recommendationController.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", recommendationRouter);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
