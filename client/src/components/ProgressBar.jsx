import React from "react";

const ProgressBar = ({ currentPage }) => {
  let totalPages = 3;
  const progress = (currentPage / (totalPages - 1)) * 100;

  return (
    <div className="relative px-10">
      {/* Progress bar */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-[calc(100%-10rem)] h-1 bg-white">
        <div
          className="h-full bg-secondary transition-all duration-300 ease-in-out"
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
                  ? "bg-secondary border-secondary text-white"
                  : index === currentPage
                  ? "bg-white border-secondary text-secondary"
                  : "bg-white border-gray-300 text-gray-300"
              }`}
            >
              {index + 1}
            </div>
            <div className="mt-2 text-sm font-medium">
              {`Step ${index + 1}`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
