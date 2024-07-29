import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const projectTypes = [
  {
    name: "Personal Blog",
    description: "A website to share your thoughts and experiences",
    components: ["Frontend", "Backend", "Database"],
  },
  {
    name: "E-commerce Store",
    description: "An online shop to sell products",
    components: ["Frontend", "Backend", "Database", "Payment Integration"],
  },
  {
    name: "Task Management App",
    description: "An application to organize and track tasks",
    components: ["Frontend", "Backend", "Database", "User Authentication"],
  },
  {
    name: "Social Media Platform",
    description: "A platform for users to connect and share content",
    components: [
      "Frontend",
      "Backend",
      "Database",
      "User Authentication",
      "Real-time Features",
    ],
  },
  // Add more project types as needed
];

const techStack = {
  Frontend: ["HTML", "CSS", "JavaScript", "React"],
  Backend: ["Node.js", "Express.js"],
  Database: ["MongoDB"],
  "User Authentication": ["JWT", "Passport.js"],
  "Payment Integration": ["Stripe API"],
  "Real-time Features": ["Socket.io"],
};

function UserPreferences() {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState(null);
  const [learningPath, setLearningPath] = useState([]);

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    const newLearningPath = project.components.map((component) => ({
      name: component,
      technologies: techStack[component] || [],
      completed: false,
    }));
    setLearningPath(newLearningPath);
  };

  const toggleComponentCompletion = (index) => {
    setLearningPath((prevPath) =>
      prevPath.map((component, i) =>
        i === index
          ? { ...component, completed: !component.completed }
          : component
      )
    );
  };

  const handleSubmit = () => {
    navigate("/search", { state: { selectedProject, learningPath } });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        What would you like to build?
      </h2>

      <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2">
        {projectTypes.map((project) => (
          <div
            key={project.name}
            className={`p-4 rounded border cursor-pointer transition duration-150 ${
              selectedProject === project
                ? "border-purple-500 bg-purple-50"
                : "border-gray-200 hover:border-purple-300"
            }`}
            onClick={() => handleProjectSelect(project)}
          >
            <h3 className="font-semibold text-lg">{project.name}</h3>
            <p className="text-sm text-gray-600">{project.description}</p>
          </div>
        ))}
      </div>

      {selectedProject && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">
            Your Learning Path:
          </h3>
          <div className="space-y-4">
            {learningPath.map((component, index) => (
              <div key={component.name} className="p-4 bg-gray-50 rounded">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{component.name}</h4>
                  <button
                    onClick={() => toggleComponentCompletion(index)}
                    className={`px-3 py-1 rounded text-sm ${
                      component.completed
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {component.completed ? "Completed" : "Mark as Completed"}
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  Key technologies: {component.technologies.join(", ")}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!selectedProject}
        className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 transition duration-150"
      >
        Get Started with Your Project
      </button>
    </div>
  );
}

export default UserPreferences;
