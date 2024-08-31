import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchTutorialsForTechnology,
  fetchTutorialsForStack,
} from "../utils/api";
import { setStackSuccess, setStackFailure } from "../redux/techstackSlice";
import { MdSaveAlt } from "react-icons/md";
import { TechIcons } from "../assets/index";
import { IoIosArrowBack } from "react-icons/io";
import TechPopUp from "./TechPopUp";

const TechIcon = ({ name }) => {
  const icon = TechIcons[name];
  if (!icon) return null;

  return <img src={icon.src} alt={icon.alt} className="w-6 h-6 mr-5" />;
};

const TechStackExplorer = ({
  currentStack,
  isNewSubmission,
  onBackToSaved,
  handleBackToList,
}) => {
  const [isStackTutorialsLoading, setIsStackTutorialsLoading] = useState(true);
  const [stackTutorials, setStackTutorials] = useState({}); //stores tutorials on entire stack
  const [techTutorials, setTechTutorials] = useState({}); //stores tutorials on a tech of the stack
  const [expandedTech, setExpandedTech] = useState(null); //stores name of a particular stack
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  // const [showAlternative, setShowAlternative] = useState(false);
  // const { currentStack } = useSelector((state) => state.stack);

  //gets last saved recommended stack from database when component mounts
  // useEffect(() => {
  //   const fetchStack = async () => {
  //     try {
  //       const response = await fetch(
  //         "http://localhost:3002/api/user/getstack",
  //         {
  //           method: "GET",
  //           headers: { "Content-Type": "application/json" },
  //           credentials: "include",
  //         }
  //       );
  //       if (!response.ok) {
  //         throw new Error("failed to get stack from database");
  //       }
  //       const data = await response.json();
  //       dispatch(setStackSuccess(data));
  //     } catch (error) {
  //       dispatch(setStackFailure(error));
  //       console.error("Error fetching stack:", error);
  //     }
  //   };

  //   fetchStack();
  // }, []);

  //fetches tutorials for the recommended tech stack on youtube when the component mounts
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
  }, []);

  //fetch youtube tutorials for the tech
  const handleExpandTech = async (tech) => {
    if (expandedTech === tech) {
      //used to close the expaneded tech section
      setExpandedTech(null);
    } else {
      setExpandedTech(tech);
      if (!techTutorials[tech]) {
        try {
          const fetchedTutorials = await fetchTutorialsForTechnology(tech);
          console.log(`Fetched tutorials(${tech})`, fetchedTutorials);
          setTechTutorials((prev) => ({ ...prev, [tech]: fetchedTutorials }));
        } catch (error) {
          console.error("Error fetching tutorials:", error);
          setTechTutorials((prev) => ({ ...prev, [tech]: [] }));
        }
      }
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="flex-grow flex items-center justify-center px-4 py-10">
        <div className="relative max-w-4xl p-10 rounded-3xl shadow bg-gradient-to-b from-gray-700 to-gray-900">
          {isNewSubmission ? (
            <button
              onClick={onBackToSaved}
              className="flex items-center py-2 px-4  bg-purple-500 hover:bg-purple-700 text-white font-bold rounded"
            >
              <IoIosArrowBack className="mr-2" /> Back to Saved Stacks
            </button>
          ) : (
            <button
              onClick={handleBackToList}
              className="flex items-center py-2 px-4  bg-purple-500 hover:bg-purple-700 text-white font-bold rounded"
            >
              <IoIosArrowBack className="mr-2" /> Back to List
            </button>
          )}

          <button
            onClick={() => navigate("/projectinput")}
            className="mt-4 ml-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            New Recommendation
          </button>

          {/* <div
            className="absolute top-0 right-0 transform -translate-x-5 translate-y-5 transition-transform hover:scale-110"
            onClick={() => saveTechStack()}
            onMouseEnter={() => setIsTooltipVisible(true)}
            onMouseLeave={() => setIsTooltipVisible(false)}
          >
            <MdSaveAlt className="w-10 h-10 text-gray-500 hover:text-white" />
          </div> */}

          {/* {isTooltipVisible && (
            <div className="absolute top-16 -right-1 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
              Save this stack
            </div>
          )} */}
          <h2 className="text-3xl font-bold mb-6 text-center underline">
            {currentStack?.recommendedStack.name}
          </h2>
          <div className="bg-black w-full p-5 rounded-2xl text-center font-bold border-2 border-purple-400 border-dashed ">
            <p className=" mb-4">{currentStack?.recommendedStack.reasoning}</p>
          </div>

          {/* New section for stack tutorials */}
          <div className="mt-8">
            <h3 className="flex justify-center text-lg font-bold mb-4">
              ---- Youtube tutorials for {currentStack?.recommendedStack.name}
              ----
            </h3>
            {isStackTutorialsLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            ) : stackTutorials.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                {stackTutorials.map((video) => (
                  <div key={video.id} className="border rounded-lg p-4">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full"
                    />
                    <h4 className="mt-2 font-medium">{video.title}</h4>
                    <p className="text-sm text-gray-600">
                      {video.channelTitle}
                    </p>
                    <a
                      href={`https://www.youtube.com/watch?v=${video.id}`}
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
              <p>No tutorials found for this stack.</p>
            )}
          </div>
          {/* renders tech stack here */}
          <div className="grid grid-cols-2  lg:grid-cols-3">
            {currentStack?.recommendedStack.technologies.map((tech) => {
              return (
                <div key={tech._id}>
                  <button
                    onClick={() => handleExpandTech(tech.name)}
                    className="relative w-44 h-16 text-black bg-white m-4 rounded-3xl shadow transition duration-300 flex items-center justify-center hover:scale-110"
                  >
                    <TechIcon name={tech.name} />
                    <span className="font-semibold">{tech.name}</span>
                    <span className="absolute top-1 right-3 text-gray-400 text-xs">
                      click to expand
                    </span>
                  </button>

                  {expandedTech === tech.name && (
                    <TechPopUp
                      tech={tech}
                      techTutorials={techTutorials}
                      setExpandedTech={setExpandedTech}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4">Tips on getting started</h3>
            <p className="whitespace-pre-line">
              {currentStack?.gettingStarted}
            </p>
          </div>
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4">Additional Advice</h3>
            <p>{currentStack?.additionalAdvice}</p>
          </div>
          {/* <div className="mt-8">
          <h3 className="text-2xl font-bold mb-4">Alternative Stack</h3>
          <button
            onClick={() => setShowAlternative(!showAlternative)}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
          >
            {showAlternative ? "Hide" : "Show"} Alternative Option
          </button>

          {showAlternative && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <h4 className="text-xl font-semibold mb-2 text-gray-800">
                {currentStack?.alternativeStack.name}
              </h4>
              <p className="text-gray-600 mb-4">
                {currentStack?.alternativeStack.reasoning}
              </p>
              <h5 className="text-lg font-semibold mt-2 mb-1 text-gray-800">
                Technologies:
              </h5>
              <ul className="list-disc list-inside text-sm mt-2">
                {currentStack?.alternativeStack.technologies.map(
                  (tech, index) => (
                    <li key={index} className="text-gray-700">
                      {tech}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
        </div> */}
        </div>
      </div>
    </div>
  );
};

export default TechStackExplorer;
