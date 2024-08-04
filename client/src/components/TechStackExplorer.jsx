import { useState } from "react";

function TechStackExplorer({ recommendation }) {
  const [showAlternative, setShowAlternative] = useState(false);
  const [expandedResource, setExpandedResource] = useState(null);

  const renderTechList = (technologies) => (
    <ul className="list-disc list-inside text-sm mt-2">
      {technologies.map((tech, index) => (
        <li key={index} className="text-gray-700">
          {tech}
        </li>
      ))}
    </ul>
  );

  // const renderLearningResources = (tech) => (
  //   <div className="mt-4">
  //     <h4 className="text-lg font-semibold text-gray-800">{tech} Resources:</h4>
  //     <div className="ml-4">
  //       <p className="font-medium text-gray-700">YouTube Tutorials:</p>
  //       <ul className="list-disc list-inside">
  //         {recommendation.learningResources[tech].youtubeLinks.map(
  //           (link, index) => (
  //             <li key={index}>
  //               <a
  //                 href={link}
  //                 target="_blank"
  //                 rel="noopener noreferrer"
  //                 className="text-blue-600 hover:underline"
  //               >{`Tutorial ${index + 1}`}</a>
  //             </li>
  //           )
  //         )}
  //       </ul>
  //       <p className="font-medium text-gray-700 mt-2">GitHub Repositories:</p>
  //       <ul className="list-disc list-inside">
  //         {recommendation.learningResources[tech].githubRepos.map(
  //           (repo, index) => (
  //             <li key={index}>
  //               <a
  //                 href={repo}
  //                 target="_blank"
  //                 rel="noopener noreferrer"
  //                 className="text-blue-600 hover:underline"
  //               >{`Repository ${index + 1}`}</a>
  //             </li>
  //           )
  //         )}
  //       </ul>
  //       <p className="font-medium text-gray-700 mt-2">
  //         Official Documentation:
  //       </p>
  //       <a
  //         href={recommendation.learningResources[tech].officialDocs}
  //         target="_blank"
  //         rel="noopener noreferrer"
  //         className="text-blue-600 hover:underline"
  //       >
  //         View Documentation
  //       </a>
  //     </div>
  //   </div>
  // );

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
      {renderTechList(recommendation.recommendedStack.technologies)}

      {/* <div className="mt-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Learning Resources
        </h3>
        {recommendation.recommendedStack.technologies.map((tech) => (
          <div key={tech} className="mb-4">
            <button
              onClick={() =>
                setExpandedResource(expandedResource === tech ? null : tech)
              }
              className="w-full text-left px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded transition duration-300"
            >
              <span className="font-semibold">{tech}</span>
              <span className="float-right">
                {expandedResource === tech ? "▲" : "▼"}
              </span>
            </button>
            {expandedResource === tech && renderLearningResources(tech)}
          </div>
        ))}
      </div> */}

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
            {renderTechList(recommendation.alternativeStack.technologies)}
          </div>
        )}
      </div>
    </div>
  );
}

export default TechStackExplorer;
