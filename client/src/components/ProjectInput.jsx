import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setStackSuccess, setStackFailure } from "../redux/techstackSlice";
import ProgressBar from "./ProgressBar";
import { getClaudeRecommendation } from "../utils/api";
import { projectQuestions } from "../constants/questions";
import Header from "./Header";

function ProjectInput() {
  const [currentPage, setCurrentPage] = useState(0);
  const [form, setForm] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const handleInputChange = (id, value) => {
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleMultiSelectChange = (id, value, isChecked) => {
    setForm((prev) => ({
      ...prev,
      [id]: isChecked
        ? [...(prev[id] || []), value] // Initialize with an empty array if undefined
        : prev[id].filter((item) => item !== value),
    }));
  };

  const handleNext = () => {
    if (currentPage < projectQuestions.length - 1) {
      setCurrentPage((prev) => prev + 1);
    } else {
      //sends userinput to server to get recommendations
      handleRecommendation();
    }
  };

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
      dispatch(setStackSuccess(recommendationObject));
      console.log("recommendation", recommendationObject);
      navigate("/techstackexplorer");
    } catch (error) {
      console.error("Error getting recommendation:", error);
      dispatch(setStackFailure(error));
    } finally {
      setIsLoading(false);
    }
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
    <div className="bg-black">
      <Header />
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {currentPageQuestions.title}
        </h2>
        <ProgressBar
          currentStep={currentPage}
          totalSteps={projectQuestions.length}
        />

        {currentPageQuestions.questions.map((question) => (
          // key for optimization
          <div key={question.id} className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {question.question}
            </label>
            {renderQuestion(question)}
          </div>
        ))}
        {/* {error && <p className="text-red-500 mb-4">{error}</p>} */}
        <div
          className={`flex ${
            !currentPage ? "justify-end" : "justify-between"
          } mt-6`}
        >
          <button
            onClick={handlePrevious}
            hidden={currentPage === 0} //if on page 1
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
  );
}

export default ProjectInput;
