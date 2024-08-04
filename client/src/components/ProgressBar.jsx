export default function ProgressBar({ currentStep, totalSteps }) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
      <div
        className="bg-purple-500 h-2.5 rounded-full transition-all duration-300 ease-in-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
