import React, { useState } from "react";
import { fetchTutorialsForTechnology } from "../utils/api";

function TechStackExplorer({ recommendation }) {
  const [showAlternative, setShowAlternative] = useState(false);
  const [expandedTech, setExpandedTech] = useState(null);
  const [tutorials, setTutorials] = useState({});

  const handleExpandTech = async (tech) => {
    if (expandedTech === tech) {
      setExpandedTech(null);
    } else {
      setExpandedTech(tech);
      if (!tutorials[tech]) {
        try {
          //makes youtube api call to get tutorial videos on the particular technology
          const fetchedTutorials = await fetchTutorialsForTechnology(tech);

          console.log(`Fetched tutorials for ${tech}:`, fetchedTutorials);

          setTutorials((prev) => ({ ...prev, [tech]: fetchedTutorials }));
        } catch (error) {
          console.error("Error fetching tutorials:", error);
          setTutorials((prev) => ({ ...prev, [tech]: [] }));
        }
      }
    }
  };

  const TechnologyTutorials = ({ technology, tutorials }) => (
    <div className="mt-4">
      <h3 className="text-xl font-semibold">{technology} Tutorials</h3>
      {Array.isArray(tutorials) && tutorials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          {tutorials.map((tutorial) => (
            <div key={tutorial.id} className="border rounded-lg p-4">
              <img
                src={tutorial.thumbnail}
                alt={tutorial.title}
                className="w-full"
              />
              <h4 className="mt-2 font-medium">{tutorial.title}</h4>
              <p className="text-sm text-gray-600">{tutorial.channelTitle}</p>
              <a
                href={`https://www.youtube.com/watch?v=${tutorial.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block bg-red-600 text-white px-4 py-2 rounded"
              >
                Watch
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Recommended Tech Stack: {recommendation.recommendedStack.name}
      </h2>
      <p className="text-gray-600 mb-4">
        {recommendation.recommendedStack.reasoning}
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-2 text-gray-800">
        Technologies:
      </h3>

      {/* renders tech stack here */}
      {recommendation.recommendedStack.technologies.map((tech) => (
        <div key={tech} className="mb-4">
          <button
            onClick={() => handleExpandTech(tech)}
            className="w-full text-left px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded transition duration-300"
          >
            <span className="font-semibold">{tech}</span>
            <span className="float-right">
              {expandedTech === tech ? "▲" : "▼"}
            </span>
          </button>

          {expandedTech === tech && (
            <TechnologyTutorials
              technology={tech}
              tutorials={tutorials[tech] || []}
            />
          )}
        </div>
      ))}

      <div className="mt-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Getting Started
        </h3>
        <p className="text-gray-700 whitespace-pre-line">
          {recommendation.gettingStarted}
        </p>
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Additional Advice
        </h3>
        <p className="text-gray-700">{recommendation.additionalAdvice}</p>
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Alternative Stack
        </h3>
        <button
          onClick={() => setShowAlternative(!showAlternative)}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
        >
          {showAlternative ? "Hide" : "Show"} Alternative Option
        </button>

        {/* shows an alternative tech stack that differs from the recommended */}
        {showAlternative && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h4 className="text-xl font-semibold mb-2 text-gray-800">
              {recommendation.alternativeStack.name}
            </h4>
            <p className="text-gray-600 mb-4">
              {recommendation.alternativeStack.reasoning}
            </p>
            <h5 className="text-lg font-semibold mt-2 mb-1 text-gray-800">
              Technologies:
            </h5>
            <ul className="list-disc list-inside text-sm mt-2">
              {recommendation.alternativeStack.technologies.map(
                (tech, index) => (
                  <li key={index} className="text-gray-700">
                    {tech}
                  </li>
                )
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default TechStackExplorer;
