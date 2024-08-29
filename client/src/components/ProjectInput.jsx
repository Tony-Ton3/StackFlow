import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setStackSuccess, setStackFailure } from "../redux/techstackSlice";
import ProgressBar from "./ProgressBar";
import { getClaudeRecommendation } from "../utils/api";
import { projectQuestions } from "../constants/questions";
import TechStackExplorer from "./TechStackExplorer";

function ProjectInput() {
  const [form, setForm] = useState(() => {
    const savedForm = localStorage.getItem("projectForm");
    return savedForm
      ? JSON.parse(savedForm)
      : {
          description: "", //an descrioption of what the user wants to build
          projectType: "", //web, mobile, etc
          scale: "", //personal, startup, enterprise
          features: [], //an array of must have features for the project
          timeline: "", //development timeline
          experience: "", //expereince level of the user
          knownTechnologies: [], //getting more info about user experinece for more catered recommendation
        };
  });

  const resetForm = () => {
    //resets projectForm localStorage after submission
    const emptyForm = {
      description: "",
      projectType: "",
      scale: "",
      features: [],
      timeline: "",
      experience: "",
      knownTechnologies: [],
    };
    setForm(emptyForm);
    localStorage.removeItem("projectForm");
  };
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showTechStack, setShowTechStack] = useState(false);

  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { currentStack, loading } = useSelector((state) => state.stack);

  useEffect(() => {
    localStorage.setItem("projectForm", JSON.stringify(form));
  }, [form]);

  //handles text box changes
  const handleInputChange = (id, value) => {
    setForm((prev) => {
      const newForm = { ...prev, [id]: value };
      localStorage.setItem("projectForm", JSON.stringify(newForm));
      return newForm;
    });
  };

  //handles check box changes
  const handleMultiSelectChange = (id, value, isChecked) => {
    setForm((prev) => {
      const newForm = {
        ...prev,
        [id]: isChecked
          ? [...(prev[id] || []), value]
          : prev[id].filter((item) => item !== value),
      };
      localStorage.setItem("projectForm", JSON.stringify(newForm));
      return newForm;
    });
  };

  //navigates to the next page of the form
  const handleNext = () => {
    if (currentPage < projectQuestions.length - 1) {
      setCurrentPage((prev) => prev + 1);
    } else {
      //sends userinput to server to get recommendations
      handleRecommendation();
    }
  };

  //navigate to the previosu page of the form
  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  async function handleRecommendation() {
    try {
      setIsLoading(true);
      const recommendationObject = await getClaudeRecommendation(
        currentUser._id,
        form
      );
      resetForm(); //clears local storage
      dispatch(setStackSuccess(recommendationObject));
      setShowTechStack(true); // Set this to true after getting the recommendation
    } catch (error) {
      console.error("Error getting recommendation:", error);
      dispatch(setStackFailure(error));
    } finally {
      setIsLoading(false);
    }
  }

  if (showTechStack && currentStack) {
    return <TechStackExplorer currentStack={currentStack} />;
  }

  const renderQuestion = (question) => {
    switch (question.type) {
      case "text":
        return (
          <input
            type="text"
            value={form[question.id] || ""}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        );
      case "select":
        return (
          <select
            value={form[question.id] || ""}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select an option</option>
            {question.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case "multiselect":
        return (
          <div className="mt-2">
            {question.options.map((option) => (
              <label key={option} className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  checked={form[question.id]?.includes(option)}
                  onChange={(e) =>
                    handleMultiSelectChange(
                      question.id,
                      option,
                      e.target.checked
                    )
                  }
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const currentPageQuestions = projectQuestions[currentPage];

  return (
    <div className="bg-black min-h-screen flex flex-col justify-center items-center">
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {currentPageQuestions.title}
          </h2>
          <ProgressBar
            currentStep={currentPage}
            totalSteps={projectQuestions.length}
          />

          <div className="mt-8 space-y-6">
            {currentPageQuestions.questions.map((question) => (
              <div key={question.id}>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  {question.question}
                </label>
                {renderQuestion(question)}
              </div>
            ))}
          </div>

          <div
            className={`flex ${
              !currentPage ? "justify-end" : "justify-between"
            } mt-8`}
          >
            {currentPage > 0 && (
              <button
                onClick={handlePrevious}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
              >
                Previous
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
            >
              {currentPage === projectQuestions.length - 1
                ? isLoading
                  ? "Looking for the best stack..."
                  : "Find Stack"
                : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProjectInput;
