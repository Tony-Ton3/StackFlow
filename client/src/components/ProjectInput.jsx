import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setStackSuccess, setStackFailure } from "../redux/techstackSlice";
import ProgressBar from "./ProgressBar";
import { getClaudeRecommendation } from "../utils/api";
import { projectQuestions } from "../constants/questions";
import TechStackExplorer from "./TechStackExplorer";
import { IoIosArrowDropdown, IoMdAdd, IoMdCheckmark } from "react-icons/io";

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
    //clear local storage if user wants another recommendation
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
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    console.log(form);
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
    console.log(form);
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
    return (
      <TechStackExplorer
        currentStack={currentStack}
        isNewSubmission={true}
        onBackToSaved={() => navigate("/createdstacks")}
      />
    );
  }

  const renderQuestion = (question) => {
    switch (question.type) {
      case "text":
        return (
          <textarea
            id={question.id}
            value={form[question.id] || ""}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className="shadow-sm border rounded w-full h-32 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            placeholder="I want to build a tech stack suggestions application catered to the project idea and needs"
          />
        );
      case "select":
        return (
          <div className="relative">
            <select
              id={question.id}
              value={form[question.id] || ""}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              onFocus={() => setIsSelectOpen(true)}
              onBlur={() => setIsSelectOpen(false)}
              className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="" disabled>
                Select an option
              </option>
              {question.options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <IoIosArrowDropdown
                className={`size-5 transition-transform duration-300 ${
                  isSelectOpen ? "" : "rotate-180"
                }`}
              />
            </div>
          </div>
        );
      case "multiselect":
        return (
          <div className="flex flex-wrap gap-2">
            {question.options.map((option, index) => {
              const isSelected = form[question.id]?.includes(option) || false;
              return (
                <button
                  key={index}
                  onClick={() =>
                    handleMultiSelectChange(question.id, option, !isSelected)
                  }
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                    isSelected
                      ? "bg-pink-500 text-white"
                      : "bg-blue-500 text-white"
                  }`}
                >
                  {option}
                  <span className="ml-2">
                    {isSelected ? (
                      <IoMdCheckmark className="h-4 w-4" />
                    ) : (
                      <IoMdAdd className="h-4 w-4" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        );
      default:
        return null;
    }
  };

  const currentPageQuestions = projectQuestions[currentPage];

  return (
    <div className="bg-gray-800 min-h-screen flex flex-col justify-center items-center">
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="bg-gray-100 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {currentPageQuestions.title}
          </h2>
          <ProgressBar currentPage={currentPage} />
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
