import axios from "axios";

const API_BASE_URL = "http://localhost:3002/api";

export const getClaudeRecommendation = async (responses) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/claude-recommendation`,
      responses
    );
    return response.data;
  } catch (error) {
    console.error("Error getting Claude recommendation:", error);
    throw error;
  }
};

export const fetchTutorialsForTechnology = async (technology) => {
  try {
    console.log(`Fetching tutorials for ${technology}`);
    const response = await axios.get(
      `${API_BASE_URL}/youtube/tutorials/${encodeURIComponent(technology)}`
    );
    console.log("API Response:", response);
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else {
      console.error("Unexpected response format:", response.data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching tech tutorials:", error);
    return [];
  }
};

export const fetchTutorialsForStack = async (stack) => {
  try {
    const stackString = stack.join(","); // Join the array into a comma-separated string

    const response = await axios.get(
      `${API_BASE_URL}/youtube/tutorials/${encodedURIComponent(stack)}`
    );
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else {
      console.error("Unexpected response format: ", response.data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching stack tutorials", error);
    return [];
  }
};
