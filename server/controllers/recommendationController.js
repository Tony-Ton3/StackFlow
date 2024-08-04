import express from "express";
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
import { generatePrompt } from "./utils/claudePrompt.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

app.post("/api/claude-recommendation", async (req, res) => {
  try {
    const prompt = generatePrompt(req.body);

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Extract the content from Claude's response
    const content = response.content[0].text;
    console.log("Claude's full response:", content);

    // Try to find JSON in the response
    let parsedContent;
    try {
      // First, try to parse the entire response as JSON
      parsedContent = JSON.parse(content);
    } catch (error) {
      // If that fails, try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsedContent = JSON.parse(jsonMatch[0]);
        } catch (parseError) {
          console.error("Error parsing extracted JSON:", parseError);
        }
      }
    }

    if (parsedContent) {
      console.log("Structured recommendation:", parsedContent);
      res.json(parsedContent);
    } else {
      console.error("No valid JSON found in Claude's response");
      res.status(500).json({
        error: "Invalid response format from Claude",
        details: "No JSON data found in the response",
        fullResponse: content,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: "Failed to get recommendation from Claude",
      details: error.message,
    });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
