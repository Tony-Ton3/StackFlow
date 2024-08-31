import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setSavedStackSuccess,
  setSavedStackFailure,
} from "../redux/savedstackSlice";
import TechStackExplorer from "../components/TechStackExplorer";

export default function Saved() {
  const dispatch = useDispatch();
  const { currentSavedStack } = useSelector((state) => state.savedStack);
  const [selectedStack, setSelectedStack] = useState(null);

  //returns all created stack based on the userId
  useEffect(() => {
    const fetchAllSavedStack = async () => {
      try {
        const response = await fetch(
          "http://localhost:3002/api/user/getallsavedstacks",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to get stacks");
        }
        const data = await response.json();
        dispatch(setSavedStackSuccess(data));
      } catch (error) {
        dispatch(setSavedStackFailure(error.message));
        console.error("Error fetching stacks for user:", error);
      }
    };

    fetchAllSavedStack();
  }, [dispatch]);

  const handleSelectSavedStack = (stack) => {
    setSelectedStack(stack);
  };

  const handleBackToList = () => {
    setSelectedStack(null);
  };

  if (selectedStack) {
    return (
      <div>
        <TechStackExplorer
          currentStack={selectedStack}
          isNewSubmission={false}
          handleBackToList={handleBackToList}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Saved Stacks</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentSavedStack?.map((stack, index) => (
          <div
            key={stack.id || index}
            className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
            onClick={() => handleSelectSavedStack(stack)}
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">
                {stack.recommendedStack.name}
              </h3>
              <p className="text-gray-600">
                {stack.recommendedStack.description}
              </p>
              <div className="mt-4">
                <strong>Technologies:</strong>
                <ul className="list-disc list-inside">
                  {stack.recommendedStack.technologies.map((tech) => (
                    <li key={tech._id || tech.name}>{tech.name}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
