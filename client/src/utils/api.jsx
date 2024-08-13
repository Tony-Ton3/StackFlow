// import axios from "axios";
const API_BASE_URL = "http://localhost:3002/api";

export const getClaudeRecommendation = async (responses) => {
  try {
    // const response = await axios.post(
    //   `${API_BASE_URL}/claude-recommendation`,
    //   responses
    // );
    // return response.data;

    const response = await fetch(`${API_BASE_URL}/claude-recommendation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(responses),
      credentials: "include",
    });
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
    // console.log(`Fetching tutorials for ${technology}`);
    // const response = await axios.get(
    //   `${API_BASE_URL}/youtube/tutorials/${encodeURIComponent(technology)}`
    // );
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
    console.log("API Response", data);
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

    // const response = await axios.get(
    //   `${API_BASE_URL}/youtube/tutorials/${encodedURIComponent(stackString)}`
    // );

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
