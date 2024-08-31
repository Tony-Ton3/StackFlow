import React from "react";

const ProgressBar = ({ currentPage }) => {
  let totalPages = 3;
  const progress = (currentPage / (totalPages - 1)) * 100;

  return (
    <div className="relative p-10">
      {/* Progress bar */}
      <div className="absolute top-14 left-1/2 transform -translate-x-1/2 w-[calc(100%-10rem)] h-1 bg-gray-200">
        <div
          className="h-full bg-purple-500 transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Numbered circles */}
      <div className="flex justify-between relative z-10">
        {[...Array(totalPages)].map((_, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                index < currentPage
                  ? "bg-purple-500 border-purple-500 text-white"
                  : index === currentPage
                  ? "bg-white border-purple-500 text-purple-500"
                  : "bg-white border-gray-300 text-gray-300"
              }`}
            >
              {index + 1}
            </div>
            <div className="mt-2 text-sm font-medium text-gray-500">
              {`Step ${index + 1}`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
