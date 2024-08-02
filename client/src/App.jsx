import { useState } from "react";
import ProjectInput from "./components/ProjectInput";
import TechStackExplorer from "./components/TechStackExplorer";

export default function App() {
  const [recommendation, setRecommendation] = useState(null);

  console.log("Recommendation in App:", recommendation);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      {recommendation ? (
        <TechStackExplorer recommendation={recommendation} />
      ) : (
        <ProjectInput onStackRecommended={setRecommendation} />
      )}
    </div>
  );
}
