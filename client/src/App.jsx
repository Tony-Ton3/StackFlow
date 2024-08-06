import { useState } from "react";
import ProjectInput from "./components/ProjectInput";
import TechStackExplorer from "./components/TechStackExplorer";

export default function App() {
  //used to set user inputs, once set, TechStack Explorer is mounted
  const [recommendation, setRecommendation] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      {recommendation ? (
        <TechStackExplorer recommendation={recommendation} />
      ) : (
        <ProjectInput setRecommendation={setRecommendation} />
      )}
    </div>
  );
}
