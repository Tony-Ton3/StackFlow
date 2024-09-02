import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchTutorialsForTechnology,
  fetchTutorialsForStack,
} from "../utils/api";
import { TechIcons } from "../assets/index";
import {
  IoIosArrowBack,
  IoMdCreate,
  IoIosArrowDown,
  IoIosArrowUp,
} from "react-icons/io";
import { TbStack3Filled } from "react-icons/tb";
import TechPopUp from "./TechPopUp";

// normalize tech name returned from the api to match an icon image
const normalizeTechName = (name) => {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
};

const TechIcon = ({ name }) => {
  const normalizedName = normalizeTechName(name);

  // Search for a matching icon in the TechIcons object
  const icon = Object.entries(TechIcons).find(
    ([key, _]) => normalizeTechName(key) === normalizedName
  );

  // If a matching icon is found, return an img element with the icon's properties
  // If no match is found, return null (no icon will be displayed)
  return icon ? (
    <img src={icon[1].src} alt={icon[1].alt} className="w-6 h-6 mr-2" />
  ) : (
    <TbStack3Filled className="w-6 h-6 mr-2" />
  );
};

const TechStackExplorer = ({
  currentStack,
  isNewSubmission,
  onBackToSaved,
  handleBackToList,
}) => {
  const [isStackTutorialsLoading, setIsStackTutorialsLoading] = useState(true);
  const [stackTutorials, setStackTutorials] = useState([]);
  const [techTutorials, setTechTutorials] = useState({});
  const [expandedTech, setExpandedTech] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    stackTutorials: true,
    technologies: true,
    gettingStarted: false,
    additionalAdvice: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStackTutorials = async () => {
      setIsStackTutorialsLoading(true);
      try {
        const fullStackTutorials = await fetchTutorialsForStack(
          currentStack?.recommendedStack.name,
          currentStack?._id
        );
        setStackTutorials(fullStackTutorials);
      } catch (error) {
        console.error("Error fetching stack tutorials:", error);
      } finally {
        setIsStackTutorialsLoading(false);
      }
    };

    fetchStackTutorials();
  }, [currentStack]);

  const handleExpandTech = async (tech) => {
    if (expandedTech === tech.name) {
      setExpandedTech(null);
    } else {
      setExpandedTech(tech.name);
      if (!techTutorials[tech.name]) {
        try {
          const fetchedTutorials = await fetchTutorialsForTechnology(tech.name);
          setTechTutorials((prev) => ({
            ...prev,
            [tech.name]: fetchedTutorials,
          }));
        } catch (error) {
          console.error("Error fetching tutorials:", error);
          setTechTutorials((prev) => ({ ...prev, [tech.name]: [] }));
        }
      }
    }
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={isNewSubmission ? onBackToSaved : handleBackToList}
            className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition duration-300"
          >
            <IoIosArrowBack className="mr-2" />
            {isNewSubmission ? "Back to Saved Stacks" : "Back to List"}
          </button>
          <button
            onClick={() => navigate("/projectinput")}
            className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition duration-300"
          >
            <IoMdCreate className="mr-2" /> Create Another
          </button>
        </div>

        <h1 className="text-4xl font-bold mb-6 text-center">
          {currentStack?.recommendedStack.name}
        </h1>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
          <p className="text-lg">{currentStack?.recommendedStack.reasoning}</p>
        </div>

        <div className="space-y-8">
          <Section
            title="Stack Tutorials"
            expanded={expandedSections.stackTutorials}
            onToggle={() => toggleSection("stackTutorials")}
          >
            {isStackTutorialsLoading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : stackTutorials.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stackTutorials.map((video) => (
                  <TutorialCard key={video.id} video={video} />
                ))}
              </div>
            ) : (
              <p>No tutorials found for this stack.</p>
            )}
          </Section>

          <Section
            title="Technologies"
            expanded={expandedSections.technologies}
            onToggle={() => toggleSection("technologies")}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {currentStack?.recommendedStack.technologies.map((tech) => (
                <TechButton
                  key={tech._id}
                  tech={tech}
                  expanded={expandedTech === tech.name}
                  onExpand={() => handleExpandTech(tech)}
                />
              ))}
            </div>
          </Section>

          <Section
            title="Getting Started"
            expanded={expandedSections.gettingStarted}
            onToggle={() => toggleSection("gettingStarted")}
          >
            <p className="whitespace-pre-line">
              {currentStack?.gettingStarted}
            </p>
          </Section>

          <Section
            title="Additional Advice"
            expanded={expandedSections.additionalAdvice}
            onToggle={() => toggleSection("additionalAdvice")}
          >
            <p>{currentStack?.additionalAdvice}</p>
          </Section>
        </div>
      </div>

      {expandedTech && (
        <TechPopUp
          tech={currentStack.recommendedStack.technologies.find(
            (t) => t.name === expandedTech
          )}
          techTutorials={techTutorials}
          setExpandedTech={setExpandedTech}
        />
      )}
    </div>
  );
};

const Section = ({ title, children, expanded, onToggle }) => (
  <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
    <button
      className="w-full flex justify-between items-center p-4 bg-gray-700 hover:bg-gray-600 transition duration-300"
      onClick={onToggle}
    >
      <h2 className="text-2xl font-semibold">{title}</h2>
      {expanded ? <IoIosArrowUp /> : <IoIosArrowDown />}
    </button>
    {expanded && <div className="p-6">{children}</div>}
  </div>
);

const TutorialCard = ({ video }) => (
  <div className="bg-gray-700 rounded-lg overflow-hidden shadow-lg transition duration-300 hover:shadow-xl">
    <img
      src={video.thumbnail}
      alt={video.title}
      className="w-full h-48 object-cover"
    />
    <div className="p-4">
      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{video.title}</h3>
      <p className="text-gray-400 mb-4">{video.channelTitle}</p>
      <a
        href={`https://www.youtube.com/watch?v=${video.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition duration-300"
      >
        Watch
      </a>
    </div>
  </div>
);

const TechButton = ({ tech, expanded, onExpand }) => (
  <button
    onClick={onExpand}
    className={`relative w-full h-16 text-white ${
      expanded ? "bg-purple-600" : "bg-gray-700"
    } rounded-xl shadow transition duration-300 flex items-center justify-center hover:bg-purple-500`}
  >
    <TechIcon name={tech.name} />
    <span className="font-semibold">{tech.name}</span>
  </button>
);

export default TechStackExplorer;
