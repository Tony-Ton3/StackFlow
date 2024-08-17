import { useSelector } from "react-redux";
const API_BASE_URL = "http://localhost:3002/api";

export const getClaudeRecommendation = async (userId, form) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/claude-recommendation/${userId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error getting Claude recommendation:", error);
    throw error;
  }
};

export const fetchTutorialsForTechnology = async (technology) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/youtube/tutorials/${encodeURIComponent(technology)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("fetchTutorialsForTechnology: ", data);
    if (Array.isArray(data)) {
      return data;
    } else {
      console.error("Unexpected response format:", data);
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

    const response = await fetch(
      `${API_BASE_URL}/youtube/tutorials/${encodeURIComponent(stackString)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (Array.isArray(data)) {
      return data;
    } else {
      console.error("Unexpected response format: ", data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching stack tutorials", error);
    return [];
  }
};
