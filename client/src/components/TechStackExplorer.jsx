import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  fetchTutorialsForTechnology,
  fetchTutorialsForStack,
} from "../utils/api";
import { TechIcons } from "../assets/index";

//assignes approprate icon to the technology
function TechIcon({ name }) {
  console.log(name);
  const icon = TechIcons[name];
  if (!icon) return null;

  return <img src={icon.src} alt={icon.alt} className="w-6 h-6 mr-5" />;
}

function TechStackExplorer() {
  const [showAlternative, setShowAlternative] = useState(false);
  const [expandedTech, setExpandedTech] = useState(null);
  const [tutorials, setTutorials] = useState({});
  const [stack, setStack] = useState({});
  const [isStackTutorialsLoading, setIsStackTutorialsLoading] = useState(true);
  const { currentStack } = useSelector((state) => state.stack);

  //fetches tutorials for the entire stack
  useEffect(() => {
    const fetchStackTutorials = async () => {
      setIsStackTutorialsLoading(true);

      try {
        const stackTutorial = await fetchTutorialsForStack(
          currentStack.recommendedStack.technologies
        );
        setStack(stackTutorial);
      } catch (error) {
        console.error("Error fetching stack tutorials:", error);
      } finally {
        setIsStackTutorialsLoading(false);
      }
    };

    fetchStackTutorials();
  }, [currentStack]);

  //fetch tutorials for a paticular layer of the stack is clicked
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
        Recommended Tech Stack: {currentStack.recommendedStack.name}
      </h2>
      <p className="text-gray-600 mb-4">
        {currentStack.recommendedStack.reasoning}
      </p>

      {/* New section for stack tutorials */}
      <div className="mt-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Tutorials for the Entire Stack
        </h3>
        {isStackTutorialsLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : stack.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            {stack.map((tutorial) => (
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
          <p>No tutorials found for the entire stack.</p>
        )}
      </div>

      <h3 className="text-xl font-semibold mt-6 mb-2 text-gray-800">
        Technologies:
      </h3>

      {/* renders tech stack here */}
      {currentStack.recommendedStack.technologies.map((tech) => {
        return (
          <div key={tech} className="mb-4">
            <button
              onClick={() => handleExpandTech(tech)}
              className="w-full text-left px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded transition duration-300 flex items-center"
            >
              <TechIcon name={tech} />
              <span className="font-semibold">{tech}</span>
              <span className="ml-auto">
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
        );
      })}

      <div className="mt-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Getting Started
        </h3>
        <p className="text-gray-700 whitespace-pre-line">
          {currentStack.gettingStarted}
        </p>
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Additional Advice
        </h3>
        <p className="text-gray-700">{currentStack.additionalAdvice}</p>
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
              {currentStack.alternativeStack.name}
            </h4>
            <p className="text-gray-600 mb-4">
              {currentStack.alternativeStack.reasoning}
            </p>
            <h5 className="text-lg font-semibold mt-2 mb-1 text-gray-800">
              Technologies:
            </h5>
            <ul className="list-disc list-inside text-sm mt-2">
              {currentStack.alternativeStack.technologies.map((tech, index) => (
                <li key={index} className="text-gray-700">
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default TechStackExplorer;
