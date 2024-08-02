import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const projectQuestions = [
  {
    id: "purpose",
    question: "What's the main purpose of your project?",
    type: "text",
  },
  {
    id: "features",
    question: "What key features do you want in your project?",
    type: "text",
  },
  { id: "audience", question: "Who is your target audience?", type: "text" },
  {
    id: "scale",
    question: "What scale are you aiming for?",
    type: "select",
    options: ["Personal/Small", "Medium", "Large/Enterprise"],
  },
  {
    id: "timeline",
    question: "What's your timeline for building this?",
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

function UserPreferences() {
  const navigate = useNavigate();
  const [responses, setResponses] = useState({});
  const [recommendation, setRecommendation] = useState(null);

  const handleResponseChange = (id, value) => {
    setResponses((prev) => ({ ...prev, [id]: value }));
  };

  const getAIRecommendation = async () => {
    // This is where you'd integrate with an AI service
    // For now, we'll use a placeholder function
    const mockAIRecommendation = {
      techStack: "React + Node.js",
      reasoning:
        "Based on your project description, a frontend-focused stack would be suitable. React offers a great starting point for building interactive UIs, and Node.js can be added later if backend functionality is needed.",
      learningPath: [
        {
          name: "HTML & CSS",
          resources: ["MDN Web Docs", "FreeCodeCamp HTML & CSS course"],
        },
        {
          name: "JavaScript Basics",
          resources: ["JavaScript.info", "Eloquent JavaScript book"],
        },
        {
          name: "React Fundamentals",
          resources: ["React official docs", "React for Beginners by Wes Bos"],
        },
        {
          name: "Node.js Basics",
          resources: [
            "Node.js official docs",
            "Node.js Crash Course on YouTube",
          ],
        },
      ],
    };

    setRecommendation(mockAIRecommendation);
  };

  const handleSubmit = () => {
    getAIRecommendation();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Tell us about your project idea
      </h2>
      {projectQuestions.map((q) => (
        <div key={q.id} className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor={q.id}
          >
            {q.question}
          </label>
          {q.type === "text" ? (
            <input
              type="text"
              id={q.id}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={responses[q.id] || ""}
              onChange={(e) => handleResponseChange(q.id, e.target.value)}
            />
          ) : (
            <select
              id={q.id}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={responses[q.id] || ""}
              onChange={(e) => handleResponseChange(q.id, e.target.value)}
            >
              <option value="">Select an option</option>
              {q.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150"
      >
        Get Personalized Recommendation
      </button>

      {recommendation && (
        <div className="mt-8 p-4 bg-gray-50 rounded">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">
            Your Personalized Recommendation
          </h3>
          <p className="mb-2">
            <strong>Recommended Tech Stack:</strong> {recommendation.techStack}
          </p>
          <p className="mb-4">
            <strong>Reasoning:</strong> {recommendation.reasoning}
          </p>
          <h4 className="font-semibold mb-2">Suggested Learning Path:</h4>
          <ul className="list-disc list-inside">
            {recommendation.learningPath.map((step, index) => (
              <li key={index} className="mb-2">
                <strong>{step.name}</strong>
                <ul className="list-circle list-inside ml-4">
                  {step.resources.map((resource, i) => (
                    <li key={i}>{resource}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default UserPreferences;
