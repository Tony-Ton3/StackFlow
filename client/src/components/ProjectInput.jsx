import { useState } from "react";
import axios from "axios";

//user questions for prompting
const projectQuestions = [
  {
    id: "description",
    question: "Briefly describe your project idea:",
    type: "text",
  },
  {
    id: "scale",
    question: "What's the expected scale of your project?",
    type: "select",
    options: [
      "Small (personal project)",
      "Medium (startup/small business)",
      "Large (enterprise)",
    ],
  },
  {
    id: "features",
    question: "Select the key features you need:",
    type: "multiselect",
    options: [
      "User Authentication",
      "Database Storage",
      "Real-time Updates",
      "Payment Processing",
      "File Upload/Download",
      "API Integration",
    ],
  },
  {
    id: "timeline",
    question: "What's your development timeline?",
    type: "select",
    options: ["Quick prototype", "1-3 months", "3-6 months", "6+ months"],
  },
  {
    id: "experience",
    question: "What's your programming experience level?",
    type: "select",
    options: ["Beginner", "Intermediate", "Advanced"],
  },
];

async function getClaudeRecommendation(projectDetails) {
  const features = Array.isArray(projectDetails.features)
    ? projectDetails.features.join(", ")
    : "No specific features selected";

  const prompt = `You are an AI assistant specializing in web development and project planning. Your task is to provide tailored recommendations for the tech stack and learning resources based on a user's project description, experience level, and desired features.

You will be given the following information:
<project_description>
${projectDetails.description || "Not provided"}
</project_description>
<project_scale>
${projectDetails.scale || "Not specified"}
</project_scale>
<user_experience>
${projectDetails.experience || "Not specified"}
</user_experience>
<must_have_features>
${features}
</must_have_features>
<project_timeline>
${projectDetails.timeline || "Not specified"}
</project_timeline>

Analyze the provided information carefully. Consider the complexity of the project, its scale, the user's experience level, the required features, and the project timeline when making your recommendations.

Based on your analysis, provide the following:
1. A recommended tech stack, including:
   - Frontend framework/library
   - Backend language and framework (if necessary)
   - Database (if necessary)
   - Any additional technologies or tools necessary for the project
2. An alternative, possibly simpler tech stack
3. Learning resources for each recommended technology, including:
   - YouTube tutorials (provide at least one link per technology)
   - GitHub repositories with relevant examples or boilerplate code (provide at least one link per technology)
   - Official documentation links
4. Brief getting started guidance

Present your recommendations and resources in a clear, organized manner. Use bullet points for readability.

Remember to tailor your recommendations to the user's experience level, project requirements, scale, and timeline. Provide a balanced mix of beginner-friendly and advanced resources when appropriate. For very small or simple projects, recommend lightweight, single-technology solutions if possible. Only suggest comprehensive stacks if the project's complexity truly warrants it.

Format your response as a JSON object with the following structure:
{
  "recommendedStack": {
    "name": "Name of the recommended stack",
    "technologies": ["Tech1", "Tech2", ...],
    "reasoning": "Brief explanation for the recommendation"
  },
  "alternativeStack": {
    "name": "Name of the alternative stack",
    "technologies": ["AltTech1", "AltTech2", ...],
    "reasoning": "Brief explanation for this alternative"
  },
  "learningResources": {
    "Tech1": {
      "youtubeLinks": ["URL1", "URL2"],
      "githubRepos": ["URL1", "URL2"],
      "officialDocs": "URL"
    },
    "Tech2": {
      // Same structure as Tech1
    }
    // ... for each technology in both stacks
  },
  "gettingStarted": "Brief guidance on getting started with the recommended stack",
  "additionalAdvice": "Any additional considerations or advice for the project"
}

Ensure that your entire response can be parsed as a valid JSON object.`;

  console.log("prompt: ", prompt);

  const API_URL = "http://localhost:3002/api/claude-recommendation";

  try {
    const response = await axios.post(API_URL, { prompt: prompt });

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

function ProjectInput({ onStackRecommended }) {
  const [responses, setResponses] = useState({
    features: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (id, value) => {
    setResponses((prev) => ({ ...prev, [id]: value }));
  };

  const handleFeatureChange = (feature, isChecked) => {
    setResponses((prev) => ({
      ...prev,
      features: isChecked
        ? [...prev.features, feature]
        : prev.features.filter((f) => f !== feature),
    }));
  };

  async function handleRecommendation() {
    try {
      setIsLoading(true);
      setError(null);
      const recommendationObject = await getClaudeRecommendation(responses);
      onStackRecommended(recommendationObject);
    } catch (error) {
      console.error("Error getting recommendation:", error);
      setError("Failed to get recommendation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        What kind of project are you building?
      </h2>
      {projectQuestions.map((q) => (
        <div key={q.id} className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            {q.question}
          </label>
          {q.type === "text" && (
            <input
              type="text"
              value={responses[q.id] || ""}
              onChange={(e) => handleInputChange(q.id, e.target.value)}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          )}
          {q.type === "select" && (
            <select
              value={responses[q.id] || ""}
              onChange={(e) => handleInputChange(q.id, e.target.value)}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select an option</option>
              {q.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
          {q.type === "multiselect" && (
            <div className="mt-2">
              {q.options.map((option) => (
                <label key={option} className="inline-flex items-center mr-4">
                  <input
                    type="checkbox"
                    checked={responses.features.includes(option)}
                    onChange={(e) =>
                      handleFeatureChange(option, e.target.checked)
                    }
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button
        onClick={handleRecommendation}
        disabled={isLoading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        {isLoading
          ? "Getting Recommendation..."
          : "Get Tech Stack Recommendation"}
      </button>
    </div>
  );
}

export default ProjectInput;
