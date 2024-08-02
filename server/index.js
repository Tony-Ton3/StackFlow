import express from "express";
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

app.post("/api/claude-recommendation", async (req, res) => {
  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: req.body.prompt,
        },
      ],
    });

    // Extract the content from Claude's response
    const content = response.content[0].text;
    console.log(content);

    // Find the JSON part of the response
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);

    if (jsonMatch && jsonMatch[1]) {
      try {
        const parsedContent = JSON.parse(jsonMatch[1]);
        console.log("Structured recommendation:", parsedContent);
        res.json(parsedContent);
      } catch (parseError) {
        console.error("Error parsing JSON from Claude response:", parseError);
        res.status(500).json({
          error: "Failed to parse recommendation from Claude",
          details: parseError.message,
        });
      }
    } else {
      console.error("No valid JSON found in Claude's response");
      res.status(500).json({
        error: "Invalid response format from Claude",
        details: "No JSON data found in the response",
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
