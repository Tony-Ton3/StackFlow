import axios from "axios";

export async function getClaudeRecommendation(projectDetails) {
  const API_URL = "http://localhost:3002/api/claude-recommendation";

  try {
    const response = await axios.post(API_URL, projectDetails);

    if (response.data && typeof response.data === "object") {
      return response.data;
    } else {
      console.error("Unexpected response format:", response.data);
      throw new Error("Unexpected response format from server");
    }
  } catch (error) {
    console.error(
      "Error getting Claude recommendation:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}
